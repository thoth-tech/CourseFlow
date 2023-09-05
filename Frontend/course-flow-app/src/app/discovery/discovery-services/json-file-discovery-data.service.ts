// Angular Imports
import { Injectable } from '@angular/core';

// Enum Imports
import { EDiscoveryGroupUnitsBy } from 'src/app/enum/discoveryEnums';

// Interface Imports
import { IDiscoveryDataService, IDiscoveryData, IDiscoveryNodeData } from 'src/app/interfaces/discoveryInterfaces';

// JSON Data Imports
import  * as facultyData from "src/data/facultyData.json";

@Injectable({
  providedIn: 'root'
})
export class JsonFileDiscoveryDataService implements IDiscoveryDataService {

  constructor() {}

  /**
   * Get discovery data which will consist of data for nodes and edges/links. 
   * @param groupUnitsByQuery Query parameter for grouping units.
   */
  getDiscoveryData(groupUnitsByQuery: EDiscoveryGroupUnitsBy): IDiscoveryData {
    
    let discoveryNodeData: IDiscoveryData = {} as IDiscoveryData;

    switch (groupUnitsByQuery) {

      case EDiscoveryGroupUnitsBy.faculty:
        
        discoveryNodeData.nodeData = facultyData as IDiscoveryNodeData[]
        break;
    
      default:

        break;
    }

    return discoveryNodeData
  }

}