import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateCompatModule } from '../../shared/translate-compat.module';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestIonicModule } from '../../../testing/test-ionic.module';

import { IngredientsReceiptsComponent } from './ingredients-receipts.component';

describe('IngredientsReceiptsComponent', () => {
  let component: IngredientsReceiptsComponent;
  let fixture: ComponentFixture<IngredientsReceiptsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [ IngredientsReceiptsComponent ],
      imports: [TestIonicModule, CommonModule, FormsModule, TranslateCompatModule]
    }).compileComponents();

    fixture = TestBed.createComponent(IngredientsReceiptsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
