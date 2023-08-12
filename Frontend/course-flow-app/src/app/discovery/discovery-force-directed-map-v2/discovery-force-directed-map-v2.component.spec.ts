import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscoveryForceDirectedMapV2Component } from './discovery-force-directed-map-v2.component';

describe('DiscoveryForceDirectedMapV2Component', () => {
  let component: DiscoveryForceDirectedMapV2Component;
  let fixture: ComponentFixture<DiscoveryForceDirectedMapV2Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DiscoveryForceDirectedMapV2Component]
    });
    fixture = TestBed.createComponent(DiscoveryForceDirectedMapV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
