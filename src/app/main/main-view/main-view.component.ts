import {AfterViewInit, Component, ElementRef, OnDestroy, ViewChild} from '@angular/core';
import {Store} from '@ngrx/store';
import {ResizedEvent} from 'angular-resize-event';
import * as d3 from 'd3';
import {ZoomTransform} from 'd3';
import {BehaviorSubject, Subject} from 'rxjs';
import {debounceTime, filter, map, takeUntil, tap} from 'rxjs/operators';
import {AppState} from 'src/app/store/app.state';
import {Message} from '../../models/message.interface';
import {Crossfilter} from 'src/app/models/crossfilter.aliases';
import {FilterService} from '../../shared/filter.service';
import crossfilter from 'crossfilter2';

const SECONDS_PER_DAY = 86400;

class MockTransform {
  x = 0;
  y = 0;
  k = 1;
  translate(x: number, y: number): MockTransform {
    this.x = x;
    this.y = y;
    return this;
  }
}

@Component({
  selector: 'app-main-view',
  templateUrl: './main-view.component.html',
  styleUrls: ['./main-view.component.css']
})
export class MainViewComponent implements AfterViewInit, OnDestroy {
  @ViewChild('mainViewContainer') containerEl: any;
  @ViewChild('scatterplot') canvasEl: any;
  private initialSize = new ResizedEvent(new ElementRef(null), 0, 0, 0, 0);
  public canvasWrapperSize$ = new BehaviorSubject<ResizedEvent>(this.initialSize);
  private canvasContext: any;
  private oldCanvasSize: any;
  private destroyed$ = new Subject();

  // Filters
  private filter = crossfilter([] as Message[]);
  private dateDimension = this.filter.dimension((m: Message) => m.date);
  private timeDimension = this.filter.dimension((m: Message) => m.timeSeconds);

  // Dates
  private minDate = new Date(2010, 1, 1);
  private maxDate = new Date(2020, 1, 1);
  private minTime = new Date(2000, 0, 1, 0, 0, 1);
  private maxTime = new Date(2000, 0, 1, 23, 59, 59);

  // Axes
  private scaleX = d3.scaleTime().domain([this.minDate, this.maxDate]);
  private scaleY = d3.scaleTime().domain([this.minTime, this.maxTime]);
  private axisX: any;
  private axisY: any;
  private transform: ZoomTransform = new MockTransform() as ZoomTransform;

  // UI Constants
  public yAxisWidth = 50;
  public xAxisBottom = 0;
  private margin = 10;

  constructor(
    private store: Store<AppState>,
    private filterService: FilterService
  ) {}


  public ngAfterViewInit(): void {
    this.canvasContext = this.canvasEl.nativeElement.getContext('2d');

    this.oldCanvasSize = {
      width: this.canvasEl.nativeElement.clientWidth,
      height: this.canvasEl.nativeElement.clientHeight
    };

    // Get Canvas Size
    this.canvasWrapperSize$.pipe(
      takeUntil(this.destroyed$),
      tap(() => this.drawAxes()),
      debounceTime(400),
      map((event: ResizedEvent) => {

        // Set new canvas size
        this.canvasEl.nativeElement.height = event.newHeight;
        this.canvasEl.nativeElement.width = event.newWidth;

        const clientWidth = this.canvasEl.nativeElement.clientWidth;
        const clientHeight = this.canvasEl.nativeElement.clientHeight;

        // Add Zoom & Scales
        const zoom = d3.zoom()
          .scaleExtent([1, 1600])
          .translateExtent([[0, 0], [clientWidth, clientHeight]])
          .on('zoom', (transform: ZoomTransform) => this.onZoom(transform));
        d3.select(this.canvasEl.nativeElement).call(zoom);
        this.scaleX.range([this.margin, clientWidth - this.margin]);
        this.scaleY.range([this.margin, clientHeight - this.margin]);

        // Fancy maths to get correct resize shift
        const k = this.transform.k;
        const x1 = this.transform.x;
        const y1 = this.transform.y;

        const widthRatio = x1 / (k * this.oldCanvasSize.width);
        const heightRatio = y1 / (k * this.oldCanvasSize.height);

        const x2 = widthRatio * event.newWidth * this.transform.k;
        const y2 = heightRatio * event.newHeight * this.transform.k;

        this.oldCanvasSize.width = event.newWidth;
        this.oldCanvasSize.height = event.newHeight;

        // Shift View after Resize
        d3.select(this.canvasEl.nativeElement).transition().duration(0)
          .call(zoom.translateBy, (x2 - x1) / k, (y2 - y1) / k);

        // Draw!
        this.drawAxes();
        this.drawScatterplot();
      })
    ).subscribe();

    // Get Messages
    this.filterService.getMessageFilter().pipe(
        takeUntil(this.destroyed$),
        filter(messages => !!messages && messages?.size() > 0))
      .subscribe((messagesFilter: Crossfilter<Message>) => {
        this.filter = messagesFilter;
        this.dateDimension = messagesFilter.dimension((message: Message) => message.date);
        this.timeDimension = messagesFilter.dimension((message: Message) => message.timeSeconds);
        this.minDate = this.dateDimension.bottom(1)[0].date;
        this.maxDate = this.dateDimension.top(1)[0].date;
        console.log(`Messages received: ${messagesFilter.size()}`);

        this.scaleX.domain([this.minDate, this.maxDate]);
        this.scaleY.domain([this.minTime, this.maxTime]);

        this.drawAxes();
        this.drawScatterplot();
      });
  }


