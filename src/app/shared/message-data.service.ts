import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import {select, Store} from '@ngrx/store';
import {AppState} from '../store/state';
import {UpdateLoadProgressAction, UpdateMessagesAction} from '../store/actions';
import {selectLoadProgress} from '../store/selectors';

@Injectable({
  providedIn: 'root'
})
export class MessageDataService {

  private messageArray: Array<any> = [];
  private progress = new Subject<number>();

  constructor(private store: Store<AppState>) {}

  public addMessage(message: any): void {
    this.messageArray.push(message);
  }

  public setProgress(value: number, total: number): void {
    const loadProgress = Math.floor((value / total) * 100);
    this.store.dispatch(UpdateLoadProgressAction({ loadProgress }));
  }

  public getProgress(): Observable<number> {
    return this.store.pipe(select(selectLoadProgress));
  }

  public messagesLoaded(): void {
    this.progress.next(100);
    this.store.dispatch(UpdateMessagesAction({messages: this.messageArray }));
  }
}
