import {Component, HostBinding} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {AppState} from './store/app.state';
import {selectDarkMode} from './store/app.selectors';
import {OverlayContainer} from '@angular/cdk/overlay';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @HostBinding('class') className = '';
  private darkModeClass = 'dark-mode';

  title = 'ngfbmessage';

  constructor(
    private store: Store<AppState>,
    private overlay: OverlayContainer
  ) {
    this.store.pipe(select(selectDarkMode)).subscribe(darkMode => {
      if (darkMode) {
        this.className = this.darkModeClass;
        this.overlay.getContainerElement().classList.add(this.darkModeClass);
      } else {
        this.className = '';
        this.overlay.getContainerElement().classList.remove(this.darkModeClass);
      }
    });
  }

  test(): void {
    console.log('Whoo test clicked');
  }
}
