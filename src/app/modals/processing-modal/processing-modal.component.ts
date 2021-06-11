import { Component } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { selectLoadProgress } from '../../store/selectors';
import { AppState } from '../../store/state';

@Component({
  selector: 'app-processing-modal',
  templateUrl: './processing-modal.component.html'
})
export class ProcessingModalComponent {

  public progress$ = this.store.pipe(select(selectLoadProgress));
  public loaded = false;

  constructor(private store: Store<AppState>) {
    this.progress$.subscribe(loadProgress => {
      if (loadProgress >= 100) {
        this.loaded = true;
      }
    });
  }
}
