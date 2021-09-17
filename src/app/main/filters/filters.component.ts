import { Component } from '@angular/core';
import {Message} from '../../types/message.interface';
import {Thread} from '../../types/thread.interface';
import {BarChart} from './bar-chart/bar-chart.type';
import {FilterService} from '../../shared/filter.service';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.css']
})
export class FiltersComponent {

  public barCharts: Array<BarChart>;

  constructor(
    private filterService: FilterService
  ) {
    this.barCharts = [
      {
        name: 'Sent / Received',
        getData: (m: Message) => m.is_user
      },
      {
        name: 'Participants',
        getData: (m: Message) => m.sender_name
      },
      // {
      //   name: '# of Participants',
      //   getData: (t: Thread) => t.nb_participants < 9 ? String(t.nb_participants) : '9+'
      // },
      {
        name: 'Media Messages',
        getData: (m: Message) => m.media
      },
      {
        name: 'Message Length',
        getData: (m: Message) => m.length
      },
      {
        name: 'Week Day',
        getData: (m: Message) => m.date.getDay()
      }
    ];



  }
}
