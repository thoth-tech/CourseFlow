// Angular Imports
import { InjectionToken } from '@angular/core'

// Enums
import { EDiscoveryGroupUnitsBy } from "src/app/enum/discoveryEnums"

/*******************************************************************************************************************************
 * Discovery Data Service Interfaces
 *******************************************************************************************************************************/

export const IDiscoveryDataServiceInjector = new InjectionToken<IDiscoveryDataService>("IDiscoveryDataService");

export interface IDiscoveryDataService {

    getDiscoveryHierarchicalData(groupUnitsByQuery: EDiscoveryGroupUnitsBy): IDiscoveryHierarchicalData;
}


/*******************************************************************************************************************************
 * Discovery Graph Utilities Service Interfaces
 *******************************************************************************************************************************/


export const IDiscoveryGraphUtilitiesServiceInjector = new InjectionToken<IDiscoveryGraphUtilitiesService>("IDiscoveryGraphUtilitiesService");

export interface IDiscoveryGraphUtilitiesService {
    
    getGraphBaseProperties(): IDiscoveryGraphProperties;
    calculateForceStrength(nodeStructure: any): number;
    calculateLinkDistance(linkStructure: any): number;
    calculateInitialZoom(currentNodes: any, originalNodes: any): number;
}


/*******************************************************************************************************************************
 * Discovery Hierarchical Data Types.
 *******************************************************************************************************************************/

export interface IDiscoveryHierarchicalData {
    id: string;
    name: string;
    description: string;
    group: string;
    children: IDiscoveryHierarchicalData[];
}

/*******************************************************************************************************************************
 * Graph Properties Data Types
 *******************************************************************************************************************************/

export interface IDiscoveryGraphProperties {
    width: number;
    height: number;
    canvasColor: string;
    canvasBorderRadius: string;
    iniitialCanvasTranslationOffsetX: number;
    iniitialCanvasTranslationOffsetY: number;
    initialZoomScale: number;
    forceManyBodyStrength: Record<string, number>;
    linkStrength: Record<string, number>;
    linkDistance: Record<string, number>;
    zoomLevelProperties: Record<string, IDiscoveryGraphZoomLevelProperties>;
}

export interface IDiscoveryGraphZoomLevelProperties {
    linkWidth: Record<string, number>;
    linkOpacity: Record<string, number>;
    nodeRadius: Record<string, number>;
    nodeColor: Record<string, string>;
    textColor: Record<string, string>;
    textFontSize: Record<string, number>;
    textFontWieight: Record<string, number>;
    textXOffset: Record<string, number>;
    textYOffset: Record<string, number>;
}

/*******************************************************************************************************************************
 * Discovery JSON Data Types.
 *******************************************************************************************************************************/

export interface IDiscoveryFacultyJsonUnitData {
    id: object;
    code: string;
    title: string;
    description: string;
    constraints: Array<IDiscoveryJsonUnitContraintData>;
}

export interface IDiscoveryJsonUnitContraintData {
    type: string;
    units: Array<string>;
}