import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {BarChartConfig} from './bar-chart-config.type';
import {FilterService} from '../../../shared/filter.service';
import * as d3 from 'd3';
import {combineLatest, Observable, Subject} from 'rxjs';
import {filter, takeUntil} from 'rxjs/operators';
import {Crossfilter} from '../../../types/crossfilter.aliases';
import {Message} from '../../../types/message.interface';
import crossfilter from 'crossfilter2';
import {ColorService} from '../../../shared/color.service';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css']
})
export class BarChartComponent implements OnInit, OnDestroy {
  @ViewChild('chartBody') chartEl: any;
  @Input() config: BarChartConfig = {} as BarChartConfig;

  private filter = crossfilter([] as Message[]);
  private dimension = this.filter.dimension(m => m.is_user);
  private clicked: Set<any> = new Set();
  private data: any;
  // isColoredBarChart;
  private scale: any;

  private destroyed$ = new Subject();
  private filter$: Observable<Crossfilter<Message>>;
  private config$: Subject<BarChartConfig> = new Subject();

  // Constants
  private barHeight = 20;
  private barSpacing = 4;
  private leftMargin = 40;

  constructor(
    private filterService: FilterService,
    private colorService: ColorService
  ) {
    this.filter$ = this.filterService.getMessageFilter().pipe(
      takeUntil(this.destroyed$),
      filter(messages => !!messages && messages?.size() !== 0));

    combineLatest([this.filter$, this.config$]).pipe(
      filter(([_, config]) => config !== null))
      .subscribe(([messagesFilter, config]) => {
        this.filter = messagesFilter;
        this.dimension = this.filter.dimension(config.getData);
        this.scale = config.scale;

        const bars = this.config?.numberOfBars;
        this.data = (bars === 'all') ? this.dimension.group().all() : this.dimension.group().top(bars);

        const maxVal = d3.max(this.data, (d: any) => d.value) as any;
        this.scale.domain([0, maxVal]);

        this.drawChart();
      });
  }

  public ngOnInit(): void {
    console.log(`Check Bar Char Config isn't null: ${this.config}`);
    this.config$.next(this.config);
  }

  public toggleColors(): void {
    console.log(`${this.config?.name} colors clicked`);
  }

  private drawChart(): void {
    const chartId = `.${this.config.id}-chart`;

    const svg = d3.select(chartId).data([this.data]);

    d3.selectAll(`${chartId} .bar-element`).remove();

    const barEls = svg.selectAll()
      .remove()
      .data(this.data).enter()
      .append('g')
      .attr('class', 'bar-element')
      .attr('transform', (d, i) => `translate(0,${i * (this.barHeight + this.barSpacing)})`);

    this.scale.domain([0, d3.max(this.data, (d: any) => d.value)]);

    // Add bars
    barEls.append('rect')
      .attr('class', 'bar')
      .attr('height', this.barHeight)
      .attr('width', (d: any) => this.scale(d.value))
      .attr('transform', `translate(${this.leftMargin}, 0)`)
      // .style('fill', d => bc.isColoredBarchart ? colorScale(d.key) : '')
      .classed('unclicked', (d: any) => !(this.clicked.size === 0 || this.clicked.has(d.key)))
      .on('click', this.onClick(this.clicked))
      .on('mouseover', this.onMouseOver)
      .on('mouseout', this.onMouseOut);

    // Add number-labels to bar charts
    barEls.append('text')
      .attr('class', 'legend_hist_num')
      .attr('dy', '0.35em')
      .attr('y', `${this.barHeight / 2}px`)
      .attr('x', (d: any) => this.scale(d.value) + this.barSpacing)
      .attr('text-anchor', 'left')
      .text((d: any) => d.value)
      .attr('transform', `translate(${this.leftMargin}, 0)`)
      .on('click', this.onClick(this.clicked))
      .on('mouseover', this.onMouseOver)
      .on('mouseout', this.onMouseOut);

    // Add labels to bar charts
    barEls.append('text')
      .attr('class', 'legend_hist_text')
      .attr('dy', '0.35em')
      .attr('y', `${this.barHeight / 2}px`)
      .text((d: any) => this.getLegend(d.key))
      .on('click', this.onClick(this.clicked))
      .on('mouseover', this.onMouseOver)
      .on('mouseout', this.onMouseOut);

    // Adjust svg size
    // @ts-ignore
    const bbox = svg?.nodes()[0]?.getBBox();
    svg.attr('width', bbox.x + bbox.width  + 'px')
      .attr('height', bbox.y + bbox.height + 'px');

  }

  private getLegend(s: string): string {
    return (String(s)).substring(0, 5);
  }

  private onClick(clickSet: Set<any>): any {
    return (d: any) => {
      // Register click
      const key = d.target.__data__.key;
      clickSet.has(key) ? clickSet.delete(key) : clickSet.add(key);

      // console.log(`Clicked: ${Array.from(clickSet)}`);

      // Apply filters
      clickSet.size === 0
        ? this.dimension.filterAll()
        : this.dimension.filter((a: any) => clickSet.has(a));
      this.filterService.redrawFilter();
    };
  }

  private onMouseOver(): void {

  }

  private onMouseOut(): void {

  }

  public ngOnDestroy(): void {
    this.destroyed$.next();
  }
}
