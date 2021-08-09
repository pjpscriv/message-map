import {AfterViewInit, Component, ElementRef, HostBinding, ViewChild} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {AppState} from './store/app.state';
import {selectDarkMode} from './store/app.selectors';
import {OverlayContainer} from '@angular/cdk/overlay';
import {HttpClient} from '@angular/common/http';
import {DemoDataService} from './shared/demo-data.service';
import {DemoData} from './models/demo-data.interface';
import {MatDrawerMode, MatSidenav} from '@angular/material/sidenav';
import {ThreadListComponent} from './main/thread-list/thread-list.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  @HostBinding('class') className = '';
  @ViewChild('threadsSidenav') threadsSidenav?: MatSidenav;
  @ViewChild('filtersSidenav') filtersSidenav?: MatSidenav;
  @ViewChild('threadList') threadList?: ThreadListComponent;
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

  private oneSideNavOnly(): boolean {
    return this.getSideNavMode() === 'over';
  }

  public menuClicked(): void {
    if (!!this.threadsSidenav && !!this.threadList) {
      if (this.filtersSidenav?.opened && !this.threadsSidenav.opened) {
        this.filtersSidenav.toggle();
      }
      this.threadsSidenav.toggle();
      this.threadList.refreshList();
    }
  }

  public filtersClicked(): void {
    if (!!this.filtersSidenav) {
      if (!this.filtersSidenav.opened && this.threadsSidenav?.opened) {
        this.threadsSidenav.toggle();
      }
      this.filtersSidenav.toggle();
    }
  }

  public resetClicked(): void {
    console.log('Whoo test clicked');
  }
}
