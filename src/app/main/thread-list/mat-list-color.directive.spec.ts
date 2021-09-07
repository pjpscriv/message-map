import { MatListColorDirective } from './mat-list-color.directive';
import {ChangeDetectorRef, ElementRef, Renderer2} from '@angular/core';
import {TestBed} from '@angular/core/testing';

describe('MatListColorDirective', () => {
  const renderer: Renderer2 = TestBed.inject(Renderer2);
  const el: ElementRef = TestBed.inject(ElementRef);
  const cdr: ChangeDetectorRef = TestBed.inject(ChangeDetectorRef);
  it('should create an instance', () => {
    const directive = new MatListColorDirective(renderer, el, cdr);
    expect(directive).toBeTruthy();
  });
});
