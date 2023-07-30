import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscoveryForceDirectedMapComponent } from './discovery-force-directed-map.component';

describe('DiscoveryForceDirectedMapComponent', () => {
  let component: DiscoveryForceDirectedMapComponent;
  let fixture: ComponentFixture<DiscoveryForceDirectedMapComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DiscoveryForceDirectedMapComponent]
    });
    fixture = TestBed.createComponent(DiscoveryForceDirectedMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
