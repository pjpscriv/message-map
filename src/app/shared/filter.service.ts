import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {Crossfilter} from '../types/crossfilter.aliases';
import {Message} from '../types/message.interface';
import {AppState} from '../store/app.state';
import {select, Store} from '@ngrx/store';
import {selectMessages} from '../store/app.selectors';
import {UpdateMessageFilterAction} from '../store/app.actions';

@Injectable({
  providedIn: 'root'
})
export class FilterService {

  private redraw$ = new Subject();

  constructor(private store: Store<AppState>) { }

  public getMessageFilter(): Observable<Crossfilter<Message>> {
    return this.store.pipe(select(selectMessages));
  }

  public setMessageFiler(messageFilter: Crossfilter<Message>): void {
    this.store.dispatch(UpdateMessageFilterAction({ messageFilter }));
  }

  public redrawFilter(): void {
    this.redraw$.next();
  }

  public getFilterRedraw(): Subject<any> {
    return this.redraw$;
  }
}
