// Angular Imports
import { Injectable } from '@angular/core';

// Enum Imports
import { EDiscoveryGroupUnitsBy } from 'src/app/enum/discoveryEnums';

// Interface Imports
import { IDiscoveryDataService, IDiscoveryData, IDiscoveryNodeData, IDiscoveryLinkData } from 'src/app/interfaces/discoveryInterfaces';

// JSON Data Imports
import facultyData from "src/data/facultyData.json";

@Injectable({
  providedIn: 'root'
})
export class JsonFileDiscoveryDataService implements IDiscoveryDataService {

  // Json data
  discoveryJsonData: Record<EDiscoveryGroupUnitsBy, object> = {
    [EDiscoveryGroupUnitsBy.faculty]: facultyData,
    [EDiscoveryGroupUnitsBy.course]: facultyData,
    [EDiscoveryGroupUnitsBy.related_units]: facultyData,
  };

  constructor() {

  }

  /**
   * Get discovery data which will consist of data for nodes and edges/links. 
   * @param groupUnitsByQuery Query parameter for grouping units.
   */
  getDiscoveryData(groupUnitsByQuery: EDiscoveryGroupUnitsBy): IDiscoveryData {
    
    let discoveryData = {} as IDiscoveryData;

    this.processNodes(discoveryData);
    this.processLinks(discoveryData);

    return discoveryData
  }

  /**
   * Process data and add in nodes.
   * @param discoveryData Discovery data containing data for nodes and links.
   */
  processNodes(discoveryData: IDiscoveryData) : void {
    
    discoveryData.nodeData = facultyData as IDiscoveryNodeData[];

  }

  /**
   * Process data and add in links/edges.
   * @param discoveryData Discovery data containing data for nodes and links.
   */
  processLinks(discoveryData: IDiscoveryData): void {

    let linkData = [] as IDiscoveryLinkData[];

    // Go through each node, check all connection arrays, and create the links.
    for (let i = 0; i < discoveryData.nodeData.length; i++) {

      let node = discoveryData.nodeData[i];

      this.addLinkUsingConnections(node, linkData, node.inConnections);
      this.addLinkUsingConnections(node, linkData, node.outConnections);
      this.addLinkUsingConnections(node, linkData, node.coConnections);
      this.addLinkUsingConnections(node, linkData, node.restrictedConnections);
    }

    discoveryData.linkData = linkData;
  }

  /**
   * Use the connections from the json data to create the links.
   * @param node Current node being processed.
   * @param linkData Link data array we are 
   * @param nodeConnectionArray Array of node ids which will be used to create the links.
   */
  addLinkUsingConnections(node: IDiscoveryNodeData, linkData: IDiscoveryLinkData[], nodeConnectionArray: string[]): void {

    for (let i = 0; i < nodeConnectionArray.length; i++) {
        
      // Since we can have connections going in and out from a node, we will likely come accross them multiple times.
      // Hence, we check the two possible id combinations to ensure we don't double up on links.
      // Link Ids will always be added from the current node id to the id within the connection array.
      let foundLink: IDiscoveryLinkData | undefined = linkData.find((link) => link.id === node.id + nodeConnectionArray[i] || link.id === nodeConnectionArray[i] + node.id);

      if (foundLink !== undefined) {
        continue;
      }

      linkData.push({
        id: node.id + nodeConnectionArray[i],
        source: node.id,
        target: nodeConnectionArray[i]
      })  
    }
  }
}