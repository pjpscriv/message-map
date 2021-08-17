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

@Component({
  selector: 'app-main-view',
  templateUrl: './main-view.component.html',
  styleUrls: ['./main-view.component.css']
})
export class MainViewComponent implements AfterViewInit, OnDestroy {
  @ViewChild('mainViewContainer') containerEl: any;
  @ViewChild('scatterplot') canvasEl: any;
  private canvasWrapperSize$: BehaviorSubject<ResizedEvent>;
  private canvasContext: any;
  private destroyed$ = new Subject();
  private filter: Crossfilter<Message>;

  // Dates
  private minDate = new Date(2010, 1, 1);
  private maxDate = new Date(2020, 1, 1);
  private minTime = new Date(2000, 0, 1, 0, 0, 1);
  private maxTime = new Date(2000, 0, 1, 23, 59, 59);

  // Axes
  private scaleX: any;
  private scaleY: any;
  private axisX: any;
  private axisY: any;

  // UI Constants
  public yAxisWidth = 50;
  public xAxisBottom = 0;
  private margin = 10;

  constructor(
    private store: Store<AppState>,
    private filterService: FilterService
  ) {
    const initialSize = new ResizedEvent(new ElementRef(null), 0, 0, 0, 0);
    this.canvasWrapperSize$ = new BehaviorSubject<ResizedEvent>(initialSize);

    this.filter = crossfilter([]);
  }


  public ngAfterViewInit(): void {
    this.canvasContext = this.canvasEl.nativeElement.getContext('2d');

    this.canvasWrapperSize$.pipe(
      takeUntil(this.destroyed$),
      tap(() => this.drawAxes()),
      debounceTime(1000),
      map((event: ResizedEvent) => {
        this.canvasEl.nativeElement.height = event.newHeight;
        this.canvasEl.nativeElement.width = event.newWidth;
        this.canvasContext.clearRect(0, 0, this.canvasEl.nativeElement.width, this.canvasEl.nativeElement.height);

        const zoom = d3.zoom()
          .scaleExtent([1, 1600])
          .translateExtent([[0, 0], [this.canvasEl.nativeElement.clientWidth, this.canvasEl.nativeElement.clientHeight]])
          .on('zoom', (transform: ZoomTransform) => this.onZoom(transform));

        d3.select(this.canvasEl.nativeElement).call(zoom);

        // TODO: remember zoom level - broken atm
        this.drawScatterplot();

        console.log('Resized canvas: ', this.canvasContext.canvas.width, this.canvasContext.canvas.height);
      })
    ).subscribe();

    this.filterService.getMessageFilter().pipe(
        takeUntil(this.destroyed$),
        filter(messages => !!messages && messages?.size() !== 0))
      .subscribe((messagesFilter: Crossfilter<Message>) => {
        this.filter = messagesFilter;
        const dateRange = messagesFilter.dimension((message: Message) => message.date);
        this.minDate = dateRange.bottom(1)[0].date;
        this.maxDate = dateRange.top(1)[0].date;
        console.log(`Messages received: ${messagesFilter.size()}`);
        // this.drawScatterplot();
        this.onZoom({ transform: {x: 0, y: 0, k: 1}});
      });
  }


  public ngOnDestroy(): void {
    this.destroyed$.next();
  }


  private drawAxes(transform?: any): void {
    // Get New Values
    const canvasEl = this.canvasEl.nativeElement;
    const containerEl = this.containerEl.nativeElement;
    const w1 = canvasEl.clientWidth - this.margin;
    const h1 = canvasEl.clientHeight - this.margin;
    const xAxisShift = ((containerEl.clientWidth - canvasEl.clientWidth) + this.yAxisWidth) / 2;
    const yAxisShift = (containerEl.clientHeight - canvasEl.clientHeight) / 2;

    // Set up Axes
    this.scaleX = d3.scaleTime().range([this.margin, w1]).domain([this.minDate, this.maxDate]);
    this.scaleY = d3.scaleTime().range([this.margin, h1]).domain([this.minTime, this.maxTime]);

    if (transform?.rescaleX) {
      this.scaleX = transform.rescaleX(this.scaleX); // .interpolate(d3.interpolateRound);
      this.scaleY = transform.rescaleY(this.scaleY); // .interpolate(d3.interpolateRound);
    }

    const tickSeconds = (this.scaleX.ticks()[1] - this.scaleX.ticks()[0]) / 1000;
    if (tickSeconds < SECONDS_PER_DAY) {
      this.axisX = d3.axisBottom(this.scaleX).tickValues(this.customTicks(this.scaleX.domain()));
    } else {
      this.axisX = d3.axisBottom(this.scaleX);
    }

    this.axisY = d3.axisLeft(this.scaleY).ticks(12);
      // .tickFormat(x => {
      //     let s = new DatePipe('en-US').transform(x as Date, 'haaaaa\'m\'') as string;
      //     s = s === '12am' ? 'midnight' : s === '12pm' ? 'midday' : s;
      //     return s;
      // });

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


  private drawScatterplot(scale: number = 1): void {
    // this.drawAxes();
    this.canvasContext.clearRect(0, 0, this.canvasEl.nativeElement.width, this.canvasEl.nativeElement.height);
    const colorBase = '#0099FF';

    this.filter.allFiltered().forEach((d: Message) => {
      this.canvasContext.beginPath();
      // const useColors = coloredBarchart && colorScale.domain().includes(coloredBarchart.get_data(d));
      const useColors = false;

      // console.count('draw');
      // this.canvasContext.fillStyle = colorScale(coloredBarchart.get_data(d));
      this.canvasContext.fillStyle = useColors ? '' : colorBase;
      this.canvasContext.globalAlpha = 0.3;

      const radius = 2 * Math.log(scale + 1);
      this.canvasContext.arc(this.scaleX(d.date), this.scaleY(d.timeSeconds), radius, 0, 2 * Math.PI, true);

      this.canvasContext.fill();
      this.canvasContext.closePath();
    });
  }


  public onResized(event: ResizedEvent): void {
    this.canvasWrapperSize$.next(event);
  }


  private customTicks(domain: Array<any>): Array<Date> {
    const time = d3.timeDay.ceil(domain[0]);
    const timeEnd = d3.timeDay.ceil(domain[1]);
    const times = [];
    while (time < timeEnd) {
      times.push(new Date(+time));
      time.setDate(time.getDate() + 1);
    }
    return times;
  }


  private onZoom({transform}: any): void {
    console.log(`Zoomed!: ${transform.x}, ${transform.y}, ${transform.k}`);
    this.canvasContext.save();
    // this.canvasContext.translate(transform.x, transform.y);
    // this.canvasContext.scale(transform.k, transform.k);
    this.drawAxes(transform);
    this.drawScatterplot(transform.k);
    this.canvasContext.restore();
  }
}
