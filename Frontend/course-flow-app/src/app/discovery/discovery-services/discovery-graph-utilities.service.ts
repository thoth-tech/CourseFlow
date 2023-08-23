// Angular Imports
import { Injectable } from '@angular/core';

// Interface Imports
import { IDiscoveryGraphProperties, IDiscoveryGraphUtilitiesService } from 'src/app/interfaces/discoveryInterfaces';

// Json containing graph properties
import  * as graphData from "src/data/mainGraphProperties.json"

@Injectable({
  providedIn: 'root'
})
export class DiscoveryGraphUtilitiesService implements IDiscoveryGraphUtilitiesService{

  constructor() { }

  /**
   * Get graph properties.
   */
  getGraphProperties(): IDiscoveryGraphProperties {
   
    let graphProperties: IDiscoveryGraphProperties = graphData;

    return graphProperties;
  }

  
}
