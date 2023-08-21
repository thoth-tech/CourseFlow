// Angular Imports
import { Injectable } from '@angular/core';

// Data Type Imports
import { IDiscoveryHierarchicalData, IDiscoveryGraphProperties } from './interfaces/discoveryInterfaces';

// Enums
import { EDiscoveryGroupUnitsBy } from "./enum/discoveryEnums"

// Data Handling Imports
import { getFacultyDiscoveryUnitData, getDetailedFacultyUnitData } from './dataHandling/discoveryFacultyJsonDataHandler';
import { getCourseDiscoveryUnitData, getDetailedCourseUnitData } from './dataHandling/discoveryCourseJsonDataHandler';
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
  getAllDiscoveryUnitData(groupUnitsByQuery: EDiscoveryGroupUnitsBy): IDiscoveryHierarchicalData {
    
    // TODO Swap out when connected with backend.
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

    return data();
  }

  /**
   * Get a detailed version of the unit by id. 
   * Query will allow for different unit information based on the group by query - this will likely be removed once the backend is connected as the unit data should be the same accross everything, regardless of grouping technique.
   * TODO Remove group units by query param once backend is connected as we should have a standardized collection of units with the same type of information.
   * @param id Id of the unit.
   * @param groupUnitsByQuery Group by query.
   * @returns 
   */
  getDiscoveryUnitDataById(id: string, groupUnitsByQuery: EDiscoveryGroupUnitsBy): IDiscoveryHierarchicalData {
    
    // TODO Swap out when connected with backend.
    let data;

    switch (groupUnitsByQuery) {

      case EDiscoveryGroupUnitsBy.faculty:

        data = getDetailedCourseUnitData(id);
        break;
    
      case EDiscoveryGroupUnitsBy.course:

        data = getDetailedCourseUnitData(id);
        break;

      case EDiscoveryGroupUnitsBy.related_units:

        data = getDetailedCourseUnitData(id);
        break;

      default:

        data = getDetailedCourseUnitData(id);
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
