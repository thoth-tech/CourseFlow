import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscoveryFacultyBasedMapComponent } from './discovery-faculty-based-map.component';

describe('DiscoveryFacultyBasedMapComponent', () => {
  let component: DiscoveryFacultyBasedMapComponent;
  let fixture: ComponentFixture<DiscoveryFacultyBasedMapComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DiscoveryFacultyBasedMapComponent]
    });
    fixture = TestBed.createComponent(DiscoveryFacultyBasedMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
