import {AfterViewInit, Component, ElementRef, OnDestroy, ViewChild} from '@angular/core';
import {Store} from '@ngrx/store';
import {ResizedEvent} from 'angular-resize-event';
import * as d3 from 'd3';
import {ZoomTransform} from 'd3';
import {BehaviorSubject, Subject} from 'rxjs';
import {debounceTime, filter, takeUntil, tap} from 'rxjs/operators';
import {AppState} from 'src/app/store/app.state';
import {MEDIA_TYPE, Message} from '../../types/message.interface';
import {Crossfilter} from 'src/app/types/crossfilter.aliases';
import {FilterService} from '../../shared/filter.service';
import crossfilter from 'crossfilter2';
import {dayLimitedAxis, timeTickFormat} from './d3-helper.functions';
import {COLOR_ENUM, ColorService} from '../../shared/color.service';

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
  private minTime = new Date(2000, 0, 1);
  private maxTime = new Date(2000, 0, 2);

  // Scales
  private scaleX = d3.scaleTime().domain([this.minDate, this.maxDate]);
  private scaleY = d3.scaleTime().domain([this.minTime, this.maxTime]);
  private transform: ZoomTransform = d3.zoomIdentity;
  private transformX: ZoomTransform = d3.zoomIdentity;
  private transformY: ZoomTransform = d3.zoomIdentity;

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
      .scaleExtent([1, 4000])
      .on('zoom', e => this.onZoomX(e));
    const zoomY = d3.zoom()
      .scaleExtent([1, 4000])
      .on('zoom', e => this.onZoomY(e));

    d3.select('.axis--x').call(zoomX as any);
    d3.select('.axis--y').call(zoomY as any);

    // Add Zoom
    const zoom = d3.zoom()
      .scaleExtent([1, 4000])
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
    const axisY = d3.axisLeft(this.scaleY).ticks(12).tickFormat(x => timeTickFormat(x));

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

    this.canvasContext.clearRect(0, 0, this.canvasEl.nativeElement.width, this.canvasEl.nativeElement.height);
    this.dateDimension.filterRange([this.scaleX.domain()[0], this.scaleX.domain()[1]]);
    this.timeDimension.filterRange([this.scaleY.domain()[0], this.scaleX.domain()[1]]);

    this.filter.allFiltered().forEach((d: Message) => {
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

      if (d.is_user) {
        this.canvasContext.fillStyle = 'lightgrey';
        this.canvasContext.strokeStyle = 'lightgrey';
      } else {
        this.canvasContext.fillStyle = color;
        this.canvasContext.strokeStyle = color;
      }
      this.drawMessage(d, color);
    });
  }

  private drawMessage(d: Message, color: string): void {
    // Shape
    this.canvasContext.beginPath();

    // TODO: Make transition between Dot and Not Dot way smoother
    // DOT
    if (this.transform.k < 250) {
      const radius = 2 * Math.log(this.transform.k + 1);
      this.canvasContext.globalAlpha = 0.3;
      this.canvasContext.arc(this.scaleX(d.date), this.scaleY(d.timeSeconds), radius, 0, 2 * Math.PI, true);
      this.canvasContext.fill();
      this.canvasContext.closePath();

    // NOT DOT
    } else {
      // Variables
      this.canvasContext.globalAlpha = 0.6;
      // const fontSize = Math.log(this.transform.k ** 9) - 40;
      const fontSize = Math.min((0.005 * this.transform.k) + 9, 20) ;
      this.canvasContext.font = `${fontSize}px Roboto`;
      const lineHeight = fontSize + 0;
      const borderRadius = 20;
      this.canvasContext.lineJoin = 'round';
      this.canvasContext.lineWidth = borderRadius;

      const PAD = 6;

      // Dimensions
      const leftLimit = this.scaleX(new Date(new Date(d.date).setHours(d.date.getHours() - 11)));
      const rightLimit = this.scaleX(new Date(new Date(d.date).setHours(d.date.getHours() + 11)));
      const top = this.scaleY(d.timeSeconds);
      const maxWidth = (rightLimit - leftLimit) - (PAD * 2);

      // Text
      const lines = this.wrapText(d.message, maxWidth);

      const width = lines.longest + (PAD * 2);
      const height = (lineHeight * lines.lines.length) + (PAD * 2);
      const left = d.is_user ? (rightLimit - width) : leftLimit;

      // Border
      this.canvasContext.strokeRect(
        left + (borderRadius / 2), top + (borderRadius / 2),
        width - borderRadius, height - borderRadius);
      // Fill
      this.canvasContext.fillRect(
        left + borderRadius, top + borderRadius,
        Math.max(0, width - (borderRadius * 2)), Math.max(0, height - (borderRadius * 2)));

      // Text
      this.canvasContext.fillStyle = 'black';

      for (let i = 0; i < lines.lines.length; i++) {
        const downShift = ((i + 0.85) * lineHeight) + PAD;
        this.canvasContext.fillText(lines.lines[i], left + PAD, top + downShift);
      }

      // Draw media type
      // TODO: Draw Timestamp here?
      if (d.media !== MEDIA_TYPE.NONE) {
        const timeStampShift = 14;
        this.canvasContext.font = `${10}px Roboto`;
        this.canvasContext.fillStyle = 'lightgrey';
        const thing = `Media Type: ${d.media}`;
        this.canvasContext.fillText(thing, left + 5, top + height + timeStampShift);
      }

      // Draw Photos
      const imageSize = Math.min(maxWidth, 50);
      if (d.media === MEDIA_TYPE.PHOTO) {
        d.media_files.forEach(photo => {
          // console.log(`Photo: ${photo.uri}`);
          const image = new Image();
          image.onload = () => this.canvasContext.drawImage(image, left, top + height, imageSize, imageSize);
          image.src = `https://via.placeholder.com/150/${color.slice(1)}`;
        });
      }
    }
  }

  private onZoom({transform}: any): void {
    this.transform = transform;
    console.log('Zoom:', transform.k);
    this.drawAxes();
    this.drawScatterplot();
  }

  private onZoomX({transform}: any): void {
    console.log('Zoomed X:', transform);
  }

  private onZoomY({transform}: any): void {
    console.log('Zoomed Y:', transform);
  }

  private wrapText(text: string, maxWidth: number): { lines: Array<string>, longest: number } {
    const words = text.split(' ');
    const lines = [];
    let word = words[0];
    let line = '';
    let remainder = '';
    let n = 0;
    let longest = 0;

    while (n < words.length) {
      const testLine = line === '' ? word : `${line} ${word}`;
      const lineWidth = this.canvasContext.measureText(testLine).width;

      // There is space for the new word
      if (lineWidth < maxWidth) {
        line = testLine;
        word = words[++n];
        if (lineWidth > longest) { longest = lineWidth; }

      // No space for new word. If line isn't empty: save it, start new line.
      } else if (line !== '') {
        lines.push(line);
        line = '';
        // word = words[++n];

      // Single word is too long. Add it anyway.
      // TODO: Fix so this does pretty word wrapping
      } else {
        lines.push(word);
        line = '';
        word = words[++n];

        // TODO: Make more efficient. Surely use split approximator from maxWidth
        // remainder = '';
        // while (this.canvasContext.measureText(word).width > maxWidth && word.length > 1) {
        //   remainder = word.slice(-1, word.length) + remainder;
        //   word = word.slice(0, -1);
        // }
        // word = remainder;
      }
    }

    lines.push(line);

    return { lines, longest };
  }

  public ngOnDestroy(): void {
    this.destroyed$.next();
  }
}
