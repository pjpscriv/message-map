import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCarouselModule } from '@ngbmodule/material-carousel';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { AngularResizeEventModule } from 'angular-resize-event';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BarChartComponent } from './main/filters/bar-chart/bar-chart.component';
import { FiltersComponent } from './main/filters/filters.component';
import { MainViewComponent } from './main/main-view/main-view.component';
import { ThreadListComponent } from './main/thread-list/thread-list.component';
import { ExplanationModalComponent } from './modals/explanation-modal/explanation-modal.component';
import { ExploreModalComponent } from './modals/explore-modal/explore-modal.component';
import { ProcessingModalComponent } from './modals/processing-modal/processing-modal.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import {chartDataReducer, darkModeReducer, loadProgressReducer, messageDataReducer, threadsReducer} from './store/app.reducer';
import { MatListColorDirective } from './main/thread-list/mat-list-color.directive';

@NgModule({
  declarations: [
    AppComponent,
    ExplanationModalComponent,
    ProcessingModalComponent,
    ExploreModalComponent,
    NavBarComponent,
    FiltersComponent,
    MainViewComponent,
    ThreadListComponent,
    BarChartComponent,
    MatListColorDirective
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
      messageData: messageDataReducer,
      chartData: chartDataReducer,
      loadProgress: loadProgressReducer,
      threads: threadsReducer,
      darkMode: darkModeReducer
    }),
    EffectsModule.forRoot([]),
    StoreDevtoolsModule.instrument({}),
    AngularResizeEventModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    MatChipsModule,
    MatCheckboxModule,
    MatCardModule,
    MatCarouselModule
  ],
  providers: [MatListColorDirective],
  bootstrap: [AppComponent]
})
export class AppModule {}
