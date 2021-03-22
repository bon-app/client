import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DynamicListPage } from './dynamic-list.page';

describe('DynamicListPage', () => {
  let component: DynamicListPage;
  let fixture: ComponentFixture<DynamicListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DynamicListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DynamicListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
