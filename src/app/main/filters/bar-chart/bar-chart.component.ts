import { Component, Input, OnInit } from '@angular/core';
import { Message } from 'src/app/models/message.interface';

interface BarChartConfig {
  getData: (m: Message) => any;
}

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css']
})
export class BarChartComponent {
  @Input() config?: BarChartConfig = undefined;

  constructor() {}
}
