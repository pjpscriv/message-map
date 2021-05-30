import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-explanation-modal',
  templateUrl: './explanation-modal.component.html'
})
export class ExplanationModalComponent {

  @Output() close = new EventEmitter();

  public closeClicked(): void {
    this.close.emit();
  }

}
