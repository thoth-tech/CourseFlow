// Angular Imports
import { Injectable } from '@angular/core';

// Interfaces
import { IDiscoveryColorData, IMapProperties, IDiscoveryData} from './interfaces/discoveryInterfaces';

// Data Handling
import { discoveryMapProperties, discoveryForceDirectedColorMapping } from './dataHandling/discoveryMapProperties';
import { getDiscoveryData } from './dataHandling/discoveryForceDirectedJsonData_v2';

@Injectable({
  providedIn: 'root'
})
export class DiscoveryForceDirectedV2Service {

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
     * Get all discovery data.
     * @returns All discovery data.
    */
    getAllDiscoveryData(): IDiscoveryData {
      return getDiscoveryData;
    }
    
}
