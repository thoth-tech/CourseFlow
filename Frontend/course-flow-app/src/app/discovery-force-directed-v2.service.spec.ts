import { TestBed } from '@angular/core/testing';

import { DiscoveryForceDirectedV2Service } from './discovery-force-directed-v2.service';

describe('DiscoveryForceDirectedV2Service', () => {
  let service: DiscoveryForceDirectedV2Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DiscoveryForceDirectedV2Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
