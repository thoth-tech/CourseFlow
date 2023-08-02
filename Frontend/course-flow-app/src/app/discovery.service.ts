import { Injectable } from '@angular/core';
import { DiscoveryNodeData, DiscoveryLinkData, DiscoveryColorData} from './discoveryInterfaces';
import { discoveryNodesForceDirectedData, discoveryLinksForceDirectedData } from './discoveryForceDirectedData';
import { discoveryNodesClusterData } from './discoveryClusterData';


@Injectable({
  providedIn: 'root'
})
export class DiscoveryService {

  discoveryColorMapping : DiscoveryColorData = {
    0: "#1d192b",
    1: "#484458",
    2: "#e8def8",
  }

  constructor() { }

  getAllDiscoveryForceDirectedNodeData(): DiscoveryNodeData[] {
    return discoveryNodesForceDirectedData;
  }
  
  getAllDiscoveryForceDirectedLinkData(): DiscoveryLinkData[] {
    return discoveryLinksForceDirectedData;
  }

  getDiscoveryColorMapping(): DiscoveryColorData {
    return this.discoveryColorMapping;
  }

  getAllDiscoveryClusterNodeData(): DiscoveryNodeData[] {
    return discoveryNodesClusterData;
  }
}
