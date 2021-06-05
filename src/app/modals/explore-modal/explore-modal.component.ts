import { Component, Output, EventEmitter } from '@angular/core';
import { PreProcessingService } from 'src/app/shared/pre-processing.service';

@Component({
  selector: 'app-explore-modal',
  templateUrl: './explore-modal.component.html'
})
export class ExploreModalComponent {

  constructor(private preProcessingService: PreProcessingService) { }

  public readFiles(event: any): void {
    this.preProcessingService.readFiles(event.target.files);
  }
}
