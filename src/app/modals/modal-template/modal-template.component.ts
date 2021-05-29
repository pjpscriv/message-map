import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-modal-template',
  templateUrl: './modal-template.component.html',
  styleUrls: ['./modal-template.component.css']
})
export class ModalTemplateComponent implements OnInit {

  @Output() close = new EventEmitter();
  @Input() closeable = true;

  constructor() { }

  ngOnInit(): void {
  }

  public closeClicked() {
    if (this.closeable) {
      this.close.emit();
    }
  }
}
