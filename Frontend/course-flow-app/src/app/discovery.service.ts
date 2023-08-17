// Angular Imports
import { Injectable } from '@angular/core';

// Data Type Imports
import { IDiscoveryHierarchicalData, IDiscoveryGraphProperties } from './interfaces/discoveryInterfaces';

// Data Handling Imports
import { getDiscoveryUnitData } from './dataHandling/discoveryUnitJsonDataHandler';
import { getGraphProperties } from './dataHandling/discoveryGraphPropertiesDataHandler';

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

  /**
   * Get graph properties.
   * @returns Graph properties.
   */
  getGraphProperties(): IDiscoveryGraphProperties {

    return getGraphProperties;
  }
}
