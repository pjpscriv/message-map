import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeDensityComponent } from './time-density.component';

describe('TimeDensityComponent', () => {
  let component: TimeDensityComponent;
  let fixture: ComponentFixture<TimeDensityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimeDensityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeDensityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
