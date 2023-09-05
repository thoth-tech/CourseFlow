// Angular Imports
import { Component, Input, Inject } from '@angular/core';

// Interface Imports
import { IDiscoveryDataServiceInjector, IDiscoveryDataService, IDiscoveryData } from 'src/app/interfaces/discoveryInterfaces';

// Enum Imports
import { EDiscoveryGroupUnitsBy } from "../../enum/discoveryEnums"

// Third-Party Imports
import * as d3 from "d3";

@Component({
  selector: 'app-discovery-graph-based-map',
  templateUrl: './discovery-graph-based-map.component.html',
  styleUrls: ['./discovery-graph-based-map.component.css']
})
export class DiscoveryGraphBasedMapComponent {

  // Current discovery data.
  discoveryData: IDiscoveryData = {} as IDiscoveryData;

  // Canvas, node and link visuals.
  baseSvgCanvasElement: d3.Selection<SVGSVGElement, unknown, HTMLElement, any> | null = null;
  zoomableGroupElement: d3.Selection<SVGGElement, unknown, HTMLElement, any> | null = null;

  // Zoom Level
  zoomLevel: number = 0.5;
   
  constructor(@Inject(IDiscoveryDataServiceInjector) private discoveryDataService: IDiscoveryDataService) {}

  /**
   * Input for group units by param.
   */
  @Input() set groupUnitsBy(value: EDiscoveryGroupUnitsBy) {

    this.discoveryData = this.discoveryDataService.getDiscoveryData(value);
    this.createDiscoveryMap();
  }

  /**
   * Create the discovery map.
   */
  createDiscoveryMap(): void {

    this.baseSvgCanvasElement = this.createBaseCanvas();

    this.zoomableGroupElement = this.baseSvgCanvasElement.append("g");

    this.initializeZoom();

    this.renderNodes();
  }

  /**
   * Create the base svg canvas and return it.
   * @returns Base svg canvas element.
   */
  createBaseCanvas(): d3.Selection<SVGSVGElement, unknown, HTMLElement, any> {

    return d3
      .select("div#graphBasedMap")
      .append("svg")
      .attr("width", 800)
      .attr("height", 800)
      .style("background-color", "white")
      .style("border-radius", 20);
  }

  /**
   * Initializes the zoom related behaviour.
   */
  initializeZoom(): void {
  
    // Create the zoom behaviour with zoomimg in/out functionality.
    let zoomBehaviour = d3.zoom<SVGSVGElement, unknown>().on("zoom", (event) => {
        
      if (this.zoomableGroupElement) {

        this.zoomableGroupElement.attr("transform", event.transform)
      }

    })

    // If we have a base canvas, apply/call the zoom behaviour to the element.
    if (this.baseSvgCanvasElement) {

        this.baseSvgCanvasElement.call(zoomBehaviour.transform, 
          d3.zoomIdentity.translate(500 / 2, 500 / 2)
                         .scale(this.zoomLevel))
                         .call(zoomBehaviour);
    }
  }

  renderNodes(): void {

    if (this.zoomableGroupElement) {

      // Create the node group.
      let renderedNodeGroup = this.zoomableGroupElement.selectAll("node")
                                                       .data(this.discoveryData.nodeData)
                                                       .join("g")
                                                       .attr("transform", nodeData => `translate(${(nodeData as any).x * 800}, ${(nodeData as any).y * 800})`)

      // Append a circle shape to the node group.
      renderedNodeGroup.append('circle')
                       .attr("fill", "blue")
                       .attr("r", 2)

      // Append text to the node group.
      renderedNodeGroup.append("text")
        .text((nodeData) => nodeData.label)  
        .style("font-size", 50)
        .style("visibility", (nodeData) => {

          let visibility = "hidden";

          if (nodeData.group === 1) {
            visibility = "visible";
          }

          return visibility
        })
      }
  }
}
