import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent {

  @Output() exploreClicked = new EventEmitter();
  @Output() explanationClicked = new EventEmitter();
  @Output() resetClicked = new EventEmitter();

  public explore(): void {
    this.exploreClicked.emit();
  }

  public explanation(): void {
    this.explanationClicked.emit();
  }

  public reset(): void {
    this.resetClicked.emit();
  }
}
