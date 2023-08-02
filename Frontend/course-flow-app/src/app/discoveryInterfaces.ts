export interface DiscoveryNodeData extends d3.SimulationNodeDatum {
    id: string;
    name: string;
    group: number;
    nodeLabelType: string;
}

export interface DiscoveryLinkData extends d3.SimulationLinkDatum<d3.SimulationNodeDatum>{
    source: string | number | DiscoveryNodeData;
    target: string | number | DiscoveryNodeData;
    lineLabelType: string;
    distance: number;
}

export interface DiscoveryColorData {
    [key: number]: string;
}
  
