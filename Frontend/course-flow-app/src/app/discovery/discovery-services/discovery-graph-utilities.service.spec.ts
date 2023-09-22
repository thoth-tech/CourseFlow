import { TestBed } from '@angular/core/testing';

import { DiscoveryGraphUtilitiesService } from './discovery-graph-utilities.service';

describe('DiscoveryGraphUtilitiesService', () => {
  let service: DiscoveryGraphUtilitiesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DiscoveryGraphUtilitiesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
