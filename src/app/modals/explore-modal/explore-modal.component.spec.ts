import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExploreModalComponent } from './explore-modal.component';

describe('ExploreModalComponent', () => {
  let component: ExploreModalComponent;
  let fixture: ComponentFixture<ExploreModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExploreModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExploreModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
