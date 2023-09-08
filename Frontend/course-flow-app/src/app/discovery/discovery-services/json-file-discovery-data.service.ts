// Angular Imports
import { EventEmitter, Injectable, Output } from '@angular/core';

// Enum Imports
import { EDiscoveryGroupUnitsBy } from 'src/app/enum/discoveryEnums';

// Interface Imports
import { IDiscoveryDataService, IDiscoveryData, IDiscoveryNodeData, IDiscoveryLinkData, IConnectionData } from 'src/app/interfaces/discoveryInterfaces';

// JSON Data Imports
import facultyData from "src/data/facultyData.json";

@Injectable({
  providedIn: 'root'
})
export class JsonFileDiscoveryDataService implements IDiscoveryDataService {

  // Observables.
  @Output() nodeSelectedEvent$: EventEmitter<IDiscoveryNodeData> = new EventEmitter();

  // Json data.
  discoveryJsonData: Record<EDiscoveryGroupUnitsBy, object> = {
    [EDiscoveryGroupUnitsBy.faculty]: facultyData,
    [EDiscoveryGroupUnitsBy.course]: facultyData,
    [EDiscoveryGroupUnitsBy.related_units]: facultyData,
  };

  // Discovery data cache.
  discoveryData = {} as IDiscoveryData;

  constructor() {

  }

  /**
   * Get discovery data which will consist of data for nodes and edges/links. 
   * @param groupUnitsByQuery Query parameter for grouping units.
   */
  getDiscoveryData(groupUnitsByQuery: EDiscoveryGroupUnitsBy): IDiscoveryData {
    
    this.processNodes(this.discoveryData);
    this.processLinks(this.discoveryData);

    return this.discoveryData
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
    }

    discoveryData.linkData = linkData;
  }

  /**
   * Use the connections from the json data to create the links.
   * @param node Current node being processed.
   * @param linkData Link data array we are 
   * @param nodeConnectionArray Array of node ids which will be used to create the links.
   */
  addLinkUsingConnections(node: IDiscoveryNodeData, linkData: IDiscoveryLinkData[], nodeConnectionArray: IConnectionData[]): void {

    // Each node connection array contains an object of type IConnectionData.
    // Within these contain groups on different types of links.
    // The following loops are essentially processing all of these and creating links only if the link id doesn't exist (two combo of link ids will be checked).
    nodeConnectionArray.forEach((connectionData) => {

      let connectionIds = connectionData.connectionIds;

      for (let i = 0; i < connectionIds.length; i++) {

        let foundLink: IDiscoveryLinkData | undefined = linkData.find((link) => link.id === node.id + connectionIds[i] || link.id === connectionIds[i] + node.id);

        if (foundLink !== undefined) {
          continue;
        }

        linkData.push({
          id: node.id + nodeConnectionArray[i],
          source: node.id,
          target: connectionIds[i]
        }) 
      }
    })
  }

  /**
   * Searches the discovery node data for a node based on the id.
   * @param id Id of node data.
   */
  findDiscoveryNodeById(id: string): IDiscoveryNodeData | undefined {

    let foundNode = {} as IDiscoveryNodeData | undefined;

    if (this.discoveryData) {

      foundNode = this.discoveryData.nodeData.find((nodeData) => nodeData.id === id)
      
    }

    return foundNode;
  }

  /**
   * Intended to be used as a messaging method for deep nested components that display connections of the nodes.
   * @param id Id of the node which originates from a list of connection.
   */
  onDetailedConnectionClicked(id: string): void {

    let selectedNode = {} as IDiscoveryNodeData | undefined;

    if (this.discoveryData) {

      selectedNode = this.discoveryData.nodeData.find((nodeData) => nodeData.id === id)
      
    }

    this.nodeSelectedEvent$.emit(selectedNode);
  }
}