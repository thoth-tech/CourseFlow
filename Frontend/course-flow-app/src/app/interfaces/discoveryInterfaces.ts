// Angular Imports
import { InjectionToken } from '@angular/core'

// Enums
import { EDiscoveryGroupUnitsBy } from "src/app/enum/discoveryEnums"

/*******************************************************************************************************************************
 * Discovery Data Service Interfaces
 *******************************************************************************************************************************/

export const IDiscoveryDataServiceInjector = new InjectionToken<IDiscoveryDataService>("IDiscoveryDataService");

export interface IDiscoveryDataService {

    getDiscoveryNodeData(groupUnitsByQuery: EDiscoveryGroupUnitsBy): IDiscoveryNodeData[];
}


/*******************************************************************************************************************************
 * Discovery Graph Utilities Service Interfaces
 *******************************************************************************************************************************/


export const IDiscoveryGraphUtilitiesServiceInjector = new InjectionToken<IDiscoveryGraphUtilitiesService>("IDiscoveryGraphUtilitiesService");

export interface IDiscoveryGraphUtilitiesService {
    
    getGraphBaseProperties(): IDiscoveryGraphProperties;
    calculateInitialZoom(currentNodes: any, originalNodes: any): number;

    // Force Sim Calculations
    calculateForceStrength(nodeData: any): number;
    calculateLinkDistance(linkData: any): number;
    calculateLinkStrengthDistance(linkData: any): number;

    // Link Property Calculations.
    calculateLinkColor(linkData: any): string;
    calculateLinkStrokeWidth(linkData: any): number;
    calculateLinkOpacity(linkData: any): number;

    // Node Property Calculations.
    calculateNodeRadius(nodeData: any) : number;
    calculateNodeColor(nodeData: any) : string;
    calculateTextXOffset(nodeData: any) : number;
    calculateTextYOffset(nodeData: any) : number;
    calculateTextFontSize(nodeData: any) : number;
    calculateTextFontWeight(nodeData: any) : number;
}


/*******************************************************************************************************************************
 * Discovery Data Types.
 *******************************************************************************************************************************/

export interface IDiscoveryNodeData {
    id: string,
    x: number,
    y: number,
    connections: string[],
    color: string
}

export interface IDiscoveryHierarchicalData {
    id: string;
    name: string;
    description: string;
    group: string;
    height: number;
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
    forceManyBodyStrength: number;
    linkStrength: number;
    linkDistance: number;
    linkColor: string;
    linkWidth: number;
    linkOpacity: number;
    nodeRadius: number;
    nodeColor: string;
    textColor: string;
    textFontSize: number;
    textFontWieight: number;
    textXOffset: number;
    textYOffset: number;
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