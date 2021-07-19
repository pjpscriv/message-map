import {AfterViewInit, Component, HostBinding} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {AppState} from './store/app.state';
import {selectDarkMode} from './store/app.selectors';
import {OverlayContainer} from '@angular/cdk/overlay';
import {HttpClient} from '@angular/common/http';
import {PreProcessingService} from './shared/pre-processing.service';
import {Message} from './models/message.interface';

interface DemoData {
  messages_array: Array<Message>;
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  @HostBinding('class') className = '';
  private darkModeClass = 'dark-mode';

  title = 'ngfbmessage';

  constructor(
    private store: Store<AppState>,
    private overlay: OverlayContainer,
    private http: HttpClient,
    private loader: PreProcessingService
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

  public ngAfterViewInit(): void {
    this.http.get('assets/demo_messages.json', { responseType: 'json' })
      .subscribe((data) => {
        console.log('Loaded demo messages');
        // this.loader.loadDemoData((data as DemoData)?.messages_array);
      });
  }

  test(): void {
    console.log('Whoo test clicked');
  }
}
