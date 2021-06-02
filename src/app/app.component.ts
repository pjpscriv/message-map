import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Message } from './models/thread.interface';
import { UpdateMessagesAction } from './store/actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'ngfbmessage';

  public showExplanation = true;
  public showExplore = false;
  public showProcessing = false;

  private testMessage: Message = {
    sender_name: "Peter",
    timestamp: null,
    timestamp_ms: null,
    type: "message",
    photos: null,
    videos: null,
    files: null,
    media: "",
    content: "Hello World!",
    message: "It's a me",
    length: "8",
    reactions: []
  }

  constructor (private store: Store) {}

  public ngOnInit() {
    this.store.dispatch(new UpdateMessagesAction({ messages: [this.testMessage] }));
  }

  test() {
    this.store.dispatch(new UpdateMessagesAction({ messages: [this.testMessage] }));
  }

  public displayModal(modalName: string): void {
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
