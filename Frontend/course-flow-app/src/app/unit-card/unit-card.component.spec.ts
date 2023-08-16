import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitCardComponent } from './unit-card.component';

describe('UnitCardComponent', () => {
  let component: UnitCardComponent;
  let fixture: ComponentFixture<UnitCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UnitCardComponent]
    });
    fixture = TestBed.createComponent(UnitCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
