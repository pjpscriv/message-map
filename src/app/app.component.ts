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


  public displayModal(modalName: string) {
    this.showExplanation = false;
    this.showExplore = false;
    this.showProcessing = false;

    if (modalName === "explanation") {
      this.showExplanation = true;
    } else if (modalName === "explore") {
      this.showExplore = true;
    } else if (modalName === "processing") {
      this.showProcessing = true;
    }
  }
}
