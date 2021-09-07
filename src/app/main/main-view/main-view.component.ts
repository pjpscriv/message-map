import {AfterViewInit, Component, ElementRef, OnDestroy, ViewChild} from '@angular/core';
import {Store} from '@ngrx/store';
import {ResizedEvent} from 'angular-resize-event';
import * as d3 from 'd3';
import {ZoomTransform} from 'd3';
import {BehaviorSubject, Subject} from 'rxjs';
import {debounceTime, filter, takeUntil, tap} from 'rxjs/operators';
import {AppState} from 'src/app/store/app.state';
import {Message} from '../../types/message.interface';
import {Crossfilter} from 'src/app/types/crossfilter.aliases';
import {FilterService} from '../../shared/filter.service';
import crossfilter from 'crossfilter2';
import {dayLimitedAxis} from './d3-helper.functions';
import {COLOR_ENUM, ColorService} from '../../shared/color.service';

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

  // Scales
  private scaleX = d3.scaleTime().domain([this.minDate, this.maxDate]);
  private scaleY = d3.scaleTime().domain([this.minTime, this.maxTime]);
  private transform: ZoomTransform = d3.zoomIdentity;
  private transformX: ZoomTransform = d3.zoomIdentity;
  private transformY: ZoomTransform = d3.zoomIdentity;
  private colorScale = d3.scaleOrdinal().range(([
    '#009688',
    '#8bc34a',
    '#ffeb3b',
    '#ff9800',
    '#f44336',
    '#ff66cc',
    '#9c27b0',
    '#673ab7',
    '#704880',
    '#795548']));

  // UI Values
  public yAxisWidth = 40;
  public xAxisHeight = 20;
  private margin = 10;

  constructor(
    private store: Store<AppState>,
    private filterService: FilterService,
    private colorService: ColorService
  ) {}


  public ngAfterViewInit(): void {
    this.canvasContext = this.canvasEl.nativeElement.getContext('2d');

    this.oldCanvasSize = {
      width: this.canvasEl.nativeElement.clientWidth,
      height: this.canvasEl.nativeElement.clientHeight
    };

    // Canvas resize
    this.canvasWrapperSize$.pipe(
      takeUntil(this.destroyed$),
      tap(() => this.drawAxes()),
      debounceTime(400)
    ).subscribe((event: ResizedEvent) => {
      this.setCanvasSize(event);
      this.drawScatterplot();
    });

    // Messages
    this.filterService.getMessageFilter().pipe(
      takeUntil(this.destroyed$),
      filter(messages => !!messages && messages?.size() > 0)
    ).subscribe((messagesFilter: Crossfilter<Message>) => {
      console.log(`Messages received: ${messagesFilter.size()}`);
      this.setData(messagesFilter);
      this.drawAxes();
      this.drawScatterplot();
    });

    // Redraw
    this.filterService.getFilterRedraw().subscribe(() => {
      this.drawScatterplot();
    });
  }

  private setData(messagesFilter: Crossfilter<Message>): void {
    this.filter = messagesFilter;
    this.dateDimension = messagesFilter.dimension((message: Message) => message.date);
    this.timeDimension = messagesFilter.dimension((message: Message) => message.timeSeconds);
    this.minDate = this.dateDimension.bottom(1)[0].date;
    this.maxDate = this.dateDimension.top(1)[0].date;
    this.scaleX.domain([this.minDate, this.maxDate]);
    this.scaleY.domain([this.minTime, this.maxTime]);
  }

  private setCanvasSize(event: ResizedEvent): void {
    // Set new canvas size
    this.canvasEl.nativeElement.height = event.newHeight;
    this.canvasEl.nativeElement.width = event.newWidth;

    const clientWidth = this.canvasEl.nativeElement.clientWidth;
    const clientHeight = this.canvasEl.nativeElement.clientHeight;

    // 2nd Zooms
    const zoomX = d3.zoom()
      .scaleExtent([1, 1600])
      .on('zoom', e => this.onZoomX(e));
    const zoomY = d3.zoom()
      .scaleExtent([1, 1600])
      .on('zoom', e => this.onZoomY(e));

    d3.select('.axis--x').call(zoomX as any);
    d3.select('.axis--y').call(zoomY as any);

    // Add Zoom
    const zoom = d3.zoom()
      .scaleExtent([1, 1600])
      .translateExtent([[0, 0], [clientWidth, clientHeight]])
      .on('zoom', e => this.onZoom(e));
    d3.select(this.canvasEl.nativeElement).call(zoom);

    // Fancy maths to shift view after resize
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
  }

  private drawAxes(): void {
    // Zoom Axes
    if (this.transform?.rescaleX) {
      this.scaleX = this.transform.rescaleX(this.scaleX.domain([this.minDate, this.maxDate]));
      this.scaleY = this.transform.rescaleY(this.scaleY.domain([this.minTime, this.maxTime]));
    }

    // Get Translate Values
    const spacer = 20;
    const canvas = this.canvasEl.nativeElement;
    const container = this.containerEl.nativeElement;
    const xAxisShift = (container.clientWidth + spacer - canvas.clientWidth) / 2;
    const yAxisShift = (container.clientHeight - canvas.clientHeight) / 2;

    // Scales
    this.scaleX.range([this.margin, canvas.clientWidth - this.margin]);
    this.scaleY.range([this.margin, canvas.clientHeight - this.margin]);

    // Draw Ticks
    const axisX = dayLimitedAxis(this.scaleX);
    const axisY = d3.axisLeft(this.scaleY).ticks(12); // .tickFormat(x => timeTickFormat(x))

    // Draw New Axes
    d3.select('.axis--x')
      .attr('transform', `translate(${xAxisShift}, 1)`)
      .call(axisX as any);
    d3.select('.axis--y')
      .attr('transform', `translate(${this.yAxisWidth - 1}, ${yAxisShift})`)
      .call(axisY as any);

    setTimeout(() => this.yAxisWidth = xAxisShift, 0);
    setTimeout(() => this.xAxisHeight = yAxisShift, 0); // To fix NG0100 Error
  }

  private drawScatterplot(): void {
    const colorBase = '#0099FF';
    const radius = 2 * Math.log(this.transform.k + 1);

    this.canvasContext.clearRect(0, 0, this.canvasEl.nativeElement.width, this.canvasEl.nativeElement.height);
    this.dateDimension.filterRange([this.scaleX.domain()[0], this.scaleX.domain()[1]]);
    this.timeDimension.filterRange([this.scaleY.domain()[0], this.scaleX.domain()[1]]);

    this.filter.allFiltered().forEach((d: Message) => {
      this.canvasContext.beginPath();
      let color = colorBase;
      switch (this.colorService.getColoredState()) {
        case COLOR_ENUM.ThreadsColored:
          color = this.colorService.stringToColor(d.thread_id);
          break;
        case COLOR_ENUM.BarChartColored:
          // coloredBarchart && colorScale.domain().includes(coloredBarchart.get_data(d));
          color = this.colorService.randomColor();
          break;
      }
      this.canvasContext.fillStyle = color;
      this.canvasContext.globalAlpha = 0.3;
      this.canvasContext.arc(this.scaleX(d.date), this.scaleY(d.timeSeconds), radius, 0, 2 * Math.PI, true);
      this.canvasContext.fill();
      this.canvasContext.closePath();
    });
  }

  private onZoom({transform}: any): void {
    this.transform = transform;
    this.drawAxes();
    this.drawScatterplot();
  }

  private onZoomX({transform}: any): void {
    console.log('Zoomed X:', transform);
  }

  private onZoomY({transform}: any): void {
    console.log('Zoomed Y:', transform);
  }

  public ngOnDestroy(): void {
    this.destroyed$.next();
  }
}
