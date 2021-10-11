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
  private barRadius = 10;

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
        this.scale = config.scale;

        this.data = this.createDataGroups();

        const maxVal = d3.max(this.data, (d: any) => d.value);
        this.scale.domain([0, (maxVal ? maxVal : 1)]);

        this.drawChart();
      });

    this.filterService.getFilterRedraw().subscribe(() => {
      this.drawChart();
    });
  }

  public ngOnInit(): void {
    this.config$.next(this.config);
  }

  private drawChart(): void {
    const chartClass = `.${this.config.id}-chart`;
    // console.log(`Draw ${chartClass}`);

    this.data = this.createDataGroups();

    // Connect to data source
    const svg = d3.select(chartClass).data([this.data]);
    const maxVal = d3.max(this.data, (d: any) => d.value);
    this.scale.domain([0, (maxVal ? maxVal : 1)]);

    // Clear chart
    d3.selectAll(`${chartClass} .bar-element`).remove();

    const barEls = svg.selectAll()
      .remove()
      .data(this.data).enter()
      .append('g')
      .attr('class', 'bar-element')
      .attr('transform', (d, i) => `translate(0,${i * (this.barHeight + this.barSpacing)})`);

    // Add bars
    barEls.append('rect')
      .attr('class', (d: any) => 'bar ' + this.getBarClass(d.key))
      .attr('height', this.barHeight)
      .attr('width', (d: any) => this.scale(d.value))
      .attr('rx', this.barRadius)
      .attr('ry', this.barRadius)
      .attr('transform', `translate(${this.leftMargin}, 0)`)
      .classed('unclicked', (d: any) => this.getUnClicked(d))
      // TODO: Implement colors
      // .style('fill', d => bc.isColoredBarchart ? colorScale(d.key) : '')
      .on('click', this.onClick(this.config.clicked))
      .on('mouseover', this.onMouseOver)
      .on('mouseout', this.onMouseOut);

    // Add counts
    barEls.append('text')
      .text((d: any) => d.value.toLocaleString())
      .attr('class', 'legend_hist_num')
      .attr('dy', '0.35em')
      .attr('y', `${this.barHeight / 2}px`)
      .attr('x', (d: any) => this.scale(d.value) + 4)
      .attr('text-anchor', 'left')
      .attr('transform', `translate(${this.leftMargin}, 0)`)
      .on('click', this.onClick(this.config.clicked))
      .on('mouseover', this.onMouseOver)
      .on('mouseout', this.onMouseOut);

    // Add labels
    barEls.append('text')
      .text((d: any) => this.config.getLabel(d.key))
      .attr('class', 'legend_hist_text')
      .attr('dy', '0.35em')
      .attr('y', `${this.barHeight / 2}px`)
      .on('click', this.onClick(this.config.clicked))
      .on('mouseover', this.onMouseOver)
      .on('mouseout', this.onMouseOut);

    const height = (this.data.length * this.barHeight) + ((this.data.length - 1) * this.barSpacing);
    // @ts-ignore Adjust svg size
    // TODO: Set correct dimensions *before* drawing chart instead of after
    const bbox = svg?.nodes()[0]?.getBBox();
    svg.attr('width', bbox.x + (bbox.width + 8)  + 'px')
      .attr('height', `${height}px`);
  }

  private createDataGroups(): any {
    const barLimit = this.config?.numberOfBars;
    const data = (!barLimit) ? this.config.dimension.group().all() : this.config.dimension.group().top(barLimit);
    const sorter = this.config.ordering;
    if (sorter) {
      data.sort(sorter);
    }
    return data;
  }

  private onClick(clickSet: Set<any>): (d: any) => void {
    return (d: any) => {
      const key = d.target.__data__.key;
      clickSet.has(key) ? clickSet.delete(key) : clickSet.add(key);
      (clickSet.size === 0)
        ? this.config.dimension.filterAll()
        : this.config.dimension.filter((a: any) => clickSet.has(a));
      this.filterService.redrawFilter();
    };
  }

  private onMouseOver(): void {

  }

  private onMouseOut(): void {

  }

  public toggleColors(): void {
    console.log(`${this.config?.name} colors clicked`);
  }

  private getBarClass(key: string): string {
    const label = this.config.getLabel(key);
    return 'bar-' + label.toLowerCase().trim().replace(' ', '-');
  }

  private getUnClicked(d: any): boolean {
    if (this.config.clicked.size === 0) {
      return false;
    } else {
      return !this.config.clicked.has(d.key);
    }
  }

  public ngOnDestroy(): void {
    this.destroyed$.next();
  }
}
