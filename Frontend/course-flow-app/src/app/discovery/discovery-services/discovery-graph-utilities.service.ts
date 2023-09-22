// Angular Imports
import { Injectable } from '@angular/core';

// Interface Imports
import { IDiscoveryGraphProperties, IDiscoveryGraphUtilitiesService, IDiscoveryHierarchicalData } from 'src/app/interfaces/discoveryInterfaces';

// Json containing graph properties
import  * as graphData from "src/data/mainGraphProperties.json"

// Third-Party Imports
import * as d3 from "d3";

@Injectable({
  providedIn: 'root'
})
export class DiscoveryGraphUtilitiesService implements IDiscoveryGraphUtilitiesService{

  // Fixed/constant graph properties
  baseDiscoveryGraphProperties: IDiscoveryGraphProperties;

  // Generated colors based on the hierarchical depth.
  colors: (t: number) => string;
  

  /**
   * Constructor called on instantiation.
   */
  constructor() { 

    // Set the base graph properties from the json.
    this.baseDiscoveryGraphProperties = graphData as IDiscoveryGraphProperties;

    // Set the interpolated color range
    this.colors =  d3.interpolateRgbBasis(["blue", "red", "green"])
  }

  /**
   * Get graph properties.
   * @returns Graph properties with base values.
   */
  getGraphBaseProperties(): IDiscoveryGraphProperties {
   
    return this.baseDiscoveryGraphProperties;
  }

  /**
   * TODO The idea for this method is to scale the zoom by the nodes we are currently viewing compared to the original/base node number.
   * @param currentNodes Current nodes being used in the simulation.
   * @param originalNodes Original nodes of the base graph.
   * @returns An initial zoom value.
   */
  calculateInitialZoom(currentNodes: any, originalNodes: any): number {

    let zoom = 0;

    // TODO Need to have an actual proper calculation for this - I chose 200 based on visuals of the graph while testing.
    let initialZoomAmount = this.baseDiscoveryGraphProperties.initialZoomScale / originalNodes.length;
    let currentZoomAmount = (1 / currentNodes.length) + initialZoomAmount;

    zoom = originalNodes.length === currentNodes.length ? initialZoomAmount : currentZoomAmount;

    return zoom;
  }

  /**
   * Calculates a force for a given node structure.
   * @param nodeData Node data that can be cast depending on the service used.
   * @returns Force strength.
   */
  calculateForceStrength(nodeData: any): number {
    
    let baseForce: number = this.baseDiscoveryGraphProperties.forceManyBodyStrength;

    // Cast the node structure to a d3.HierarchyNode<IDiscoveryHierarchicalData>.
    let nodes: d3.HierarchyNode<IDiscoveryHierarchicalData> = nodeData as d3.HierarchyNode<IDiscoveryHierarchicalData>;

    // Simple node tree height based calculation.
    let treeHeight: number = nodes.height;
    let currentForce: number = baseForce * treeHeight;

    // Return the current force.
    return currentForce;
  }

  /**
   * Calculates the link distance between nodes.
   * @param linkData Link data with source and target node.
   * @returns Link distance.
   */
  calculateLinkDistance(linkData: any): number {
  
    let baseDistance: number = this.baseDiscoveryGraphProperties.linkDistance;
    let currentDistance: number = baseDistance;

    // Cast to a d3.SimulationLinkDatum<d3.SimulationNodeDatum>
    let link: d3.HierarchyLink<IDiscoveryHierarchicalData>  = linkData as d3.HierarchyLink<IDiscoveryHierarchicalData>;

    // I want the nodes from depth 0 to 1 to have a large spread from the root node.
    let linkSource: d3.HierarchyNode<IDiscoveryHierarchicalData> = link.source as d3.HierarchyNode<IDiscoveryHierarchicalData>
    let linkTarget: d3.HierarchyNode<IDiscoveryHierarchicalData> = link.target as d3.HierarchyNode<IDiscoveryHierarchicalData>

    if (linkSource.depth === 0) {

      let linkSourceChildren: d3.HierarchyNode<IDiscoveryHierarchicalData>[]= linkSource.children as d3.HierarchyNode<IDiscoveryHierarchicalData>[];
      let linkTargetChildren: d3.HierarchyNode<IDiscoveryHierarchicalData>[]= linkTarget.children as d3.HierarchyNode<IDiscoveryHierarchicalData>[];

      if (linkSourceChildren && linkTargetChildren) {
        
        currentDistance = currentDistance * linkSourceChildren.length;
        currentDistance = currentDistance / linkTargetChildren.length;
      }

    }

    return currentDistance;
  }

