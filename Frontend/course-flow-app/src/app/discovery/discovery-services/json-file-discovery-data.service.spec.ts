import { TestBed } from '@angular/core/testing';

import { JsonFileDiscoveryDataService } from './json-file-discovery-data.service';

describe('JsonFileDiscoveryDataServiceService', () => {
  let service: JsonFileDiscoveryDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JsonFileDiscoveryDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
