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

  constructor() { }

  /**
   * Get graph properties.
   */
  getGraphBaseProperties(): IDiscoveryGraphProperties {
   
    let graphProperties: IDiscoveryGraphProperties = graphData;

    return graphProperties;
  }

  /**
   * Calculates a force for a given node structure.
   * @param nodeStructure Node structure that can be cast depending on the service used.
   */
  calculateForceStrength(nodeStructure: any): number {
    
    let baseForce: number = -100;

    // Cast the node structure to a d3.HierarchyNode<IDiscoveryHierarchicalData>.
    let nodes: d3.HierarchyNode<IDiscoveryHierarchicalData> = nodeStructure as d3.HierarchyNode<IDiscoveryHierarchicalData>;

    // Simple node tree height based calculation.
    let treeHeight: number = nodes.height;
    let currentForce: number = baseForce * treeHeight;

    // Return the current force.
    return currentForce;
  }

  /**
   * Calculates the link distance for a given link structure.
   * @param linkStructure Link structure that can be cast depending on the service used.
   */
  calculateLinkDistance(linkStructure: any): number {
  
    let baseDistance: number = 100;
    let currentDistance: number = baseDistance;

    // Cast to a d3.SimulationLinkDatum<d3.SimulationNodeDatum>
    let link: d3.HierarchyLink<IDiscoveryHierarchicalData>  = linkStructure as d3.HierarchyLink<IDiscoveryHierarchicalData>;

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
   * TODO The idea for this method is to scale the zoom by the nodes we are currently viewing compared to the original/base node number.
   * @param currentNodes Current nodes being used in the simulation.
   * @param originalNodes Original nodes of the base graph.
   * @returns An initial zoom value.
   */
  calculateInitialZoom(currentNodes: any, originalNodes: any): number {

    let zoom = 1;

    // TODO Need to have an actual proper calculation for this - I chose 200 based on visuals of the graph while testing.
    let initialZoomAmount = 250 / originalNodes.length;
    let currentZoomAmount = (1 / currentNodes.length) + initialZoomAmount;

    zoom = originalNodes.length === currentNodes.length ? initialZoomAmount : currentZoomAmount;

    return zoom;
  }
}
