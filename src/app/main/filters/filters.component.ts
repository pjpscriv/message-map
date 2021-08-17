import { Component } from '@angular/core';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.css']
})
export class FiltersComponent {

  public barcharts = [
    { name: 'Chart 1' },
    { name: 'Chart 2' },
    { name: 'Chart 3' },
    { name: 'Chart 4' },
    { name: 'Chart 5' }
  ];

  constructor() {}
}
