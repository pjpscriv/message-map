import { Component } from '@angular/core';
import { select, Store } from '@ngrx/store';
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

}
