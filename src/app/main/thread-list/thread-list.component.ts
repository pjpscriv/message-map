import { Component } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Thread } from 'src/app/models/thread.interface';
import { selectThreads } from 'src/app/store/app.selectors';
import { AppState } from 'src/app/store/app.state';

enum SORT_BY {
  MESSAGE_COUNT,
  PARTICIPANT_COUNT,
  TITLE,
}

@Component({
  selector: 'app-thread-list',
  templateUrl: './thread-list.component.html',
  styleUrls: ['./thread-list.component.css']
})
export class ThreadListComponent {

  public threadMap$ = this.store.pipe(select(selectThreads))
  // public threadIdsS = this.threads$.pipe(map((threads: ThreadMap) => Object.keys(threads)));
  public threads$: Observable<Array<Thread>>;
  public sortMethod = SORT_BY.MESSAGE_COUNT;

  constructor(private store: Store<AppState>) {
    this.threads$ = this.threadMap$.pipe(
      map(threadMap => Object.values(threadMap).sort(this.sortMethods(this.sortMethod)))
    )
  }

  public getIcon(thread: Thread): string {
    switch (thread.nb_participants) {
      case 0:
        return 'person_off';
        break;
      case 1:
        return 'person';
        break;
      case 2:
        return 'person';
        break;
      case 3:
        return 'people';
        break;
      default:
        return 'groups';
    }
  }

  // TODO: This doesn't feel like the cleanest way of doing this - fix
  private sortMethods(method: SORT_BY): (a:Thread, b:Thread) => number {
    switch(method) {
      case (SORT_BY.MESSAGE_COUNT):
        return (a: Thread, b: Thread) => a.nb_messsages < b.nb_messsages ? 1 : -1;
      case (SORT_BY.PARTICIPANT_COUNT):
        return (a: Thread, b: Thread) => a.nb_participants < b.nb_participants ? 1 : -1;
      case (SORT_BY.TITLE):
        return (a: Thread, b: Thread) => a.title < b.title ? 1 : -1;
      default:
        return (a: Thread, b: Thread) => a.nb_messsages < b.nb_messsages ? 1 : -1;
    }
  }
}
