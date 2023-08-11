import { TestBed } from '@angular/core/testing';

import { DiscoveryClusterService } from './discovery-cluster.service';

describe('DiscoveryClusterService', () => {
  let service: DiscoveryClusterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DiscoveryClusterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
