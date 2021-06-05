import {Component, Input} from '@angular/core';
import {Store} from '@ngrx/store';
import {AppState, MODAL_STATE} from '../../store/state';
import {UpdateModalDisplayAction} from '../../store/actions';

@Component({
  selector: 'app-modal-template',
  templateUrl: './modal-template.component.html',
  styleUrls: ['./modal-template.component.css']
})
export class ModalTemplateComponent {

  @Input() closeable = true;

  constructor(private store: Store<AppState>) {}

  public closeClicked(): void {
    if (this.closeable) {
      this.store.dispatch(UpdateModalDisplayAction({modalDisplay: MODAL_STATE.NONE}));
    }
  }
}
