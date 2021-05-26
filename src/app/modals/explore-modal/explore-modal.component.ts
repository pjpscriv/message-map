import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { PreProcessingService } from 'src/app/shared/pre-processing.service';

@Component({
  selector: 'app-explore-modal',
  templateUrl: './explore-modal.component.html',
  styleUrls: ['./explore-modal.component.css']
})
export class ExploreModalComponent implements OnInit {

  @Output() close = new EventEmitter();
  @Output() loading = new EventEmitter();

  constructor(private preProcessingService: PreProcessingService) { }

  ngOnInit(): void {
  }

  public closeClicked() {
    this.close.emit();
  }

  public readFiles(event: any) {
    this.preProcessingService.readFiles(event.target.files);
    this.loading.emit();
  }
}
