// Angular Imports
import { Injectable } from '@angular/core';

// Data Type Imports
import { IDiscoveryHierarchicalData, IDiscoveryGraphProperties } from './interfaces/discoveryInterfaces';

import { EDiscoveryGroupUnitsBy } from "./enum/discoveryEnums"

// Data Handling Imports
import { getFacultyDiscoveryUnitData } from './dataHandling/discoveryFacultyJsonDataHandler';
import { getCourseDiscoveryUnitData } from './dataHandling/discoveryCourseJsonDataHandler';
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
  getDiscoveryUnitData(groupUnitsByQuery: EDiscoveryGroupUnitsBy): IDiscoveryHierarchicalData {
    
    let data = getFacultyDiscoveryUnitData;

    switch (groupUnitsByQuery) {

      case EDiscoveryGroupUnitsBy.faculty:

        data = getFacultyDiscoveryUnitData;
        break;
    
      case EDiscoveryGroupUnitsBy.course:

        data = getCourseDiscoveryUnitData;
        break;

      case EDiscoveryGroupUnitsBy.related_units:

        data = getFacultyDiscoveryUnitData;
        break;

      default:

        data = getFacultyDiscoveryUnitData;
        break;
    }

    return data;
  }

  /**
   * Get graph properties.
   * @returns Graph properties.
   */
  getGraphProperties(): IDiscoveryGraphProperties {

    return getGraphProperties;
  }
}
