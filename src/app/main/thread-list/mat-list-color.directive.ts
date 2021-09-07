import {Directive, ElementRef, Renderer2, OnInit, OnChanges, Input, SimpleChanges, AfterViewInit, ChangeDetectorRef} from '@angular/core';

@Directive({
  selector: '[appMatListColor]'
})
export class MatListColorDirective implements AfterViewInit, OnChanges {
  // @ts-ignore
  @Input('appMatListColor') bgColor: string;
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
    console.log(`avatar!`, this.avatar);
    this.updateBackgroundColor();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.bgColor && this.checkbox && this.avatar) {
      console.log(`Color change: ${changes.bgColor}`);
      this.renderer.setStyle(this.checkbox, 'background-color', this.bgColor);
      this.renderer.setStyle(this.checkbox, 'border-color', this.bgColor);
      this.renderer.setStyle(this.avatar, 'background-color', this.bgColor);
      this.cdr.markForCheck();
    }
  }

  private updateBackgroundColor(): void {

  }
}
