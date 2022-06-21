import { AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { ResizedEvent } from 'angular-resize-event';
import * as d3 from 'd3';
import { ZoomTransform } from 'd3';
import { BehaviorSubject, Subject } from 'rxjs';
import { debounceTime, filter, groupBy, mergeMap, takeUntil, tap } from 'rxjs/operators';
import { AppState } from 'src/app/store/app.state';
import { MEDIA_TYPE, Message, WebkitFile } from '../../types/message.interface';
import { Crossfilter } from 'src/app/types/crossfilter.aliases';
import { FilterService } from '../../services/filter.service';
import crossfilter from 'crossfilter2';
import { dayLimitedAxis, timeTickFormat } from './d3-helper.functions';
import { COLOR_ENUM, ColorService } from '../../services/color.service';
import { DatePipe } from '@angular/common';
import { FilesService } from '../../services/files.service';
import { EntityState } from '@ngrx/entity';
import { Dictionary } from '@ngrx/entity/src/models';

@Component({
  selector: 'app-main-view',
  templateUrl: './main-view.component.html',
  styleUrls: ['./main-view.component.css'],
  providers: [ DatePipe ]
})
export class MainViewComponent implements AfterViewInit, OnDestroy {
  @ViewChild('mainViewContainer') containerEl: any;
  @ViewChild('scatterplot') canvasEl: any;
  private initialSize = new ResizedEvent(new DOMRectReadOnly(), undefined);
  public canvasWrapperSize$ = new BehaviorSubject<ResizedEvent>(this.initialSize);
  private canvas: any;
  private oldCanvasSize: any;
  private destroyed$ = new Subject();

  // Filters + Data
  private filter = crossfilter([] as Message[]);
  private dateDimension = this.filter.dimension((m: Message) => m.date);
  private timeDimension = this.filter.dimension((m: Message) => m.timeSeconds);
  private fileMap: Dictionary<WebkitFile> = {};
  private drawImage$ = new BehaviorSubject<[string, any]>(['', {}]);

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
    private filesService: FilesService,
    private colorService: ColorService,
    private datePipe: DatePipe
  ) {}


  public ngAfterViewInit(): void {
    this.canvas = this.canvasEl.nativeElement.getContext('2d');

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
    this.filterService.getMessageDataFilter().pipe(
      takeUntil(this.destroyed$),
      filter(messages => !!messages && messages?.size() > 0)
    ).subscribe((messagesFilter: Crossfilter<Message>) => {
      console.log(`Messages received: ${messagesFilter.size()}`);
      this.setData(messagesFilter);
      this.drawAxes();
      this.drawScatterplot();
    });

    // Files
    this.filesService.getFileMap().pipe(
      takeUntil(this.destroyed$)
    ).subscribe((fileMap: EntityState<WebkitFile>) => {
      this.fileMap = fileMap.entities;
    });

    // Redraw
    this.filterService.getFilterRedraw().pipe(
      takeUntil(this.destroyed$)
    ).subscribe(() => {
      this.drawScatterplot();
    });

    // Draw Images
    this.drawImage$.pipe(
      takeUntil(this.destroyed$),
      groupBy(([photoUri, _]) => photoUri),
      mergeMap(group$ => group$.pipe(debounceTime(200)))
    ).subscribe(([photoUri, dimensions]) => {
      this.drawImage(photoUri, dimensions);
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
    this.canvasEl.nativeElement.height = event.newRect.height;
    this.canvasEl.nativeElement.width = event.newRect.width;

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

    const x2 = widthRatio * event.newRect.width * this.transform.k;
    const y2 = heightRatio * event.newRect.height * this.transform.k;

    this.oldCanvasSize.width = event.newRect.width;
    this.oldCanvasSize.height = event.newRect.height;

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

    this.canvas.clearRect(0, 0, this.canvasEl.nativeElement.width, this.canvasEl.nativeElement.height);

    // Filter by visible area for improved performance
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
        this.canvas.fillStyle = 'lightgrey';
        this.canvas.strokeStyle = 'lightgrey';
      } else {
        this.canvas.fillStyle = color;
        this.canvas.strokeStyle = color;
      }
      this.drawMessage(d, color);
    });
  }

  private drawMessage(d: Message, color: string): void {
    // Shape
    this.canvas.beginPath();

    // TODO: Make transition between Dot and Not Dot way smoother
    // DOT
    if (this.transform.k < 250) {
      const radius = 2 * Math.log(this.transform.k + 1);
      this.canvas.globalAlpha = 0.3;
      this.canvas.arc(this.scaleX(d.date), this.scaleY(d.timeSeconds), radius, 0, 2 * Math.PI, true);
      this.canvas.fill();
      this.canvas.closePath();

    // NOT DOT
    } else {
      // Variables
      this.canvas.globalAlpha = 0.6;
      // const fontSize = Math.log(this.transform.k ** 9) - 40;
      const fontSize = Math.min((0.005 * this.transform.k) + 9, 20) ;
      this.canvas.font = `${fontSize}px Roboto`;
      const lineHeight = fontSize + 0;
      const borderRadius = 20;
      this.canvas.lineJoin = 'round';
      this.canvas.lineWidth = borderRadius;

      const PAD = 6;

      // Dimensions
      const leftLimit = this.scaleX(new Date(new Date(d.date).setHours(d.date.getHours() - 11)));
      const rightLimit = this.scaleX(new Date(new Date(d.date).setHours(d.date.getHours() + 11)));
      const top = this.scaleY(d.timeSeconds);
      const maxWidth = (rightLimit - leftLimit) - (PAD * 2);

      // Text Dimensions
      const lines = this.wrapText(d.message, maxWidth);
      const width = lines.longest + (PAD * 2);
      const height = (lineHeight * lines.lines.length) + (PAD * 2);
      const left = d.is_user ? (rightLimit - width) : leftLimit;

      // Text Bubble
      this.canvas.strokeRect(
        left + (borderRadius / 2), top + (borderRadius / 2),
        width - borderRadius, height - borderRadius);
      this.canvas.fillRect(
        left + borderRadius, top + borderRadius,
        Math.max(0, width - (borderRadius * 2)), Math.max(0, height - (borderRadius * 2)));

      // Text
      this.canvas.fillStyle = 'black';
      for (let i = 0; i < lines.lines.length; i++) {
        const downShift = ((i + 0.85) * lineHeight) + PAD;
        this.canvas.fillText(lines.lines[i], left + PAD, top + downShift);
      }

      // Sender
      this.canvas.fillStyle = 'lightgrey';
      this.canvas.font = `${10}px Roboto`;
      this.canvas.fillText(d.sender_name, left + 5, top + height + 14);

      // Time
      this.canvas.font = `${10}px Roboto`;
      this.canvas.fillStyle = 'lightgrey';
      const timestamp = this.getTimestamp(d);
      const lineWidth = this.canvas.measureText(timestamp).width;
      this.canvas.fillText(timestamp, (left + width) - lineWidth, top + height + 14);

      // Media type
      if (d.media !== MEDIA_TYPE.NONE && d.media !== MEDIA_TYPE.PHOTO) {
        const timeStampShift = 14;
        this.canvas.font = `${10}px Roboto`;
        this.canvas.fillStyle = 'lightgrey';
        const text = `Media Type: ${d.media}`;
        this.canvas.fillText(text, left + 5, top - 6);
      }

      // Draw Photos
      const imageSize = Math.min(maxWidth, 200);
      if (d.media === MEDIA_TYPE.PHOTO) {
        let photoNum = 1;
        d.media_files.forEach(photo => {
          const dimensions = {
            left,
            top: top + height,
            width: imageSize,
            height: imageSize
          };
          this.drawImage$.next([photo.uri, dimensions]);
          photoNum++;
        });
      }
    }
  }

  private drawImage(photoUri: string, dimensions: any): void {
    const name = photoUri.split('/').pop() ?? '';
    const imageFile = this.fileMap[name] as Blob;
    // console.log(`Drawing image ${name}: ${imageFile}`);
    if (!!imageFile) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageData = event.target?.result as string;
        const image = new Image();
        image.onload = () => {
          this.canvas.globalAlpha = 1.0;
          const nHeight = image.naturalHeight;
          const nWidth = image.naturalWidth;
          const ratio = nHeight / nWidth;

          const width = Math.max(dimensions.width);
          const height = dimensions.width * ratio;

          this.canvas.drawImage(image, dimensions.left, dimensions.top, width, height);
          this.canvas.globalAlpha = 0.6;
        };
        image.src = imageData;
      };
      reader.readAsDataURL(imageFile);
    }
  }

  private getTimestamp(m: Message): string {
    const date = new Date(m.date.getFullYear(), m.date.getMonth(), m.date.getDate(),
      m.timeSeconds.getHours(), m.timeSeconds.getMinutes(), m.timeSeconds.getSeconds());
    const dateFormat = 'h:mm aaaaa\'m\'';
    return this.datePipe.transform(date, dateFormat) as string;
  }

  private onZoom({transform}: any): void {
    this.transform = transform;
    // console.log('Zoom:', transform.k);
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
      const lineWidth = this.canvas.measureText(testLine).width;

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

