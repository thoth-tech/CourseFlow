import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscoveryClusterMapComponent } from './discovery-cluster-map.component';

describe('DiscoveryClusterMapComponent', () => {
  let component: DiscoveryClusterMapComponent;
  let fixture: ComponentFixture<DiscoveryClusterMapComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DiscoveryClusterMapComponent]
    });
    fixture = TestBed.createComponent(DiscoveryClusterMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
