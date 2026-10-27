import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateCompatModule } from '../../../../shared/translate-compat.module';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestIonicModule } from '../../../../../testing/test-ionic.module';

import { DefaultFilterComponent } from './default-filter.component';

describe('DefaultFilterComponent', () => {
  let component: DefaultFilterComponent;
  let fixture: ComponentFixture<DefaultFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [ DefaultFilterComponent ],
      imports: [TestIonicModule, CommonModule, FormsModule, TranslateCompatModule]
    }).compileComponents();

    fixture = TestBed.createComponent(DefaultFilterComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
