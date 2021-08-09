import {AfterViewInit, Component, ElementRef, HostBinding} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {AppState} from './store/app.state';
import {selectDarkMode} from './store/app.selectors';
import {OverlayContainer} from '@angular/cdk/overlay';
import {HttpClient} from '@angular/common/http';
import {DemoDataService} from './shared/demo-data.service';
import {DemoData} from './models/demo-data.interface';
import {MatDrawerMode} from '@angular/material/sidenav';

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
    private loader: DemoDataService,
    private el: ElementRef
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
    this.http.get('assets/messages/demo_messages.json', { responseType: 'json' })
      .subscribe((data) => this.loader.loadDemoData((data as DemoData)));
  }

  public getSideNavMode(): MatDrawerMode {
    return this.el.nativeElement.clientWidth > 1100 ? 'side' : 'over';
  }

  public test(): void {
    console.log('Whoo test clicked');
  }
}
