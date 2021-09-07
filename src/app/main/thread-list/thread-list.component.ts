import {Component, OnDestroy, ViewChild} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {combineLatest, Observable, Subject} from 'rxjs';
import {filter, map, takeUntil} from 'rxjs/operators';
import {Thread} from 'src/app/types/thread.interface';
import {selectThreads} from 'src/app/store/app.selectors';
import {AppState} from 'src/app/store/app.state';
import {DatePipe} from '@angular/common';
import {MatSelectionList, MatSelectionListChange} from '@angular/material/list';
import {FilterService} from '../../shared/filter.service';
import {Crossfilter} from '../../types/crossfilter.aliases';
import {Message} from '../../types/message.interface';
import crossfilter from 'crossfilter2';

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
export class ThreadListComponent implements OnDestroy {
  // @ts-ignore
  @ViewChild('threads') threads: MatSelectionList;
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

  private colorListItems = false;
  private filter = crossfilter([] as Message[]);
  private threadDimension = this.filter.dimension(m => m.thread_id);

  private destroyed$ = new Subject();

  constructor(
    private store: Store<AppState>,
    private filterService: FilterService,
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

    this.filterService.getMessageFilter().pipe(
      takeUntil(this.destroyed$),
      filter(messages => !!messages && messages?.size() !== 0))
      .subscribe((messagesFilter: Crossfilter<Message>) => {
        this.filter = messagesFilter;
        this.threadDimension = messagesFilter.dimension((message: Message) => message.thread_id);
      });
  }

  // Sorting Functions //
  public sortChange(newSort: SortType | null): void {
    if (newSort) {
      this.selectedSort = newSort;
      this.sortType$.next(newSort);
    }
  }

  public compareSorts(a: SortType, b: SortType): boolean {
    return a.name === b.name;
  }

  // Chat Selection Functions //
  public onSelectionChange(event: MatSelectionListChange): void {
    const selectedIds = new Set(event.source.selectedOptions.selected.map(option => option._getHostElement().id));
    // console.log(`Selected ${selectedIds.size} threads`);
    this.threadDimension.filter(id => selectedIds.has(id as string));
    this.filterService.redrawFilter();
  }

  public setAllThreadSelection(allSelected: boolean): void {
    this.allThreadsSelected = allSelected;
    if (allSelected) {
      this.threads.selectAll();
      this.threadDimension.filterAll();
    } else {
      this.threads.deselectAll();
      this.threadDimension.filter('');
    }
    this.filterService.redrawFilter();
  }

  public someThreadsSelected(): boolean {
    const selected = this.threads?.selectedOptions.selected.length;
    return 0 < selected && selected < this.threadCount;
  }

  // UI Functions //
  public getIcon(thread: Thread): string {
    switch (thread.nb_participants) {
      case 0: return 'person_off';
      case 1: case 2: return 'person';
      case 3: return 'people';
      default: return 'groups';
    }
  }

  public getSubtitle(thread: Thread): string {
    // TODO: Make this cooler: "6 Aug", "4 Jan '19", etc
    if (this.selectedSort.name === 'FIRST_MESSAGE_NEWEST_FIRST') {
      return `First: ${ this.datePipe.transform(thread.first_message, 'd MMM y, h:mm aaaaa\'m\'') }`;
    } else {
      return `Last: ${ this.datePipe.transform(thread.last_message, 'd MMM y, h:mm aaaaa\'m\'') }`;
    }
  }

  public getColors(thread: Thread): any {
    if (this.colorListItems) {
      const rand = `#${Math.random().toString(16).slice(-6)}`;
      return this.stringToColor(thread.id);
    } else {
      return '#0099FF';
    }
  }

  public toggleColors(): void {
    this.colorListItems = !this.colorListItems;
  }

  public trackByThreadId(index: number, item: Thread): string {
    return item.id;
  }

  public refreshList(): void {
    this.sortType$.next(this.selectedSort);
  }

  public ngOnDestroy(): void {
    this.destroyed$.next();
  }

  // tslint:disable:no-bitwise
  private stringToColor(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const c = (hash & 0x00FFFFFF).toString(16).toUpperCase();
    return '#' + '00000'.substring(0, 6 - c.length) + c;
  }
}
