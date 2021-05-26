import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-processing-modal',
  templateUrl: './processing-modal.component.html',
  styleUrls: ['./processing-modal.component.css']
})
export class ProcessingModalComponent implements OnInit {

  @Output() close = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  public closeClicked() {
    this.close.emit();
  }
}
