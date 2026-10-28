import { Directive, ElementRef, EventEmitter, NgZone, OnDestroy, OnInit, Output } from '@angular/core';

/**
 * Emits the element's content rect whenever it changes size.
 */
@Directive({
  selector: '[appResized]'
})
export class ResizedDirective implements OnInit, OnDestroy {
  @Output() public appResized = new EventEmitter<DOMRectReadOnly>();
  private observer: ResizeObserver;

  constructor(private el: ElementRef, private zone: NgZone) {
    this.observer = new ResizeObserver(entries => {
      this.zone.run(() => this.appResized.emit(entries[0].contentRect));
    });
  }

  public ngOnInit(): void {
    this.observer.observe(this.el.nativeElement);
  }

  public ngOnDestroy(): void {
    this.observer.disconnect();
  }
}
