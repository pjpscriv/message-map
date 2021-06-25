import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { ResizedEvent } from 'angular-resize-event';
import * as d3 from 'd3';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { debounceTime, filter, map } from 'rxjs/operators';
import { Message } from 'src/app/models/thread.interface';
import { selectMessages } from 'src/app/store/app.selectors';
import { AppState } from 'src/app/store/app.state';

@Component({
  selector: 'app-main-view',
  templateUrl: './main-view.component.html',
  styleUrls: ['./main-view.component.css']
})
export class MainViewComponent implements AfterViewInit {

  @ViewChild('scatterplot') canvasEl: any;
  private messages$: Observable<Array<Message>>;
  private canvasWrapperSize$: BehaviorSubject<ResizedEvent>;
  private canvasContext: any;
  private x1: any;
  private y1: any;

  private margin1 = { top: 20, right: 20, bottom: 20, left: 20 };

  constructor(
    private store: Store<AppState>
  ) {
    this.messages$ = this.store.pipe(select(selectMessages),
      filter(messages => !!messages && messages?.length !== 0))

    const initialSize = new ResizedEvent(new ElementRef(null), 0, 0, 0, 0);
    this.canvasWrapperSize$ = new BehaviorSubject<ResizedEvent>(initialSize);
  }

  public ngAfterViewInit(): void {
    this.canvasContext = this.canvasEl.nativeElement.getContext("2d");

    const canvasSize$ = this.canvasWrapperSize$.pipe(
      debounceTime(100),
      map((event: ResizedEvent) => {
        this.canvasEl.nativeElement.height = event.newHeight;
        this.canvasEl.nativeElement.width = event.newWidth;

        const w1 = this.canvasEl.nativeElement.clientWidth - this.margin1.right;
        const h1 = this.canvasEl.nativeElement.clientHeight - this.margin1.bottom;

        this.x1 = d3.scaleTime().range([this.margin1.left, w1]);
        this.y1 = d3.scaleTime().range([this.margin1.top, h1]);

        // const xAxis1 = d3.axisBottom(this.x1);
        // const yAxis1 = d3.axisLeft(this.y1);
        this.canvasContext.clearRect(0, 0, this.canvasEl.width, this.canvasEl.height);

        // console.log("Resized canvas: ", this.canvasContext.canvas.width, this.canvasContext.canvas.height);
      })
    );

    combineLatest([this.messages$, canvasSize$]).pipe(debounceTime(1000))
      .subscribe(([messages, _]) => this.drawMessages(messages));
  }

  /** *
  initialize_scatterplot() {
    //initialize domains
    axis_time_focus.selectAll(".axis--y").remove();
    axis_date_focus.selectAll(".axis--x").remove();

    axis_date_focus.append('g')
      .attr('transform', 'translate(' + this.margin1.left + ',' + 0 + ')')
      .attr('class', 'x axis--x')
      .call(xAxis1);

    axis_time_focus.append('g')
      .attr('transform', 'translate(' + (this.margin1.left - 1) + ',' + this.margin1.top + ')')
      .attr('class', 'y axis--y')
      .call(yAxis1);
  }
  /** */

  private drawMessages(messages: Array<Message>): void {
    const mindate = d3.min(messages, (message: Message) => message.date);
    const maxdate = d3.max(messages, (message: Message) => message.date);

    this.x1.domain([mindate, maxdate]);
    // this.y1.domain set to 1 full day by default

    // this.x2.domain([mindate_total, maxdate_total]);
    // this.initialize_scatterplot()
    this.drawScatterplot(messages);
  }


  private drawScatterplot(messages: Array<Message>): void {
    this.canvasContext.clearRect(0, 0, this.canvasEl.width, this.canvasEl.height);
    const color_base = '#0099FF';

    // messages.allFiltered()
    messages.forEach(d => {
      this.canvasContext.beginPath();
      // const useColors = coloredBarchart && colorScale.domain().includes(coloredBarchart.get_data(d));
      const useColors = false;
      if (useColors) {
        null;
        // this.canvasContext.fillStyle = colorScale(coloredBarchart.get_data(d));
      } else {
        this.canvasContext.fillStyle = color_base;
      }

      // this.canvasContext.globalAlpha = 0.005;
      // this.canvasContext.rect(20, 20, 150, 100)
      // this.canvasContext.fill()

      this.canvasContext.globalAlpha = 0.1;
      // console.log(`${i++} Try draw: ${d.date}, ${d.timeSeconds}`)
      // console.log(`Coords: ${this.x1(d.date)}, ${this.y1(d.timeSeconds)}`)
      this.canvasContext.arc(this.x1(d.date), this.y1(d.timeSeconds), 2, 0, 2 * Math.PI, true);
      this.canvasContext.fill()
      this.canvasContext.closePath();
    })
  }


  public onResized(event: ResizedEvent): void {
    this.canvasWrapperSize$.next(event);
  }
}
