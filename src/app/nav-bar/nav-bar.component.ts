import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { ExplanationModalComponent } from '../modals/explanation-modal/explanation-modal.component';
import { ExploreModalComponent } from '../modals/explore-modal/explore-modal.component';
import { AppState } from '../store/state';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {

  @Output() resetClicked = new EventEmitter();
  @Output() menuClicked = new EventEmitter();
  @Output() filtersClicked = new EventEmitter();

  constructor(
    public dialog: MatDialog
  ) {}

  public ngOnInit(): void {
    this.explanation();
  }

  public explore(): void {
    this.dialog.open(ExploreModalComponent);
  }

  public explanation(): void {
    this.dialog.open(ExplanationModalComponent);
  }

  public reset(): void {
    this.resetClicked.emit();
  }

  public menu(): void {
    this.menuClicked.emit();
  }

  public filters(): void {
    this.filtersClicked.emit();
  }
}
