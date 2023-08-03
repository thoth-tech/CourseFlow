// Angular Imports
import { Injectable } from '@angular/core';

// Interfaces
import { IDiscoveryNodeData, IDiscoveryLinkData, IDiscoveryColorData, IMapProperties} from './interfaces/discoveryInterfaces';

// Data Handling
import { forceDirectedMapProperties } from './data/discoveryMapProperties';
import { discoveryNodesForceDirectedData, discoveryLinksForceDirectedData, discoveryForceDirectedColorMapping } from './data/discoveryForceDirectedMockData';
import { discoveryNodesClusterData } from './data/discoveryClusterMockData';


@Injectable({
  providedIn: 'root'
})
export class DiscoveryService {

  constructor() { }

  /**
   * Get all force directed properties as a single object.
   * @returns Force directed map properties.
   */
  getForceDirectedMapProperties(): IMapProperties {
    return forceDirectedMapProperties;
  }

  /**
   * Get all force directed node data.
   * @returns Force directed node data.
   */
  getAllDiscoveryForceDirectedNodeData(): IDiscoveryNodeData[] {
    return discoveryNodesForceDirectedData;
  }
  
  /**
   * Get all force directed link data.
   * @returns Force directed link data.
   */
  getAllDiscoveryForceDirectedLinkData(): IDiscoveryLinkData[] {
    return discoveryLinksForceDirectedData;
  }

  /**
   * Get force directed color mapping data.
   * @returns Force directed color mapping data.
   */
  getDiscoveryForceDirectedColorMapping(): IDiscoveryColorData {
    return discoveryForceDirectedColorMapping;
  }

  /**
   * Get all cluster node data.
   * @returns Get cluster node data.
   */
  getAllDiscoveryClusterNodeData(): IDiscoveryNodeData[] {
    return discoveryNodesClusterData;
  }
}
