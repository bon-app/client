import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ReceiptBuyPage } from './receipt-buy.page';

describe('ReceiptBuyPage', () => {
  let component: ReceiptBuyPage;
  let fixture: ComponentFixture<ReceiptBuyPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReceiptBuyPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ReceiptBuyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
