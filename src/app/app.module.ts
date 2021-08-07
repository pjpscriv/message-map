import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

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
import { ThreadListComponent } from './main/thread-list/thread-list.component';

import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatDialogModule } from '@angular/material/dialog';
import { MatBadgeModule } from '@angular/material/badge';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { AngularResizedEventModule } from 'angular-resize-event';

import {
  messagesReducer,
  loadProgressReducer,
  threadsReducer,
  darkModeReducer
} from './store/app.reducer';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';

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
    MainViewComponent,
    ThreadListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatSidenavModule,
    MatListModule,
    MatDialogModule,
    MatBadgeModule,
    StoreModule.forRoot({
      messages: messagesReducer,
      loadProgress: loadProgressReducer,
      threads: threadsReducer,
      darkMode: darkModeReducer
    }),
    EffectsModule.forRoot([]),
    StoreDevtoolsModule.instrument({}),
    AngularResizedEventModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    MatChipsModule,
    MatCheckboxModule,
    MatCardModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
