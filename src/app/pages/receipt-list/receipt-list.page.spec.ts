import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ReceiptListPage } from './receipt-list.page';

describe('ReceiptListPage', () => {
  let component: ReceiptListPage;
  let fixture: ComponentFixture<ReceiptListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReceiptListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ReceiptListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
