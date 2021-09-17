import {Component, Input, OnInit} from '@angular/core';
import {BarChart} from './bar-chart.type';
import {FilterService} from '../../../shared/filter.service';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css']
})
export class BarChartComponent implements OnInit {
  @Input() chart?: BarChart;

  // dimension;
  // group;
  // clicked;
  // isColoredBarChart;
  // xScale;


  constructor(
    private filterService: FilterService
  ) {

  }

  public ngOnInit(): void {

  }

  public toggleColors(): void {
    console.log(`${this.chart?.name} colors clicked`);
  }
}
