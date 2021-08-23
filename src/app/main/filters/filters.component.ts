import { Component } from '@angular/core';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.css']
})
export class FiltersComponent {

  public barcharts = [
    { name: 'Sent / Received' },
    { name: '# of Participants' },
    { name: 'Media Messages' },
    { name: 'Message Length' },
    { name: 'Week Day' }
  ];

  constructor() {}
}
