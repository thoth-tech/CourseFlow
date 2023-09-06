import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitcardContainerComponent } from './unitcard-container.component';

describe('UnitcardContainerComponent', () => {
  let component: UnitcardContainerComponent;
  let fixture: ComponentFixture<UnitcardContainerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UnitcardContainerComponent]
    });
    fixture = TestBed.createComponent(UnitcardContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
