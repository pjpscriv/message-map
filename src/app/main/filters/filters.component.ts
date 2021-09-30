import {Component, OnDestroy} from '@angular/core';
import {Message} from '../../types/message.interface';
import {BarChartConfig} from './bar-chart/bar-chart-config.type';
import {Subject} from 'rxjs';
import * as d3 from 'd3';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.css']
})
export class FiltersComponent implements OnDestroy {
  private lengths = [0, 1, 2, 5, 10, 20, 50, 100, 200, 500, 1000, 2000, 5000, 10000];
  private thingWidth = 230;
  public barCharts: Array<BarChartConfig> = [
    {
      id: 'sent-received',
      name: 'Sent / Received',
      getData: (m: Message) => m.is_user,
      scale: d3.scaleLinear().range([0, this.thingWidth]),
      numberOfBars: 'all'
    },
    {
      id: 'top-senders',
      name: 'Top 10 Sender',
      getData: (m: Message) => m.sender_name,
      scale: d3.scaleLinear().range([0, this.thingWidth]),
      numberOfBars: 10
    },
    {
      id: 'message-type',
      name: 'Type of Message',
      getData: (m: Message) => m.media,
      scale: d3.scaleLinear().range([0, this.thingWidth]),
      numberOfBars: 'all'
    },
    {
      id: 'message-length',
      name: 'Message Length',
      getData: (m: Message) => this.findLengthTick(m),
      scale: d3.scaleLinear().range([0, this.thingWidth]),
      numberOfBars: 'all'
    },
    {
      id: 'week-day',
      name: 'Week Day',
      getData: (m: Message) => m.date.getDay(),
      scale: d3.scaleLinear().range([0, this.thingWidth]),
      numberOfBars: 'all'
    }
  ];
  private destroyed$ = new Subject();

  public ngOnDestroy(): void {
    this.destroyed$.next();
  }

  private findLengthTick(m: Message): number {
    for (const length of this.lengths) {
      if (m.length < length) { return length; }
    }
    return 10000;
  }
}
