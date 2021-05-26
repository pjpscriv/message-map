import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DateDensityComponent } from './date-density.component';

describe('DateDensityComponent', () => {
  let component: DateDensityComponent;
  let fixture: ComponentFixture<DateDensityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DateDensityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DateDensityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
