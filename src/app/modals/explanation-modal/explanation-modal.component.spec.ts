import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExplanationModalComponent } from './explanation-modal.component';

describe('ExplanationModalComponent', () => {
  let component: ExplanationModalComponent;
  let fixture: ComponentFixture<ExplanationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExplanationModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExplanationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
