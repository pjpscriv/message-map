import { Component, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { MessageDataService } from 'src/app/shared/message-data.service';

@Component({
  selector: 'app-processing-modal',
  templateUrl: './processing-modal.component.html'
})
export class ProcessingModalComponent {

  public progress$: Observable<number>;

  constructor(private messageService: MessageDataService) {
    this.progress$ = this.messageService.getProgress();
  }

  // TODO: Inject a service of some sort and listen for when the messages are loaded

}
