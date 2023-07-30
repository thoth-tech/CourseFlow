import { Component } from '@angular/core';
import * as d3 from "d3";

@Component({
  selector: 'app-discovery-force-directed-map',
  templateUrl: './discovery-force-directed-map.component.html',
  styleUrls: ['./discovery-force-directed-map.component.css']
})
export class DiscoveryForceDirectedMapComponent {
  // Width and height of the svg element - will need to figure out how to make this responsive.
  private width = 1200;
  private height = 1000

  // Zoom extents
  private minZoom = 0;
  private maxZoom = 10;

  ngOnInit(): void {
    this.createDiscoveryForceDirectedMap();
  }

  createDiscoveryForceDirectedMap(): void {

    // Create the svg canvas
    let baseSvgCanvas = this.createBaseSvgCanvas();

    // To be able to zoom inside it, we need to attach a group element to the canvas
    let zoomableGroup = baseSvgCanvas.append("g");

    // Create the zoom behaviour and call it.
    let zoomBehaviour = this.createZoomBehaviour(zoomableGroup);
    baseSvgCanvas.call(zoomBehaviour)

    // TODO Remove once zoom is tested.
    zoomableGroup.append("circle")
      .attr("cx", this.width / 2)
      .attr("cy", this.height / 2)
      .attr("r", 20)
      .style("fill", "white")
  }

  /**
   * Create and return a base svg canvas.
   * @returns Returns a newly created svg element/canvas.
   */
  createBaseSvgCanvas(): d3.Selection<SVGSVGElement, unknown, HTMLElement, any> {
    
    let svg = d3.select("div#discoveryForceDirectedMap")
    .append("svg")
    .attr("width", this.width)
    .attr("height", this.height)
    .style("background", "#232224")
    .style("border-radius", "20px")

    return svg
  }

  /**
   * Create and return a zoom behaviour.
   * @param zoomableElement Element that we to apply zooming functionality to.
   * @returns Returns a zoomable behaviour.
   */
  createZoomBehaviour(zoomableElement:d3.Selection<SVGGElement, unknown, HTMLElement, any>) : d3.ZoomBehavior<SVGSVGElement, unknown> {
    
    let zoomBehaviour = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([this.minZoom, this.maxZoom])
      .on("zoom", (event) => {
        
        // Control the transform of the zoomable element
        zoomableElement.attr("transform", event.transform)
    })

    return zoomBehaviour;
  }
}
