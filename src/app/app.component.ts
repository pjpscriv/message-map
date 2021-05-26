import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ngfbmessage';

  public showExplanation = true;
  public showExplore = false;
  public showProcessing = false;

  public displayExplanation(display: boolean) {
    this.showExplanation = display;
    this.showExplore = false;
    this.showProcessing = false;
  }

  public displayExplore(display: boolean) {
    this.showExplore = display;
    this.showExplanation = false;
    this.showProcessing = false;
  }

  public displayProcessing(display: boolean) {
    this.showProcessing = display;
    this.showExplore = false;
    this.showExplanation = false;
  }

  public resetClicked() {
    this.showExplanation = false;
    this.showExplore = false;
    this.showProcessing = false;
  }
}