  private drawAxes(): void {
    // Zoom Axes
    if (this.transform?.rescaleX) {
      this.scaleX = this.transform.rescaleX(this.scaleX.domain([this.minDate, this.maxDate]));
      this.scaleY = this.transform.rescaleY(this.scaleY.domain([this.minTime, this.maxTime]));
    }

    // Draw Ticks
    const tickSeconds = (this.scaleX.ticks()[1]?.getTime() - this.scaleX.ticks()[0]?.getTime()) / 1000;
    if (tickSeconds < SECONDS_PER_DAY) {
      this.axisX = d3.axisBottom(this.scaleX).tickValues(this.customTicks(this.scaleX.domain()));
    } else {
      this.axisX = d3.axisBottom(this.scaleX);
    }
    this.axisY = d3.axisLeft(this.scaleY).ticks(12); // .tickFormat(x => this.timeTickFormat(x))

    const canEl = this.canvasEl.nativeElement;
    const conEl = this.containerEl.nativeElement;
    const xAxisShift = ((conEl.clientWidth - canEl.clientWidth) + this.yAxisWidth) / 2;
    const yAxisShift = (conEl.clientHeight - canEl.clientHeight) / 2;

    // Clear Axes
    d3.select('.y-axis').selectAll('.axis--y').remove();
    d3.select('.x-axis').selectAll('.axis--x').remove();

    // Draw New Axes
    d3.select('.x-axis').append('g').attr('class', 'x axis--x')
      .attr('transform', `translate(${xAxisShift}, 1)`).call(this.axisX);
    d3.select('.y-axis').append('g').attr('class', 'y axis--y')
      .attr('transform', `translate(${this.yAxisWidth - 1}, ${yAxisShift})`).call(this.axisY);

    setTimeout(() => this.xAxisBottom = yAxisShift - 20, 0); // To fix NG0100 Error
  }


  private drawScatterplot(): void {
    // this.drawAxes();
    const colorBase = '#0099FF';
    const radius = 2 * Math.log(this.transform.k + 1);

    this.canvasContext.clearRect(0, 0, this.canvasEl.nativeElement.width, this.canvasEl.nativeElement.height);

    this.dateDimension.filterRange([this.scaleX.domain()[0], this.scaleX.domain()[1]]);
    this.timeDimension.filterRange([this.scaleY.domain()[0], this.scaleX.domain()[1]]);

    this.filter.allFiltered().forEach((d: Message) => {
      this.canvasContext.beginPath();
      // const useColors = coloredBarchart && colorScale.domain().includes(coloredBarchart.get_data(d));
      const useColors = false;
      this.canvasContext.fillStyle = useColors ? '' : colorBase;
      this.canvasContext.globalAlpha = 0.3;
      this.canvasContext.arc(this.scaleX(d.date), this.scaleY(d.timeSeconds), radius, 0, 2 * Math.PI, true);
      this.canvasContext.fill();
      this.canvasContext.closePath();
    });
  }


  private customTicks(domain: Array<any>): Array<Date> {
    const date = d3.timeDay.ceil(domain[0]);
    const EndDate = d3.timeDay.ceil(domain[1]);
    const dates = [];
    while (date < EndDate) {
      dates.push(new Date(+date));
      date.setDate(date.getDate() + 1);
    }
    return dates;
  }


  // TODO: Use normal D3 Tick function except for midnight and midday
  private timeTickFormat(x: Date): string {
      // let s = new DatePipe('en-US').transform(x as Date, 'haaaaa\'m\'') as string;
      // s = s === '12am' ? 'midnight' : s === '12pm' ? 'midday' : s;
      return 'Whoop!';
  }


  private onZoom({transform}: any): void {
    this.transform = transform;
    this.drawAxes();
    this.drawScatterplot();
  }


  public ngOnDestroy(): void {
    this.destroyed$.next();
  }
}
