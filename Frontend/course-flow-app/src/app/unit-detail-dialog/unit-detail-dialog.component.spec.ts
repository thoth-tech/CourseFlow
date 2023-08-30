import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitDetailDialogComponent } from './unit-detail-dialog.component';

describe('UnitDetailDialogComponent', () => {
  let component: UnitDetailDialogComponent;
  let fixture: ComponentFixture<UnitDetailDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UnitDetailDialogComponent]
    });
    fixture = TestBed.createComponent(UnitDetailDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
