import {Component} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {selectLoadProgress} from '../../store/selectors';
import {AppState, MODAL_STATE} from '../../store/state';
import {UpdateModalDisplayAction} from '../../store/actions';

@Component({
  selector: 'app-processing-modal',
  templateUrl: './processing-modal.component.html'
})
export class ProcessingModalComponent {

  public progress$ = this.store.pipe(select(selectLoadProgress));

  constructor(private store: Store<AppState>) {
    this.progress$.subscribe(loadProgress => {
      if (loadProgress >= 100) {
        this.store.dispatch(UpdateModalDisplayAction({modalDisplay: MODAL_STATE.NONE}));
      }
    });
  }
}
