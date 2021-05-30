import { Component, Output, EventEmitter } from '@angular/core';
import { PreProcessingService } from 'src/app/shared/pre-processing.service';

@Component({
  selector: 'app-explore-modal',
  templateUrl: './explore-modal.component.html'
})
export class ExploreModalComponent {

  @Output() close = new EventEmitter();
  @Output() loading = new EventEmitter();

  constructor(private preProcessingService: PreProcessingService) { }

  public closeClicked(): void {
    this.close.emit();
  }

  public readFiles(event: any): void {
    this.loading.emit();
    this.preProcessingService.readFiles(event.target.files);
  }
}
