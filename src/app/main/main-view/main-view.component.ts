import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { ResizedEvent } from 'angular-resize-event';
import * as d3 from 'd3';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { debounceTime, filter, map, tap } from 'rxjs/operators';
import { selectMessages } from 'src/app/store/app.selectors';
import { AppState } from 'src/app/store/app.state';
import { Message } from '../../models/message.interface';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-main-view',
  templateUrl: './main-view.component.html',
  styleUrls: ['./main-view.component.css']
})
export class MainViewComponent implements AfterViewInit {
  @ViewChild('mainViewContainer') containerEl: any;
  @ViewChild('scatterplot') canvasEl: any;
  private messages$: Observable<Array<Message>>;
  private canvasWrapperSize$: BehaviorSubject<ResizedEvent>;
  private canvasContext: any;

  // Dates
  private minDate = new Date(2010, 1, 1);
  private maxDate = new Date(2020, 1, 1);

  // Axes
  private scaleX: any;
  private scaleY: any;
  private axisX: any;
  private axisY: any;
  private d3ElAxisY: any;
  private d3ElAxisX: any;
  public yAxisWidth = 50;
  public xAxisBottom = 0;

  private margin = 10;

  constructor(
    private store: Store<AppState>
  ) {
    this.messages$ = this.store.pipe(select(selectMessages),
      filter(messages => !!messages && messages?.length !== 0),
      tap(messages => {
        this.minDate = d3.min(messages, (message: Message) => message.date) as Date;
        this.maxDate = d3.max(messages, (message: Message) => message.date) as Date;
      }));
    const initialSize = new ResizedEvent(new ElementRef(null), 0, 0, 0, 0);
    this.canvasWrapperSize$ = new BehaviorSubject<ResizedEvent>(initialSize);
  }


  public ngAfterViewInit(): void {
    this.canvasContext = this.canvasEl.nativeElement.getContext('2d');
    this.d3ElAxisX = d3.select('.x-axis');
    this.d3ElAxisY = d3.select('.y-axis');

    const canvasSize$ = this.canvasWrapperSize$.pipe(
      tap(_ => this.drawAxes()),
      debounceTime(1000),
      map((event: ResizedEvent) => {
        this.canvasEl.nativeElement.height = event.newHeight;
        this.canvasEl.nativeElement.width = event.newWidth;

        this.canvasContext.clearRect(0, 0, this.canvasEl.width, this.canvasEl.height);

        console.log('Resized canvas: ', this.canvasContext.canvas.width, this.canvasContext.canvas.height);
      })
    );

    combineLatest([this.messages$, canvasSize$]).pipe(debounceTime(1000))
      .subscribe(([messages, _]) => this.drawScatterplot(messages));
  }


  private drawAxes(): void {
    // Set up new Axes
    const w1 = this.canvasEl.nativeElement.clientWidth - this.margin;
    const h1 = this.canvasEl.nativeElement.clientHeight - this.margin;

    this.scaleX = d3.scaleTime().range([this.margin, w1]);
    this.scaleY = d3.scaleTime().range([this.margin, h1]);

    this.axisX = d3.axisBottom(this.scaleX);
    this.axisY = d3.axisLeft(this.scaleY)
      .ticks(d3.timeHour.every(2), '%I %p')
      .tickFormat(x => {
          let s = new DatePipe('en-US').transform(x as Date, 'haaaaa\'m\'') as string;
          s = s === '12am' ? 'midnight' : s === '12pm' ? 'midday' : s;
          return s;
      });

    this.scaleX.domain([this.minDate, this.maxDate]);

    // Clear Axes
    this.d3ElAxisY.selectAll('.axis--y').remove();
    this.d3ElAxisX.selectAll('.axis--x').remove();

    const containerEl = this.containerEl.nativeElement;
    const canvasEl = this.canvasEl.nativeElement;

    const xAxisShift = ((containerEl.clientWidth - canvasEl.clientWidth) + this.yAxisWidth) / 2;
    const yAxisShift = (containerEl.clientHeight - canvasEl.clientHeight) / 2;

    this.d3ElAxisX.append('g')
      .attr('transform', `translate(${xAxisShift},1)`)
      .attr('class', 'x axis--x')
      .call(this.axisX);

    this.d3ElAxisY.append('g')
      .attr('transform', `translate(${this.yAxisWidth - 1}, ${yAxisShift})`)
      .attr('class', 'y axis--y')
      .call(this.axisY);

    setTimeout(() => this.xAxisBottom = yAxisShift - 20, 0);
  }


  private drawScatterplot(messages: Array<Message>): void {
    this.drawAxes();
    this.canvasContext.clearRect(0, 0, this.canvasEl.width, this.canvasEl.height);
    const colorBase = '#0099FF';

    // messages.allFiltered()
    messages.forEach(d => {
      this.canvasContext.beginPath();
      // const useColors = coloredBarchart && colorScale.domain().includes(coloredBarchart.get_data(d));
      const useColors = false;
      if (useColors) {
        const x = null;
        // this.canvasContext.fillStyle = colorScale(coloredBarchart.get_data(d));
      } else {
        this.canvasContext.fillStyle = colorBase;
      }

      // this.canvasContext.globalAlpha = 0.005;
      // this.canvasContext.rect(20, 20, 150, 100)
      // this.canvasContext.fill()

      this.canvasContext.globalAlpha = 0.1;
      // console.log(`${i++} Try draw: ${d.date}, ${d.timeSeconds}`)
      // console.log(`Coords: ${this.x1(d.date)}, ${this.y1(d.timeSeconds)}`)
      this.canvasContext.arc(this.scaleX(d.date), this.scaleY(d.timeSeconds), 2, 0, 2 * Math.PI, true);
      this.canvasContext.fill();
      this.canvasContext.closePath();
    });
  }


  public onResized(event: ResizedEvent): void {
    this.canvasWrapperSize$.next(event);
  }
}
