import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ExplanationModalComponent } from '../modals/explanation-modal/explanation-modal.component';
import { ExploreModalComponent } from '../modals/explore-modal/explore-modal.component';
import { select, Store } from '@ngrx/store';
import { AppState } from '../store/app.state';
import { selectDarkMode } from '../store/app.selectors';
import { ToggleDarkModeAction } from '../store/app.actions';
import { DownloadModalComponent } from '../modals/dowload-modal/download-modal.component';

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
    this.store.pipe(select(selectDarkMode)).subscribe(darkMode => this.darkMode = darkMode);
  }

  public explanation(): void {
    this.dialog.open(ExplanationModalComponent, { autoFocus: false });
  }

  public download(): void {
    this.dialog.open(DownloadModalComponent, { autoFocus: false });
  }

  public explore(): void {
    this.dialog.open(ExploreModalComponent, { autoFocus: false });
  }

  public credits(): void {
    console.log('Psyche haven\'t made this yet');
  }

  public toggleDarkMode(): void {
    this.store.dispatch(ToggleDarkModeAction());
  }

  public reset(): void {
    this.resetClicked.emit();
  }

  public chats(): void {
    this.menuClicked.emit();
  }

  public filters(): void {
    this.filtersClicked.emit();
  }
}
