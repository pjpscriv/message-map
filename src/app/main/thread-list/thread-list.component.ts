import { Component } from '@angular/core';
import { select, Store } from '@ngrx/store';
import {combineLatest, Observable, Subject} from 'rxjs';
import { map } from 'rxjs/operators';
import { Thread } from 'src/app/models/thread.interface';
import { selectThreads } from 'src/app/store/app.selectors';
import { AppState } from 'src/app/store/app.state';

type SortType = {
  name: string;
  text: string;
  method: (a: Thread, b: Thread) => number
};

@Component({
  selector: 'app-thread-list',
  templateUrl: './thread-list.component.html',
  styleUrls: ['./thread-list.component.css']
})
export class ThreadListComponent {
  public threadMap$ = this.store.pipe(select(selectThreads));
  public threads$: Observable<Array<Thread>>;
  public sortType$: Subject<SortType> = new Subject<SortType>();
  public sortTypes: Array<SortType> = [
    {
      name: 'MESSAGE_COUNT_DESC',
      text: 'Number of Messages',
      method: (a, b) => a.nb_messsages < b.nb_messsages ? 1 : -1
    },
    {
      name: 'PARTICIPANT_COUNT',
      text: 'Participants',
      method: (a, b) => a.nb_participants < b.nb_participants ? 1 : -1
    },
    {
      name: 'TITLE',
      text: 'Title',
      method: (a, b) => a.title < b.title ? 1 : -1
    },
    // TODO last message sent
    // TODO first message sent
  ];
  public selectedSort = this.sortTypes[0];


  constructor(
    private store: Store<AppState>
  ) {
    this.sortType$.next(this.selectedSort);
    this.threads$ = combineLatest([this.threadMap$, this.sortType$]).pipe(
      map(([threadMap, sortType]) => {
        return Object.values(threadMap).sort(sortType.method);
      })
    );
  }

  public sortChange(newSort: SortType | null): void {
    if (newSort) {
      this.sortType$.next(newSort);
      console.log(newSort.name);
    }
  }

  public getIcon(thread: Thread): string {
    switch (thread.nb_participants) {
      case 0: return 'person_off'; break;
      case 1: case 2: return 'person'; break;
      case 3: return 'people'; break;
      default: return 'groups';
    }
  }

  public compareSorts(a: SortType, b: SortType): boolean {
    return a.name === b.name;
  }
}
