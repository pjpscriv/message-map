import { AfterViewInit, Component, HostBinding, ViewChild } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { AppState } from './store/app.state';
import { selectDarkMode } from './store/app.selectors';
import { OverlayContainer } from '@angular/cdk/overlay';
import { DemoDataService } from './shared/demo-data.service';
import { MatDrawerMode, MatSidenav } from '@angular/material/sidenav';
import { ThreadListComponent } from './main/thread-list/thread-list.component';
import { UpdateDarkModeAction } from './store/app.actions';

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

  constructor(
    private store: Store<AppState>,
    private overlay: OverlayContainer,
    private loader: DemoDataService
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

    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      this.store.dispatch(UpdateDarkModeAction({ darkMode: true }));
    }
  }

  public ngAfterViewInit(): void {
    this.loader.getDemoData();
  }

  public getSideNavMode(): MatDrawerMode {
    return (window.innerWidth > 1100) ? 'side' : 'over';
  }

  private oneSideNavOnly(): boolean {
    return this.getSideNavMode() === 'over';
  }

  public menuClicked(): void {
    if (!!this.threadsSidenav && !!this.threadList) {
      if (this.oneSideNavOnly() && !this.threadsSidenav.opened && this.filtersSidenav?.opened) {
        this.filtersSidenav.toggle();
      }
      this.threadsSidenav.toggle();
      this.threadList.refreshList();
    }
  }

  public filtersClicked(): void {
    if (!!this.filtersSidenav) {
      if (this.oneSideNavOnly() && !this.filtersSidenav.opened && this.threadsSidenav?.opened) {
        this.threadsSidenav.toggle();
      }
      this.filtersSidenav.toggle();
    }
  }

  public resetClicked(): void {
    console.log('Whooo test clicked');
  }
}
