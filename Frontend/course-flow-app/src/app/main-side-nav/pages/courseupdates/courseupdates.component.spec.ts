import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseUpdatesComponent } from './courseupdates.component';

describe('CourseUpdatesComponent', () => {
  let component: CourseUpdatesComponent;
  let fixture: ComponentFixture<CourseUpdatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CourseUpdatesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseUpdatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
