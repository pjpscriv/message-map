import {Component, OnDestroy} from '@angular/core';
import {MEDIA_TYPE, Message} from '../types/message.interface';
import {BarChartConfig} from './bar-chart/bar-chart-config.type';
import {Subject} from 'rxjs';
import * as d3 from 'd3';
import {FilterService} from '../services/filter.service';
import crossfilter, {Crossfilter} from 'crossfilter2';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss']
})
export class FiltersComponent implements OnDestroy {
  // Constants
  private lengths = [0, 1, 2, 5, 10, 20, 50, 100, 200, 500, 1000, 2000, 5000, 10000];
  private daysShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  private thingWidth = 220;

  // Bar Chart Settings
  public barCharts: Array<BarChartConfig> = [
    {
      id: 'sent-received',
      name: 'Sent / Received',
      getData: (m: Message) => m.is_user,
      getLabel: (v: boolean) => v ? 'Sent' : 'Recv',
      scale: d3.scaleLinear().range([0, this.thingWidth]),
      clicked: new Set(),
      showEmpties: true
    },
    {
      id: 'top-senders',
      name: 'Top 10 Senders',
      getData: (m: Message) => m.sender_name,
      getLabel: (v: string) => v,
      scale: d3.scaleLinear().range([0, this.thingWidth]),
      numberOfBars: 10,
      clicked: new Set(),
      showEmpties: false
    },
    {
      id: 'message-type',
      name: 'Type of Message',
      getData: (m: Message) => m.media,
      getLabel: (v: MEDIA_TYPE) => this.mediaTypeToString(v),
      scale: d3.scaleLinear().range([0, this.thingWidth]),
      clicked: new Set(),
      showEmpties: false,
      numberOfBars: 6
    },
    {
      id: 'message-length',
      name: 'Message Length',
      getData: (m: Message) => this.findLengthTick(m),
      getLabel: (v: number) => String(v),
      scale: d3.scaleLinear().range([0, this.thingWidth]),
      clicked: new Set(),
      showEmpties: false
    },
    {
      id: 'week-day',
      name: 'Week Day',
      getData: (m: Message) => m.date.getDay(),
      getLabel: (v: number) => this.daysShort[v],
      scale: d3.scaleLinear().range([0, this.thingWidth]),
      clicked: new Set(),
      showEmpties: true,
      // Sunday is the *last* day of the week dammit
      ordering: (a: any, b: any) => {
        if (a.key === 0) { return 1; }
        else if (b.key === 0) { return -1; }
        else { return a.key - b.key; }
      }
    }
  ];

  // Data Inputs
  private messagesFilter = crossfilter([] as Message[]);
  private chartsFilter = crossfilter([] as Message[]);

  // Life Cycle
  private destroyed$ = new Subject();

  // UI Variables
  public messageCount = 0;
  public totalMessages = 0;

  constructor(private filterService: FilterService) {
    this.filterService.getMessageAndChartFilters().subscribe(filtersPair => {
      this.messagesFilter = filtersPair[0];
      this.chartsFilter = filtersPair[1];

      this.totalMessages = this.chartsFilter.size();
      this.messageCount = this.chartsFilter.allFiltered().length;

      this.barCharts.forEach(config => {
        config.messagesDimension = this.messagesFilter.dimension(config.getData);
        config.chartsDimension = this.chartsFilter.dimension(config.getData);
      });
    });

    this.filterService.getFilterRedraw().subscribe(() => {
      this.messageCount = this.chartsFilter.allFiltered().length;
    });
  }

  public clearFilters(): void {
    this.barCharts.forEach(config => {
      config.clicked.clear();
      config.chartsDimension.filterAll();
      config.messagesDimension.filterAll();
    });
    this.filterService.redrawFilter();
  }

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
