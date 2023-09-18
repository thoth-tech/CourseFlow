import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MajorMinorComponent } from './majorminor.component';

describe('MajorMinorComponent', () => {
  let component: MajorMinorComponent;
  let fixture: ComponentFixture<MajorMinorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MajorMinorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MajorMinorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
