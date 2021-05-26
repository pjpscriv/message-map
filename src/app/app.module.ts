import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ExplanationModalComponent } from './modals/explanation-modal/explanation-modal.component';
import { ProcessingModalComponent } from './modals/processing-modal/processing-modal.component';
import { ExploreModalComponent } from './modals/explore-modal/explore-modal.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { FiltersComponent } from './main/filters/filters.component';
import { DateDensityComponent } from './main/date-density/date-density.component';
import { TimeDensityComponent } from './main/time-density/time-density.component';
import { MessageDisplayComponent } from './main/message-display/message-display.component';
import { MainViewComponent } from './main/main-view/main-view.component';

@NgModule({
  declarations: [
    AppComponent,
    ExplanationModalComponent,
    ProcessingModalComponent,
    ExploreModalComponent,
    NavBarComponent,
    FiltersComponent,
    DateDensityComponent,
    TimeDensityComponent,
    MessageDisplayComponent,
    MainViewComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
