import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YearContainerComponent } from './year-container.component';

describe('YearContainerComponent', () => {
  let component: YearContainerComponent;
  let fixture: ComponentFixture<YearContainerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [YearContainerComponent]
    });
    fixture = TestBed.createComponent(YearContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
