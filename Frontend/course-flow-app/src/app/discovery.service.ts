// Angular Imports
import { Injectable } from '@angular/core';

// Data Type Imports
import { IDiscoveryHierarchicalData } from './interfaces/discoveryInterfaces';

// Data Handling Imports
import { getDiscoveryUnitData } from './dataHandling/discoveryUnitJsonDataHandler';

@Injectable({
  providedIn: 'root'
})
export class DiscoveryService {

  constructor() { }

  /**
   * Get all unit data.
   * @returns All unit data.
   */
  getDiscoveryUnitData(): IDiscoveryHierarchicalData {
    
    return getDiscoveryUnitData;
  }
}
