import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SuggestedProductsPage } from './suggested-products.page';

describe('SuggestedProductsPage', () => {
  let component: SuggestedProductsPage;
  let fixture: ComponentFixture<SuggestedProductsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuggestedProductsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SuggestedProductsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
