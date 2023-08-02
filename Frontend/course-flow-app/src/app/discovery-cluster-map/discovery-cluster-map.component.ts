import { Component, HostListener } from '@angular/core';
import { DiscoveryService } from '../discovery.service';
import { DiscoveryNodeData} from '../discoveryInterfaces';
import * as d3 from "d3";

@Component({
  selector: 'app-discovery-cluster-map',
  templateUrl: './discovery-cluster-map.component.html',
  styleUrls: ['./discovery-cluster-map.component.css']
})
export class DiscoveryClusterMapComponent {

  // Current cached nodes and connection lines.
  private currentNodes: d3.Selection<SVGGElement | d3.BaseType, DiscoveryNodeData, SVGGElement, unknown> | null = null;

  // Discovery data
  discoveryNodesData: DiscoveryNodeData[] = [];

  /**
   * Constructor for the component.
   * @param discoveryService Injected discovery service
   */
  constructor(private discoveryService: DiscoveryService) {}

  /**
   * Called after component is created.
   */
  ngOnInit(): void {

    this.discoveryNodesData = this.discoveryService.getAllDiscoveryClusterNodeData();

    // Once we get the data, we can start creating the cluster map.
    this.createDiscoveryClusterMap();
  }

  /**
   * Core logic to create the cluster discovery map.
   */
  createDiscoveryClusterMap(): void {

    // In case we already have a svg element (can happen on window resize events)
    d3.select("svg").remove();

    // Create the svg canvas
    let baseSvgCanvas = this.createBaseSvgCanvas();

    // To be able to zoom inside it, we need to attach a group element to the canvas
    let zoomableGroup = baseSvgCanvas.append("g");

    // Create the zoom behaviour and call it.
    let zoomBehaviour = this.createZoomBehaviour(zoomableGroup);
    baseSvgCanvas.call(zoomBehaviour)

    console.log(this.discoveryNodesData);

    // Create notes
    // Create the nodes group based on the node data.
    // This is considered a group because of the fact that we are later appending a circle and label to this group.
    this.currentNodes = zoomableGroup.selectAll("node")
      .data(this.discoveryNodesData)
      .join("g")
      .attr("transform", (d: DiscoveryNodeData) => `translate(${d.x}, ${d.y})`)

    // Create the circle element and attach it to the node.
    this.currentNodes.append('circle')
      .attr("fill", "white")
      .attr("r", 5)
  }

  /**
   * Create and return a base svg canvas.
   * @returns Returns a newly created svg element/canvas.
   */
  createBaseSvgCanvas(): d3.Selection<SVGSVGElement, unknown, HTMLElement, any> {
    
    let svg = d3.select("div#discoveryClusterMap")
    .append("svg")
    .attr("width", "1200px")
    .attr("height", "1200px")
    .style("background", "#232224")
    .style("border-radius", "20px");

    return svg;
  }

  /**
   * Create and return a zoom behaviour.
   * @param zoomableElement Element that we to apply zooming functionality to.
   * @returns Returns a zoomable behaviour.
   */
  createZoomBehaviour(zoomableElement:d3.Selection<SVGGElement, unknown, HTMLElement, any>) : d3.ZoomBehavior<SVGSVGElement, unknown> {
    
    let zoomBehaviour = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0, 10])
      .on("zoom", (event) => {
        

        // Control the transform of the zoomable element
        zoomableElement.attr("transform", event.transform)
    })

    return zoomBehaviour;
  }

}
