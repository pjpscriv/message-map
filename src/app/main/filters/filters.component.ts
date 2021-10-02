import {Component, OnDestroy} from '@angular/core';
import {MEDIA_TYPE, Message} from '../../types/message.interface';
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
  private daysShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  private thingWidth = 170;
  public barCharts: Array<BarChartConfig> = [
    {
      id: 'sent-received',
      name: 'Sent / Received',
      getData: (m: Message) => m.is_user,
      getLabel: (v: boolean) => v ? 'Sent' : 'Received',
      scale: d3.scaleLinear().range([0, this.thingWidth]),
      numberOfBars: 'all'
    },
    {
      id: 'top-senders',
      name: 'Top 10 Sender',
      getData: (m: Message) => m.sender_name,
      getLabel: (v: string) => v,
      scale: d3.scaleLinear().range([0, this.thingWidth]),
      numberOfBars: 10
    },
    {
      id: 'message-type',
      name: 'Type of Message',
      getData: (m: Message) => m.media,
      getLabel: (v: MEDIA_TYPE) => this.mediaTypeToString(v),
      scale: d3.scaleLinear().range([0, this.thingWidth]),
      numberOfBars: 'all'
    },
    {
      id: 'message-length',
      name: 'Message Length',
      getData: (m: Message) => this.findLengthTick(m),
      getLabel: (v: number) => String(v),
      scale: d3.scaleLinear().range([0, this.thingWidth]),
      numberOfBars: 'all'
    },
    {
      id: 'week-day',
      name: 'Week Day',
      getData: (m: Message) => m.date.getDay(),
      getLabel: (v: number) => this.daysShort[v],
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

  private mediaTypeToString(m: MEDIA_TYPE): string {
    const s = String(m);
    return s.charAt(0).toUpperCase() + s.slice(1);
  }
}
