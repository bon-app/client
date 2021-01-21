import { TestBed } from '@angular/core/testing';

import { RimsService } from './rims.service';

describe('RimService', () => {
  let service: RimsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RimsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
