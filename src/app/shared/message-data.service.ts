import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {select, Store} from '@ngrx/store';
import {AppState} from '../store/state';
import {UpdateLoadProgressAction, UpdateMessagesAction, UpdateThreadsAction} from '../store/actions';
import {selectLoadProgress} from '../store/selectors';
import { ThreadInfo } from '../models/thread.interface';

@Injectable({
  providedIn: 'root'
})
export class MessageDataService {

  private messageArray: Array<any> = [];

  constructor(private store: Store<AppState>) {}

  public addMessage(message: any): void {
    this.messageArray.push(message);
  }

  public addThreads(threads: Array<ThreadInfo>): void {
    this.store.dispatch(UpdateThreadsAction({ threads }))
  }

  public setProgress(value: number, total: number): void {
    const cent = Math.floor(total / 100);
    if (value % cent === 0) {
      const loadProgress = Math.floor((value / total) * 100);
      this.store.dispatch(UpdateLoadProgressAction({ loadProgress }));
    }
  }

  public getProgress(): Observable<number> {
    return this.store.pipe(select(selectLoadProgress));
  }

  public messagesLoaded(): void {
    this.store.dispatch(UpdateLoadProgressAction({ loadProgress: 100 }));
    this.store.dispatch(UpdateMessagesAction({messages: this.messageArray }));
  }
}
