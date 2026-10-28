import { Directive, ElementRef, EventEmitter, NgZone, OnDestroy, OnInit, Output } from '@angular/core';

/**
 * Emits the element's content rect whenever it changes size.
 */
@Directive({
  selector: '[resized]'
})
export class ResizedDirective implements OnInit, OnDestroy {
  @Output() public resized = new EventEmitter<DOMRectReadOnly>();
  private observer: ResizeObserver;

  constructor(private el: ElementRef, private zone: NgZone) {
    this.observer = new ResizeObserver(entries => {
      this.zone.run(() => this.resized.emit(entries[0].contentRect));
    });
  }

  public ngOnInit(): void {
    this.observer.observe(this.el.nativeElement);
  }

  public ngOnDestroy(): void {
    this.observer.disconnect();
  }
}
