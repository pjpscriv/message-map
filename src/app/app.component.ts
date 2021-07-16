import {Component, HostBinding} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {AppState} from './store/app.state';
import {selectDarkMode} from './store/app.selectors';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @HostBinding('class') className = '';

  title = 'ngfbmessage';

  constructor(private store: Store<AppState>) {
    this.store.pipe(select(selectDarkMode)).subscribe(darkMode => {
      this.className = darkMode ? 'dark-mode' : '';
    });
  }

  test(): void {
    console.log('Whoo test clicked');
  }
}
