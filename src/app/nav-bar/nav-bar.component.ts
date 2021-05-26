import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {

  @Output() exploreClicked = new EventEmitter();
  @Output() explanationClicked = new EventEmitter();
  @Output() resetClicked = new EventEmitter();


  constructor() { }

  ngOnInit(): void {
  }

  public explore() {
    this.exploreClicked.emit();
  }

  public explanation() {
    this.explanationClicked.emit();
  }

  public reset() {
    this.resetClicked.emit();
  }
}
