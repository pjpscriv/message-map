import {AfterViewInit, ChangeDetectorRef, Directive, ElementRef, Input, OnChanges, Renderer2, SimpleChanges} from '@angular/core';

@Directive({
  selector: '[appOptionColor]'
})
export class MatListColorDirective implements AfterViewInit, OnChanges {
  // @ts-ignore
  @Input('appOptionColor') bgColor?: string;
  @Input('refreshColor') selectedIds?: any;
  @Input('colorId') colorId?: string;
  // @ts-ignore
  private checkbox: HTMLElement;
  // @ts-ignore
  private avatar: HTMLElement;
  private checked = true;

  constructor(
    private renderer: Renderer2,
    private el: ElementRef,
    private cdr: ChangeDetectorRef
  ) {}

  public ngAfterViewInit(): void {
    this.checkbox = this.el.nativeElement.querySelector('.mat-pseudo-checkbox');
    this.avatar = this.el.nativeElement.querySelector('.mat-list-avatar');
  }

  public ngOnChanges(changes: SimpleChanges): void {
    const { bgColor, selectedIds } = changes;

    if (selectedIds?.currentValue) {
      this.checked = selectedIds.currentValue.has(this.colorId);
    }

    if (this.checkbox && this.avatar) {
      if (bgColor?.currentValue === 'clear') {
        this.renderer.removeStyle(this.avatar, 'background-color');
        this.renderer.removeStyle(this.checkbox, 'background-color');
        this.renderer.removeStyle(this.checkbox, 'border-color');

      } else if (bgColor || selectedIds) {
        this.renderer.setStyle(this.avatar, 'background-color', this.bgColor);
        this.renderer.setStyle(this.checkbox, 'border-color', this.bgColor);
        if (this.checked) {
          this.renderer.setStyle(this.checkbox, 'background-color', this.bgColor);
        } else {
          this.renderer.removeStyle(this.checkbox, 'background-color');
        }
        this.cdr.markForCheck();
      }
    }
  }
}
