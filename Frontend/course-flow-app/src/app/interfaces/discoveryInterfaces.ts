// Angular Imports
import { InjectionToken, EventEmitter } from '@angular/core'

// Enums
import { EDiscoveryGroupUnitsBy } from "src/app/enum/discoveryEnums"

/*******************************************************************************************************************************
 * Discovery Data Service Interfaces
 *******************************************************************************************************************************/

export const IDiscoveryDataServiceInjector = new InjectionToken<IDiscoveryDataService>("IDiscoveryDataService");

export interface IDiscoveryDataService {

    // Observable.
    nodeSelectedEvent$: EventEmitter<IDiscoveryNodeData>;

    // Data Fetching.
    getDiscoveryData(groupUnitsByQuery: EDiscoveryGroupUnitsBy): IDiscoveryData;

    // Data Search.
    findDiscoveryNodeById(id: string): IDiscoveryNodeData | undefined;

    // Event Emitters
    onDetailedConnectionClicked(id: string): void;
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

export interface IDiscoveryData {
    
    nodeData: IDiscoveryNodeData[];
    linkData: IDiscoveryLinkData[];
}

export interface IDiscoveryNodeData {

    id: string;
    label: string;
    group: number;
    description: string;
    x: number | string;
    y: number | string;
    inConnections: IConnectionData[];
    outConnections: IConnectionData[];
    coConnections: IConnectionData[];
}

export interface IDiscoveryLinkData {
    id: string;
    source: string;
    target: string;
}

export interface IConnectionData {
    label: string;
    connectionIds: string[]
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