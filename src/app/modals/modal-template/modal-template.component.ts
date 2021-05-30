import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal-template',
  templateUrl: './modal-template.component.html',
  styleUrls: ['./modal-template.component.css']
})
export class ModalTemplateComponent {

  @Output() close = new EventEmitter();
  @Input() closeable = true;

  public closeClicked() : void {
    if (this.closeable) {
      this.close.emit();
    }
  }
}
