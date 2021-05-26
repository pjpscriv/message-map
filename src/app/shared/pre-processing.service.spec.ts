import { TestBed } from '@angular/core/testing';

import { PreProcessingService } from './pre-processing.service';

describe('PreProcessingService', () => {
  let service: PreProcessingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PreProcessingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
