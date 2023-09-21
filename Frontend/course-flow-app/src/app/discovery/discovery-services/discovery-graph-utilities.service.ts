// Angular Imports
import { Injectable } from '@angular/core';

// Interface Imports
import { IDiscoveryGraphProperties, IDiscoveryGraphUtilitiesService, IDiscoveryHierarchicalData } from 'src/app/interfaces/discoveryInterfaces';

// Json containing graph properties
import  * as graphData from "src/data/mainGraphProperties.json"

@Injectable({
  providedIn: 'root'
})
export class DiscoveryGraphUtilitiesService implements IDiscoveryGraphUtilitiesService{

  constructor() { 

  }

  getGraphBaseProperties(): IDiscoveryGraphProperties {
    throw new Error('Method not implemented.');
  }
  calculateInitialZoom(currentNodes: any, originalNodes: any): number {
    throw new Error('Method not implemented.');
  }
  calculateForceStrength(nodeData: any): number {
    throw new Error('Method not implemented.');
  }
  calculateLinkDistance(linkData: any): number {
    throw new Error('Method not implemented.');
  }
  calculateLinkStrengthDistance(linkData: any): number {
    throw new Error('Method not implemented.');
  }
  calculateLinkColor(linkData: any): string {
    throw new Error('Method not implemented.');
  }
  calculateLinkStrokeWidth(linkData: any): number {
    throw new Error('Method not implemented.');
  }
  calculateLinkOpacity(linkData: any): number {
    throw new Error('Method not implemented.');
  }
  calculateNodeRadius(nodeData: any): number {
    throw new Error('Method not implemented.');
  }
  calculateNodeColor(nodeData: any): string {
    throw new Error('Method not implemented.');
  }
  calculateTextXOffset(nodeData: any): number {
    throw new Error('Method not implemented.');
  }
  calculateTextYOffset(nodeData: any): number {
    throw new Error('Method not implemented.');
  }
  calculateTextFontSize(nodeData: any): number {
    throw new Error('Method not implemented.');
  }
  calculateTextFontWeight(nodeData: any): number {
    throw new Error('Method not implemented.');
  }
}
