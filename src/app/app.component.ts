import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Message } from './models/thread.interface';
import { UpdateMessagesAction } from './store/actions';
import { AppState, MODAL_STATE } from './store/state';
import { selectModalDisplay } from './store/selectors';
import { map, filter } from 'rxjs/operators';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ProcessingModalComponent } from './modals/processing-modal/processing-modal.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'ngfbmessage';

  public showExplanation$ = this.store.pipe(
    select(selectModalDisplay),
    map(modalState => modalState === MODAL_STATE.EXPLANATION)
  );
  public showExplore$ = this.store.pipe(
    select(selectModalDisplay),
    map(modalState => modalState === MODAL_STATE.EXPLORE)
  );
  public showProcessing$ = this.store.pipe(
    select(selectModalDisplay),
    filter(modalState => modalState === MODAL_STATE.PROGRESS)
  );

  constructor(
    public dialog: MatDialog,
    private store: Store<AppState>
    ) {}

  public ngOnInit(): void {
    // this.store.dispatch(UpdateMessagesAction({ messages: [this.testMessage] }));
  }

  test(): void {
    // this.store.dispatch(UpdateMessagesAction({ messages: [this.testMessage] }));
  }
}
