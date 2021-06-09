import { Component, EventEmitter, Output } from '@angular/core';
import {Store} from '@ngrx/store';
import {AppState, MODAL_STATE} from '../store/state';
import {UpdateModalDisplayAction} from '../store/actions';
import { ExplanationModalComponent } from '../modals/explanation-modal/explanation-modal.component';
import { ExploreModalComponent } from '../modals/explore-modal/explore-modal.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent {

  @Output() resetClicked = new EventEmitter();
  @Output() menuClicked = new EventEmitter();

  constructor(
    public dialog: MatDialog,
    private store: Store<AppState>
  ) {}

  public explore(): void {
    this.dialog.open(ExploreModalComponent)
    // this.store.dispatch(UpdateModalDisplayAction({modalDisplay: MODAL_STATE.EXPLORE}));
  }

  public explanation(): void {
    this.dialog.open(ExplanationModalComponent)
    // this.store.dispatch(UpdateModalDisplayAction({modalDisplay: MODAL_STATE.EXPLANATION}));
  }

  public reset(): void {
    this.resetClicked.emit();
  }

  public menu(): void {
    this.menuClicked.emit();
  }
}
