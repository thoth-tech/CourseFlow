// Angular Imports
import { Component, Input, Inject } from '@angular/core';

// Interface Imports
import { IDiscoveryDataServiceInjector, IDiscoveryDataService, IDiscoveryHierarchicalData, IDiscoveryGraphProperties, IDiscoveryGraphUtilitiesService, IDiscoveryGraphUtilitiesServiceInjector } from 'src/app/interfaces/discoveryInterfaces';
import { Node, Edge } from "@swimlane/ngx-graph"

// Enum Imports
import { EDiscoveryGroupUnitsBy } from "../../enum/discoveryEnums"

@Component({
  selector: 'app-discovery-graph-based-map',
  templateUrl: './discovery-graph-based-map.component.html',
  styleUrls: ['./discovery-graph-based-map.component.css']
})
export class DiscoveryGraphBasedMapComponent {

  // Hierarchical data
  discoveryHierarchicalData: IDiscoveryHierarchicalData = {} as IDiscoveryHierarchicalData

  nodes: Node[] = []
  links: Edge[] = []

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
    this.processHierarchicalData(this.discoveryHierarchicalData);
  }

  /**
   * Process the hierarchical data.
   * @param hierarchicalData hierarchical data.
   */
  processHierarchicalData(hierarchicalData: IDiscoveryHierarchicalData) {

    // Add the root node.
    this.nodes.push({
      id: hierarchicalData.id,
      label: hierarchicalData.name
    })

    // Loop through children nodes.
    hierarchicalData.children.forEach(node => {
      
      // Add the node.
      this.nodes.push({
        id: node.id,
        label: node.name
      })

      // Create a link
      this.links.push({
        id: node.id,
        source: hierarchicalData.id,
        target: node.id
      })

    });


    this.links
  }
}
