import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateCompatModule } from '../../../shared/translate-compat.module';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestIonicModule } from '../../../../testing/test-ionic.module';

import { DFIngredientsPriorityComponent } from './ingredients-priority.component';

describe('DFIngredientsPriorityComponent', () => {
  let component: DFIngredientsPriorityComponent;
  let fixture: ComponentFixture<DFIngredientsPriorityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [ DFIngredientsPriorityComponent ],
      imports: [TestIonicModule, CommonModule, FormsModule, TranslateCompatModule]
    }).compileComponents();

    fixture = TestBed.createComponent(DFIngredientsPriorityComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
