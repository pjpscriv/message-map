import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { ResizedEvent } from 'angular-resize-event';
import * as d3 from 'd3';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { debounceTime, filter, map, take, tap } from 'rxjs/operators';
import { selectMessages } from 'src/app/store/app.selectors';
import { AppState } from 'src/app/store/app.state';
import { Message } from '../../models/message.interface';
import { DatePipe } from '@angular/common';
import { Crossfilter } from 'src/app/models/crossfilter.aliases';
import { ZoomTransform } from 'd3';

@Component({
  selector: 'app-main-view',
  templateUrl: './main-view.component.html',
  styleUrls: ['./main-view.component.css']
})
export class MainViewComponent implements AfterViewInit {
  @ViewChild('mainViewContainer') containerEl: any;
  @ViewChild('scatterplot') canvasEl: any;
  private canvasWrapperSize$: BehaviorSubject<ResizedEvent>;
  private canvasContext: any;
  private messages$: Observable<Crossfilter<Message>>;

  // Dates
  private minDate = new Date(2010, 1, 1);
  private maxDate = new Date(2020, 1, 1);

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
    private store: Store<AppState>
  ) {
    const initialSize = new ResizedEvent(new ElementRef(null), 0, 0, 0, 0);
    this.canvasWrapperSize$ = new BehaviorSubject<ResizedEvent>(initialSize);

    this.messages$ = this.store.pipe(select(selectMessages),
      filter(messages => !!messages && messages?.size() !== 0),
      tap(messages => {
        const dateRange = messages.dimension((message: Message) => message.date);
        this.minDate = dateRange.bottom(1)[0].date;
        this.maxDate = dateRange.top(1)[0].date;
      }));
  }


  public ngAfterViewInit(): void {
    this.canvasContext = this.canvasEl.nativeElement.getContext('2d');

    const canvasSize$ = this.canvasWrapperSize$.pipe(
      tap(() => this.drawAxes()),
      debounceTime(1000),
      map((event: ResizedEvent) => {
        this.canvasEl.nativeElement.height = event.newHeight;
        this.canvasEl.nativeElement.width = event.newWidth;
        this.canvasContext.clearRect(0, 0, this.canvasEl.nativeElement.width, this.canvasEl.nativeElement.height);

        d3.select(this.canvasEl.nativeElement).call(
          d3.zoom()
          .scaleExtent([1, 300])
          .translateExtent([[0, 0], [this.canvasEl.nativeElement.clientWidth, this.canvasEl.nativeElement.clientHeight]])
          .on('zoom', (transform: ZoomTransform) => this.onZoom(transform))
        );
        console.log('Resized canvas: ', this.canvasContext.canvas.width, this.canvasContext.canvas.height);
      })
    );

    combineLatest([this.messages$, canvasSize$])
      .pipe(debounceTime(1000))
      .subscribe(([messages, _]) => this.drawScatterplot(messages));
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
    this.scaleY = d3.scaleTime().range([this.margin, h1]);

    if (transform) {
      this.scaleX = transform.rescaleX(this.scaleX)//.interpolate(d3.interpolateRound);
      this.scaleY = transform.rescaleY(this.scaleY)//.interpolate(d3.interpolateRound);
    }

    this.axisX = d3.axisBottom(this.scaleX);
    this.axisY = d3.axisLeft(this.scaleY)
      .ticks(d3.timeHour.every(2), '%I %p')
      .tickFormat(x => {
          let s = new DatePipe('en-US').transform(x as Date, 'haaaaa\'m\'') as string;
          s = s === '12am' ? 'midnight' : s === '12pm' ? 'midday' : s;
          return s;
      });

    // Clear Axes
    d3.select('.y-axis').selectAll('.axis--y').remove();
    d3.select('.x-axis').selectAll('.axis--x').remove();

    // Draw New Axes
    d3.select('.x-axis').append('g').attr('class', 'x axis--x')
      .attr('transform', `translate(${xAxisShift}, 1)`).call(this.axisX);
    d3.select('.y-axis').append('g').attr('class', 'y axis--y')
      .attr('transform', `translate(${this.yAxisWidth-1}, ${yAxisShift})`).call(this.axisY);

    // Timeout to get around https://angular.io/errors/NG0100
    setTimeout(() => this.xAxisBottom = yAxisShift - 20, 0);
  }


  private drawScatterplot(messages: Crossfilter<Message>, scale?: number): void {
    // this.drawAxes();
    this.canvasContext.clearRect(0, 0, this.canvasEl.nativeElement.width, this.canvasEl.nativeElement.height);
    const colorBase = '#0099FF';

      // this.canvasContext.globalAlpha = 1;
      // this.canvasContext.fillStyle = '#00FF00';
      // this.canvasContext.rect(0, 0, this.canvasEl.nativeElement.width, this.canvasEl.nativeElement.height)
      // this.canvasContext.fill()

    messages.allFiltered().forEach((d: Message) => {
      this.canvasContext.beginPath();
      // const useColors = coloredBarchart && colorScale.domain().includes(coloredBarchart.get_data(d));
      const useColors = false;
      // this.canvasContext.fillStyle = colorScale(coloredBarchart.get_data(d));
      this.canvasContext.fillStyle = useColors ? '' : colorBase;
      this.canvasContext.globalAlpha = 0.5;

      if (!scale || scale < 40){
        this.canvasContext.arc(this.scaleX(d.date), this.scaleY(d.timeSeconds), 2, 0, 2 * Math.PI, true);
      } else {
        const radius = 2// + ((scale - 40) / 2);
        this.canvasContext.arc(this.scaleX(d.date), this.scaleY(d.timeSeconds), radius, 0, 2 * Math.PI, true);
      }
      this.canvasContext.fill();
      this.canvasContext.closePath();
    });
  }


  public onResized(event: ResizedEvent): void {
    this.canvasWrapperSize$.next(event);
  }


  private onZoom({transform}: any): void {
    console.log(`Zoomed!: ${transform.x}, ${transform.y}, ${transform.k}`)
    this.messages$.pipe(take(1))
      .subscribe((messages: Crossfilter<Message>) => {
        this.canvasContext.save()
        // this.canvasContext.translate(transform.x, transform.y);
        // this.canvasContext.scale(transform.k, transform.k);
        this.drawAxes(transform);
        this.drawScatterplot(messages, transform.k);
        this.canvasContext.restore();
      })
  }
}
