import {Component, ViewChild} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {combineLatest, Observable, Subject} from 'rxjs';
import {map} from 'rxjs/operators';
import {Thread} from 'src/app/models/thread.interface';
import {selectThreads} from 'src/app/store/app.selectors';
import {AppState} from 'src/app/store/app.state';
import {DatePipe} from '@angular/common';
import {MatSelectionList} from '@angular/material/list';

type SortType = {
  name: string;
  text: string;
  method: (a: Thread, b: Thread) => number
};

@Component({
  selector: 'app-thread-list',
  templateUrl: './thread-list.component.html',
  styleUrls: ['./thread-list.component.scss'],
  providers: [ DatePipe ]
})
export class ThreadListComponent {
  public threads$: Observable<Array<Thread>>;
  public sortType$: Subject<SortType> = new Subject<SortType>();
  public sortTypes: Array<SortType> = [
    {
      name: 'MESSAGE_COUNT_DESC',
      text: 'Number of Messages',
      method: (a, b) => a.nb_messages < b.nb_messages ? 1 : -1
    },
    {
      name: 'PARTICIPANT_COUNT_DESC',
      text: 'Participants',
      method: (a, b) => a.nb_participants < b.nb_participants ? 1 : -1
    },
    {
      name: 'TITLE_A_Z',
      text: 'Title',
      method: (a, b) => a.title > b.title ? 1 : -1
    },
    {
      name: 'LAST_MESSAGE_NEWEST_FIRST',
      text: 'Last Message',
      method: (a, b) => a.last_message < b.last_message ? 1 : -1
    },
    {
      name: 'FIRST_MESSAGE_NEWEST_FIRST',
      text: 'First Message',
      method: (a, b) => a.first_message < b.first_message ? 1 : -1
    },
  ];
  public selectedSort = this.sortTypes[0];
  public threadCount = 0;
  public allThreadsSelected = true;

  // @ts-ignore
  @ViewChild('threads') threads: MatSelectionList;

  constructor(
    private store: Store<AppState>,
    private datePipe: DatePipe
  ) {
    this.threads$ = combineLatest([this.sortType$,
      this.store.pipe(select(selectThreads))]).pipe(
      map(([sortType, threadMap]) => {
        const threads = Object.values(threadMap);
        this.threadCount = threads.length;
        return threads.sort(sortType.method);
      })
    );
  }

  public sortChange(newSort: SortType | null): void {
    if (newSort) {
      this.selectedSort = newSort;
      this.sortType$.next(newSort);
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

  public getSubtitle(thread: Thread): string {
    // TODO: Make this cooler: "6 Aug", "4 Jan '19", etc
    if (this.selectedSort.text === 'First Message') {
      return `First: ${ this.datePipe.transform(thread.first_message, 'd MMM y, h:mm aaaaa\'m\'') }`;
    } else {
      return `Last: ${ this.datePipe.transform(thread.last_message, 'd MMM y, h:mm aaaaa\'m\'') }`;
    }
  }

  public compareSorts(a: SortType, b: SortType): boolean {
    return a.name === b.name;
  }

  public refreshList(): void {
    this.sortType$.next(this.selectedSort);
  }

  public setAllThreadSelection(allSelected: boolean): void {
    this.allThreadsSelected = allSelected;
    allSelected ? this.threads.selectAll() : this.threads.deselectAll();
  }

  public someThreadsSelected(): boolean {
    const selected = this.threads?.selectedOptions.selected.length;
    return 0 < selected && selected < this.threadCount;
  }
}
