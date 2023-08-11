// Angular Imports
import { Injectable } from '@angular/core';

// Interfaces
import { IDiscoveryNodeData, IMapProperties} from './interfaces/discoveryInterfaces';

// Data Handling
import { discoveryNodesClusterData } from './dataHandling/discoveryClusterMockData';
import { discoveryMapProperties } from './dataHandling/discoveryMapProperties';


@Injectable({
  providedIn: 'root'
})
export class DiscoveryClusterService {

  constructor() { }

  /**
   * Get discovery map properties as a single object.
   * @returns Discovery map properties.
   */
  getDiscoveryMapProperties(): IMapProperties {
    return discoveryMapProperties;
  }

  /**
  * Get all node data.
  * @returns All node data.
  */
  getAllDiscoveryNodeData(): IDiscoveryNodeData[] {
    return discoveryNodesClusterData;
  }
}