  /**
   * Calculates the link strength between nodes..
   * @param linkData Link data with source and target node.
   * @returns Link strength.
   */
  calculateLinkStrengthDistance(linkData: any): number {

    return this.baseDiscoveryGraphProperties.linkStrength;
  }
 
  /**
   * Calculate link colors for the links in the graph.
   * @param linkData Link data with source and target node.
   */
  calculateLinkColor(linkData: any): string {
    
    return this.baseDiscoveryGraphProperties.linkColor;
  }

  /**
   * Calculate the link stroke width for the links in the graph.
   * @param linkData Link data with source and target node.
   */
  calculateLinkStrokeWidth(linkData: any): number {
    
    return this.baseDiscoveryGraphProperties.linkWidth;
  }

  /**
   * Calculate link opacity for the links in the graph.
   * @param linkData Link data with source and target node.
   */
  calculateLinkOpacity(linkData: any): number {
    
    let linkDataAsHierarchyLink: d3.HierarchyLink<IDiscoveryHierarchicalData> = linkData as d3.HierarchyLink<IDiscoveryHierarchicalData>

    // TODO The way I am doing this calculaton is pretty bad and can be improved. The idea is to lower the opacity of lines as we go deeper into the tree.
    let opacityInterpolation: (t: number) => number = d3.interpolate(0.2, this.baseDiscoveryGraphProperties.linkOpacity);
    let heightNormalized = (1 / linkDataAsHierarchyLink.source.height); // I am pretty sure this isn't the proper way to normalize a value between 0 - 1 but just needed something simple.
    let alphaValue = heightNormalized !== 1 ? 1 - heightNormalized  : 0;

    console.log(alphaValue)

    return opacityInterpolation(alphaValue);
  }

  /**
   * Calculate the node radius.
   * @param nodeData Node data of all nodes used for the circle.
   */
  calculateNodeRadius(nodeData: any): number {
    
    let nodeDataAsHierarchicalData: d3.HierarchyNode<IDiscoveryHierarchicalData> = nodeData as d3.HierarchyNode<IDiscoveryHierarchicalData>

    return (this.baseDiscoveryGraphProperties.nodeRadius * nodeDataAsHierarchicalData.height) + this.baseDiscoveryGraphProperties.nodeRadius;
  }

  /**
   * Calculate node color.
   * @param nodeData  Node data of all nodes used for the circle.
   */
  calculateNodeColor(nodeData: any): string {
    
    let nodeDataAsHierarchicalData: d3.HierarchyNode<IDiscoveryHierarchicalData> = nodeData as d3.HierarchyNode<IDiscoveryHierarchicalData>

    let colorFactor: number  = nodeDataAsHierarchicalData.height !== 0 ?  1 / nodeDataAsHierarchicalData.height : 0;

    return this.colors(colorFactor);
  }

  /**
   * Caclualte text x offset for the text.
   * @param nodeData Node data of all nodes used for the circle.
   */
  calculateTextXOffset(nodeData: any): number {
    
    let nodeDataAsHierarchicalData: d3.HierarchyNode<IDiscoveryHierarchicalData> = nodeData as d3.HierarchyNode<IDiscoveryHierarchicalData>

    return (this.baseDiscoveryGraphProperties.textXOffset * nodeDataAsHierarchicalData.height) + this.baseDiscoveryGraphProperties.textXOffset;
  }

  /**
   * Calculate text y offset for the text.
   * @param nodeData Node data of all nodes used for the circle.
   */
  calculateTextYOffset(nodeData: any): number {
    
    let nodeDataAsHierarchicalData: d3.HierarchyNode<IDiscoveryHierarchicalData> = nodeData as d3.HierarchyNode<IDiscoveryHierarchicalData>

    return (this.baseDiscoveryGraphProperties.textYOffset * nodeDataAsHierarchicalData.height) + this.baseDiscoveryGraphProperties.textYOffset;
  }

  /**
   * Calculate text font size.
   * @param nodeData Node data of all nodes used for the circle.
   */
  calculateTextFontSize(nodeData: any): number {
    
    let nodeDataAsHierarchicalData: d3.HierarchyNode<IDiscoveryHierarchicalData> = nodeData as d3.HierarchyNode<IDiscoveryHierarchicalData>

    return (this.baseDiscoveryGraphProperties.textFontSize * nodeDataAsHierarchicalData.height) + this.baseDiscoveryGraphProperties.textFontSize;
  }

  /**
   * Calculate text font weight (how much bold we want).
   * @param nodeData Node data of all nodes used for the circle.
   */
  calculateTextFontWeight(nodeData: any): number {
    
    return this.baseDiscoveryGraphProperties.textFontWieight;
  }

}
