// Angular Imports
import { Injectable } from '@angular/core';

// Interfaces
import { IDiscoveryNodeData, IDiscoveryLinkData, IDiscoveryColorData, IMapProperties, IDiscoveryTreeData} from './interfaces/discoveryInterfaces';

// Data Handling
import { discoveryMapProperties, discoveryForceDirectedColorMapping } from './dataHandling/discoveryMapProperties';
import { discoveryNodesForceDirectedData, discoveryLinksForceDirectedData } from './dataHandling/discoveryForceDirectedJsonData';
import { getDiscoveryTreeData } from './dataHandling/discoveryForceDirectedJsonData_v3';

@Injectable({
  providedIn: 'root'
})
export class DiscoveryForceDirectedService {

  constructor() { }

  /**
   * Get discovery map properties as a single object.
   * @returns Discovery map properties.
   */
  getDiscoveryMapProperties(): IMapProperties {
    return discoveryMapProperties;
  }

  /**
   * Get all color mapping data.
   * @returns Color mapping data.
   */
  getDiscoveryColorMapping(): IDiscoveryColorData {
    return discoveryForceDirectedColorMapping;
  }

  /**
   * Get all node data.
   * @returns All node data.
  */
  getAllDiscoveryNodeData(): IDiscoveryNodeData[] {
    return discoveryNodesForceDirectedData;
  }
  
  /**
   * Get all link data.
   * @returns Link data.
   */
  getAllDiscoveryLinkData(): IDiscoveryLinkData[] {
    return discoveryLinksForceDirectedData;
  }

  getDiscoveryTreeData(): IDiscoveryTreeData {
    return getDiscoveryTreeData;
  }
}
