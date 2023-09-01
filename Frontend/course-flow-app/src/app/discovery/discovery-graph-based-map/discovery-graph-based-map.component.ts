// Angular Imports
import { Component, Input, Inject } from '@angular/core';

// Interface Imports
import { IDiscoveryDataServiceInjector, IDiscoveryDataService, IDiscoveryHierarchicalData, IDiscoveryGraphProperties, IDiscoveryGraphUtilitiesService, IDiscoveryGraphUtilitiesServiceInjector } from 'src/app/interfaces/discoveryInterfaces';
import { Node, Edge } from "@swimlane/ngx-graph"

// Enum Imports
import { EDiscoveryGroupUnitsBy } from "../../enum/discoveryEnums"

interface NodeStack {
  currentNode: IDiscoveryHierarchicalData,
  parentNode: IDiscoveryHierarchicalData | null
}

@Component({
  selector: 'app-discovery-graph-based-map',
  templateUrl: './discovery-graph-based-map.component.html',
  styleUrls: ['./discovery-graph-based-map.component.css']
})
export class DiscoveryGraphBasedMapComponent {

  // Hierarchical data
  discoveryHierarchicalData: IDiscoveryHierarchicalData = {} as IDiscoveryHierarchicalData

  // Node data
  nodes: Node[] = []
  links: Edge[] = []

  // Graph render control
  displayGraph = false;

  /**
   * Constructor for the component.
   * @param discoveryDataService Injected discovery data service.
   */
  constructor(@Inject(IDiscoveryDataServiceInjector) private discoveryDataService: IDiscoveryDataService,
              @Inject(IDiscoveryGraphUtilitiesServiceInjector) private discoveryGraphUtilitiesService: IDiscoveryGraphUtilitiesService) {
  }

  /**
   * Input for group units by param.
   */
  @Input() set groupUnitsBy(value: EDiscoveryGroupUnitsBy) {

    this.discoveryHierarchicalData = this.discoveryDataService.getDiscoveryHierarchicalData(value);

    this.nodes = [];
    this.links = [];

    // Start the processing of hierarchical data.
    this.processHierarchicalData(this.discoveryHierarchicalData, true);
  }

  /**
   * Process the hierarchical data.
   * @param hierarchicalData hierarchical data.
   */
  processHierarchicalData(hierarchicalData: IDiscoveryHierarchicalData, addRootNode: boolean) {

    let currentNodes: Node[] = []
    let currentLinks: Edge[] = []

    let stack: NodeStack[] = [{
      currentNode: hierarchicalData,
      parentNode: null
    }];
    
    // Keep looping while we have items in the stack.
    while (stack.length !== 0) {
      
      // Get the last NodeStack object and cast to NodeStack to remove TypeScript errors.
      let nodeStack: NodeStack = stack.pop() as NodeStack;

      // Add the node to the node array
      currentNodes.push({
        id: nodeStack.currentNode.id,
        label: nodeStack.currentNode.name
      })

      // If this has a parent node, create a link.
      if (nodeStack.parentNode !== null) {

        currentLinks.push({
          id: nodeStack.parentNode.id + nodeStack.currentNode.id,
          source: nodeStack.parentNode.id,
          target: nodeStack.currentNode.id
        })
      }

      // If there are children nodes, add them to the stack
      let nodeChildren = nodeStack.currentNode.children

      if (nodeChildren.length !== 0) {

        for (let i = 0; i < nodeChildren.length; i++) {
          
          let node = nodeChildren[i];

          stack.push({
            currentNode: node,
            parentNode: nodeStack.currentNode
          })
          
        }
      }
    }

    // Add the local nodes and links to the class scoped variables.
    this.nodes = currentNodes;
    this.links = currentLinks;

    // Turn on the graph once loaded.
    this.displayGraph = true;
  }

  onNodeClicked(event: any): void {

    console.log(event)
  }
}