import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { BarChartConfig } from './bar-chart-config.type';
import { FilterService } from '../../services/filter.service';
import * as d3 from 'd3';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ColorService } from '../../services/color.service';
import { KeyValue } from '@angular/common';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css']
})
export class BarChartComponent implements OnInit, OnDestroy {
  @ViewChild('chartBody') chartEl: any;
  @Input() config: BarChartConfig = {} as BarChartConfig;


  private data: any;
  // isColoredBarChart;
  private scale: any;

  // Life Cycle
  private destroyed$ = new Subject();

  // UI Constants
  private barHeight = 20;
  private barSpacing = 4;
  private leftMargin = 40;
  private barRadius = 10;
  private chartWidth = 320;

  constructor(
    private filterService: FilterService,
    private colorService: ColorService
  ) {
    this.filterService.getFilterRedraw().subscribe(() => {
      this.drawChart();
    });
  }

  public ngOnInit(): void {
    this.filterService.getMessageAndChartFilters().pipe(
      takeUntil(this.destroyed$))
      .subscribe(_ => { this.drawChart(); });
  }

  private drawChart(): void {
    const chartClass = `.${this.config.id}-chart`;
    // console.log(`Draw ${chartClass}`);

    this.data = this.createDataGroups();
    this.scale = this.config.scale;

    // Connect UI to data source
    const svg = d3.select(chartClass).data([this.data]);
    const maxVal = d3.max(this.data, (d: any) => d.value);
    this.scale.domain([0, (maxVal ? maxVal : 1)]);

    // Clear chart
    d3.selectAll(`${chartClass} .bar-element`).remove();

    // Set SVG size
    const height = (this.data.length * this.barHeight) + ((this.data.length - 1) * this.barSpacing);
    svg.attr('width', `${this.chartWidth}px`)
      .attr('height', `${height}px`);

    // Create parent elements
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
  }

  private createDataGroups(): any {
    let data = [];
    const sorter = this.config.ordering;
    const barLimit = this.config?.numberOfBars;
    const showEmpties = this.config?.showEmpties;


    // Set Bar Limit
    if (!!barLimit) {
      data = this.config.chartsDimension.group().top(barLimit);
    } else {
      data = this.config.chartsDimension.group().all();
    }

    // Sort
    if (sorter) {
      data.sort(sorter);
    }

    // Filter
    if (!showEmpties) {
      data = data.filter((x: KeyValue<any, any>) => x.value > 0);
    }

    return data;
  }

  private onClick(clickSet: Set<any>): (d: any) => void {
    return (d: any) => {
      const key = d.target.__data__.key;
      clickSet.has(key) ? clickSet.delete(key) : clickSet.add(key);
      if (clickSet.size === 0) {
        this.config.messagesDimension.filterAll();
        this.config.chartsDimension.filterAll();
      } else {
        this.config.messagesDimension.filter((a: any) => clickSet.has(a));
        this.config.chartsDimension.filter((a: any) => clickSet.has(a));
      }
      this.filterService.redrawFilter();
    };
  }

  private onMouseOver(): void {}

  private onMouseOut(): void {}

  public toggleColors(): void {
    console.log(`${this.config?.name} colors clicked`);
  }

  private getBarClass(key: string): string {
    const label = this.config.getLabel(key);
    return 'bar-' + label.toLowerCase().trim().replace(' ', '-');
  }

  private getUnClicked(d: any): boolean {
    return !(this.config.clicked.size === 0) && !this.config.clicked.has(d.key);
  }

  public ngOnDestroy(): void {
    this.destroyed$.next();
  }
}
