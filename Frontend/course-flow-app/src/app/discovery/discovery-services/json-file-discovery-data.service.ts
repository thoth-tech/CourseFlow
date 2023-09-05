// Angular Imports
import { Injectable } from '@angular/core';

// Enum Imports
import { EDiscoveryGroupUnitsBy } from 'src/app/enum/discoveryEnums';

// Interface Imports
import { IDiscoveryDataService, IDiscoveryData, IDiscoveryNodeData, IDiscoveryLinkData } from 'src/app/interfaces/discoveryInterfaces';

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
        
        // Add the nodes.
        discoveryNodeData.nodeData = facultyData as IDiscoveryNodeData[];

        // Figure out the links and add them.
        let linkData = [] as IDiscoveryLinkData[];

        for (let i = 0; i < discoveryNodeData.nodeData.length; i++) {

          let node = discoveryNodeData.nodeData[i];
          
          linkData.push({
            id: node.id + node.inConnections[0],
            source: node.inConnections[0],
            target: node.id
          })

          discoveryNodeData.linkData = linkData;
        }
        
        break;
    
      default:

        break;
    }

    return discoveryNodeData
  }

}