import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Crossfilter} from '../models/crossfilter.aliases';
import {Message} from '../models/message.interface';
import {AppState} from '../store/app.state';
import {select, Store} from '@ngrx/store';
import {selectMessages} from '../store/app.selectors';
import {UpdateMessageFilterAction} from '../store/app.actions';

@Injectable({
  providedIn: 'root'
})
export class FilterService {

  constructor(private store: Store<AppState>) { }

  public getMessageFilter(): Observable<Crossfilter<Message>> {
    return this.store.pipe(select(selectMessages));
  }

  public setMessageFiler(messageFilter: Crossfilter<Message>): void {
    this.store.dispatch(UpdateMessageFilterAction({ messageFilter }));
  }
}
