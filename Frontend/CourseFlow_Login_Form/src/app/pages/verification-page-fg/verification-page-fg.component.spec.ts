import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerificationPageFGComponent } from './verification-page-fg.component';

describe('VerificationPageFGComponent', () => {
  let component: VerificationPageFGComponent;
  let fixture: ComponentFixture<VerificationPageFGComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VerificationPageFGComponent]
    });
    fixture = TestBed.createComponent(VerificationPageFGComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
