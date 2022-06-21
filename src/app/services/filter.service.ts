import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {Crossfilter} from '../types/crossfilter.aliases';
import {Message} from '../types/message.interface';
import {AppState} from '../store/app.state';
import {select, Store} from '@ngrx/store';
import {selectChartData, selectMessageData} from '../store/app.selectors';
import {UpdateMessageFilterAction} from '../store/app.actions';
import {combineLatest} from 'rxjs';
import {filter} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FilterService {

  private redraw$ = new Subject();

  constructor(private store: Store<AppState>) { }

  public getMessageDataFilter(): Observable<Crossfilter<Message>> {
    return this.store.pipe(select(selectMessageData));
  }

  public getMessageAndChartFilters(): Observable<[Crossfilter<Message>, Crossfilter<Message>]> {
    return combineLatest([
      this.store.pipe(select(selectMessageData)),
      this.store.pipe(select(selectChartData))
    ]).pipe(
      filter(pair => !!pair && !!pair[0] && !!pair[1] && pair[0]?.size() !== 0 && pair[1]?.size() !== 0)
    );
  }

  public setMessageDataFilter(messageFilter: Crossfilter<Message>): void {
    this.store.dispatch(UpdateMessageFilterAction({ messageFilter }));
  }

  public redrawFilter(): void {
    this.redraw$.next();
  }

  public getFilterRedraw(): Subject<any> {
    return this.redraw$;
  }
}
