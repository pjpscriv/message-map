import {Directive, ElementRef, Renderer2, OnInit, OnChanges, Input, SimpleChanges, AfterViewInit, ChangeDetectorRef} from '@angular/core';

@Directive({
  selector: '[appMatListColor]'
})
export class MatListColorDirective implements AfterViewInit, OnChanges {
  // @ts-ignore
  @Input('appMatListColor') bgColor?: string;
  // @Input('appMatListColor')
  // @ts-ignore
  private checkbox: HTMLElement;
  // @ts-ignore
  private avatar: HTMLElement;

  constructor(
    private renderer: Renderer2,
    private el: ElementRef,
    private cdr: ChangeDetectorRef
  ) {}

  public ngAfterViewInit(): void {
    this.checkbox = this.el.nativeElement.querySelector('.mat-pseudo-checkbox');
    this.avatar = this.el.nativeElement.querySelector('.mat-list-avatar');
    // console.log(`avatar!`, this.avatar);
    this.updateBackgroundColor();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (this.checkbox && this.avatar) {
      if (changes.bgColor) {
        // console.log(`Color change: ${changes.bgColor}`);
        this.renderer.setStyle(this.checkbox, 'background-color', this.bgColor);
        this.renderer.setStyle(this.checkbox, 'border-color', this.bgColor);
        this.renderer.setStyle(this.avatar, 'background-color', this.bgColor);
        this.cdr.markForCheck();
      } else {
        this.renderer.removeStyle(this.checkbox, 'background-color');
        this.renderer.removeStyle(this.checkbox, 'border-color');
        this.renderer.removeStyle(this.avatar, 'background-color');
      }
    }
  }

  private updateBackgroundColor(): void {

  }
}
