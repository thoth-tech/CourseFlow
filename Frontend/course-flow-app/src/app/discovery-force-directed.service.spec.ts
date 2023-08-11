import { TestBed } from '@angular/core/testing';

import { DiscoveryForceDirectedService } from './discovery-force-directed.service';

describe('DiscoveryForceDirectedService', () => {
  let service: DiscoveryForceDirectedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DiscoveryForceDirectedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
