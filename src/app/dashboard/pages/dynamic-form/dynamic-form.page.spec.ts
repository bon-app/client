import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DynamicFormPage } from './dynamic-form.page';

describe('DynamicFormPage', () => {
  let component: DynamicFormPage;
  let fixture: ComponentFixture<DynamicFormPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DynamicFormPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DynamicFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
