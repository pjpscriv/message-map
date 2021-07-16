import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ExplanationModalComponent } from '../modals/explanation-modal/explanation-modal.component';
import { ExploreModalComponent } from '../modals/explore-modal/explore-modal.component';
import {select, Store} from '@ngrx/store';
import {AppState} from '../store/app.state';
import {selectDarkMode} from '../store/app.selectors';
import {UpdateDarkModeAction} from '../store/app.actions';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
  @Output() resetClicked = new EventEmitter();
  @Output() menuClicked = new EventEmitter();
  @Output() filtersClicked = new EventEmitter();
  public darkMode = false;

  constructor(
    public dialog: MatDialog,
    private store: Store<AppState>
  ) {}

  public ngOnInit(): void {
    this.explanation();
    this.store.pipe(select(selectDarkMode)).subscribe(darkMode =>
      this.darkMode = darkMode
    );
  }

  public explore(): void {
    this.dialog.open(ExploreModalComponent);
  }

  public explanation(): void {
    this.dialog.open(ExplanationModalComponent);
  }

  public toggleDarkMode(): void {
    this.store.dispatch(UpdateDarkModeAction({ darkMode: !this.darkMode }));
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
