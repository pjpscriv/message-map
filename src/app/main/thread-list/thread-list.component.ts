import { Component } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { ThreadInfo } from 'src/app/models/thread.interface';
import { selectThreads } from 'src/app/store/selectors';
import { AppState } from 'src/app/store/state';

@Component({
  selector: 'app-thread-list',
  templateUrl: './thread-list.component.html',
  styleUrls: ['./thread-list.component.css']
})
export class ThreadListComponent {

  public threads$ = this.store.pipe(select(selectThreads))

  constructor(private store: Store<AppState>) { }

  public getIcon(thread: ThreadInfo): string {
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
}
