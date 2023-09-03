// Angular Imports
import { Component, Input, Inject } from '@angular/core';

// Ngx-graph Imports
import { Edge, Node } from '@swimlane/ngx-graph';

// Class Imports
import { PositionBasedLayout } from './PositionBasedLayout';

// Interface Imports
import { IDiscoveryDataServiceInjector, IDiscoveryDataService, IDiscoveryNodeData } from 'src/app/interfaces/discoveryInterfaces';

// Enum Imports
import { EDiscoveryGroupUnitsBy } from "../../enum/discoveryEnums"


@Component({
  selector: 'app-discovery-graph-based-map',
  templateUrl: './discovery-graph-based-map.component.html',
  styleUrls: ['./discovery-graph-based-map.component.css']
})
export class DiscoveryGraphBasedMapComponent {

  // Custom Layout
  positionBasedLayout: PositionBasedLayout = new PositionBasedLayout();

  // Data
  nodes: Node[] = [] as Node[];
  edges: Edge[] = [] as Edge[];

  // Graph render control
  displayGraph = true;

  /**
   * Constructor for the component.
   * @param discoveryDataService Injected discovery data service.
   */
  constructor(@Inject(IDiscoveryDataServiceInjector) private discoveryDataService: IDiscoveryDataService) {}

  /**
   * Input for group units by param.
   */
  @Input() set groupUnitsBy(value: EDiscoveryGroupUnitsBy) {

    let discoverNodeData = this.discoveryDataService.getDiscoveryNodeData(value);

    // Set the nodes.
    this.nodes = discoverNodeData;

    // We will have to go through the connections inside the discovery node data and create the edges.
    let edges = [] as Edge[];

    discoverNodeData.forEach((nodeData) => {

      nodeData.connections.forEach((connection) => {

        let edge: Edge = {
          id:  nodeData.id + connection,
          label: nodeData.id + connection,
          source: nodeData.id,
          target: connection,
        };

        edges.push(edge);
      })
    })

    this.edges = [...edges];
  }

  onNodeClicked(event: any): void {

    console.log(event)
  }
}