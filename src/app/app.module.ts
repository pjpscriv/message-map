import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatBadgeModule } from '@angular/material/badge';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { MatLegacyChipsModule as MatChipsModule } from '@angular/material/legacy-chips';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyListModule as MatListModule } from '@angular/material/legacy-list';
import { MatLegacyProgressBarModule as MatProgressBarModule } from '@angular/material/legacy-progress-bar';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BarChartComponent } from './filters/bar-chart/bar-chart.component';
import { FiltersComponent } from './filters/filters.component';
import { MainViewComponent } from './main/main-view/main-view.component';
import { ThreadListComponent } from './chats/thread-list.component';
import { ExplanationModalComponent } from './modals/explanation-modal/explanation-modal.component';
import { ExploreModalComponent } from './modals/explore-modal/explore-modal.component';
import { ProcessingModalComponent } from './modals/processing-modal/processing-modal.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import {
  chartDataReducer,
  darkModeReducer,
  fileDataReducer,
  loadProgressReducer,
  messageDataReducer,
  threadsReducer
} from './store/app.reducer';
import { MatListColorDirective } from './chats/mat-list-color.directive';
import { ResizedDirective } from './main/main-view/resized.directive';
import { DownloadModalComponent } from './modals/dowload-modal/download-modal.component';
import { environment } from '../environments/environment';


@NgModule({
  declarations: [
    AppComponent,
    ExplanationModalComponent,
    ProcessingModalComponent,
    ExploreModalComponent,
    DownloadModalComponent,
    NavBarComponent,
    FiltersComponent,
    MainViewComponent,
    ThreadListComponent,
    BarChartComponent,
    MatListColorDirective,
    ResizedDirective
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
      fileData: fileDataReducer,
      loadProgress: loadProgressReducer,
      threads: threadsReducer,
      darkMode: darkModeReducer
    }),
    EffectsModule.forRoot([]),
    StoreDevtoolsModule.instrument({maxAge: 25, logOnly: environment.production}),
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    MatChipsModule,
    MatCheckboxModule,
    MatCardModule,
    MatMenuModule,
    MatTooltipModule
  ],
  providers: [MatListColorDirective],
  bootstrap: [AppComponent]
})
export class AppModule {}
