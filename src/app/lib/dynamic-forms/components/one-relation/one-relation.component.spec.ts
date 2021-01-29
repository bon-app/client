import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OneRelationComponent } from './one-relation.component';

describe('OneRelationComponent', () => {
  let component: OneRelationComponent;
  let fixture: ComponentFixture<OneRelationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OneRelationComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OneRelationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
