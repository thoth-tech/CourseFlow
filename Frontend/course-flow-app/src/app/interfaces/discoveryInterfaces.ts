export interface IDiscoveryTreeData {
    name: string,
    children: IDiscoveryTreeData[]
}

export interface IDiscoveryData {
    facultyNodes: IDiscoveryNodeData[],
    disciplineNodes: IDiscoveryDisciplineData,
    unitNodes: IDiscoveryUnitData
}

export interface IDiscoveryDisciplineData {
    [key: string]: IDiscoveryNodeData[]
}

export interface IDiscoveryUnitData {
    [key: string]: IDiscoveryNodeData[]
}

export interface IDiscoveryNodeData extends d3.SimulationNodeDatum {
    id: string;
    name: string;
    group: number;
    nodeLabelType: string;
    description: string;
}

export interface IDiscoveryLinkData extends d3.SimulationLinkDatum<d3.SimulationNodeDatum>{
    source: string | number | IDiscoveryNodeData;
    target: string | number | IDiscoveryNodeData;
    lineLabelType: string;
    distance: number;
}

export interface IDiscoveryColorData {
    [key: number]: string;
}

export interface ILabelProperties {
    x: number;
    y: number;
    fontSize: string;
  }

export interface IMapProperties {
    
    windowSizePropertiesSizes: IWindowSizePropertiesSizes;
    maxZoomOutAmount: number;
    maxZoomInAmount: number;
    canvasColor: string;
    canvasBorderRadius: string;
    lineOpacity: number;
}

export interface IWindowSizePropertiesSizes {

    [key: string]: IWindowSizeProperties;
}

export interface IWindowSizeProperties {
    canvasWidth: number;
    canvasHeight: number;
    nodeDistance: number;
    clusterForce: number;
    fieldNodeRadius: number;
    specializationNodeRadius: number;
    unitNodeRadius: number;
    unitLabelProperties: ILabelProperties,
    specializationLabelProperties: ILabelProperties,
    fieldLabelProperties: ILabelProperties
}
  
