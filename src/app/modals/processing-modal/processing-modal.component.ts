import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { select, Store } from '@ngrx/store';
import { selectLoadProgress } from '../../store/app.selectors';
import { AppState } from '../../store/app.state';

@Component({
  selector: 'app-processing-modal',
  templateUrl: './processing-modal.component.html'
})
export class ProcessingModalComponent {

  public progress$ = this.store.pipe(select(selectLoadProgress));
  public final = false;
  public loaded = false;

  constructor(
    private store: Store<AppState>,
    private dialogRef: MatDialogRef<ProcessingModalComponent>
  ) {
    this.progress$.subscribe(loadProgress => {
      this.final = loadProgress === 99;

      if (loadProgress >= 100) {
        this.loaded = true;
        this.dialogRef.close();
      }
    });
  }
}
