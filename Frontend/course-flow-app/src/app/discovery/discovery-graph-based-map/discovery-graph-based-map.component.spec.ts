import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscoveryFacultyBasedMapComponent as DiscoveryGraphBasedMapComponent } from './discovery-graph-based-map.component';

describe('DiscoveryGraphBasedMapComponent', () => {
  let component: DiscoveryGraphBasedMapComponent;
  let fixture: ComponentFixture<DiscoveryGraphBasedMapComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DiscoveryGraphBasedMapComponent]
    });
    fixture = TestBed.createComponent(DiscoveryGraphBasedMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
