import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TestIonicModule } from '../../testing/test-ionic.module';
import { TranslateCompatModule } from '../shared/translate-compat.module';
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
