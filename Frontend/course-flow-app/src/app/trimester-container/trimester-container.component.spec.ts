import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrimesterContainerComponent } from './trimester-container.component';

describe('TrimesterContainerComponent', () => {
  let component: TrimesterContainerComponent;
  let fixture: ComponentFixture<TrimesterContainerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TrimesterContainerComponent]
    });
    fixture = TestBed.createComponent(TrimesterContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
