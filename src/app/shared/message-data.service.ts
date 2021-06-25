import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Message, ThreadMap } from '../models/thread.interface';
import { UpdateLoadProgressAction, UpdateMessagesAction, UpdateThreadsAction } from '../store/app.actions';
import { selectLoadProgress } from '../store/app.selectors';
import { AppState } from '../store/app.state';

@Injectable({
  providedIn: 'root'
})
export class MessageDataService {

  private messageArray: Array<Message> = [];

  constructor(private store: Store<AppState>) {}

  public addMessage(message: Message): void {
    this.messageArray.push(message);
  }

  public addThreads(threads: ThreadMap): void {
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
