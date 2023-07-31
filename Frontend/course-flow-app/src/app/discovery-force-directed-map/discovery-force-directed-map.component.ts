import { Component, HostListener } from '@angular/core';
import * as d3 from "d3";

@Component({
  selector: 'app-discovery-force-directed-map',
  templateUrl: './discovery-force-directed-map.component.html',
  styleUrls: ['./discovery-force-directed-map.component.css']
})
export class DiscoveryForceDirectedMapComponent {
  
  // SVG element data
  svgElementData = {
    "small": {
      "width": 300,
      "height": 300,
      "nodeRadius": 6
    },
    "medium": {
      "width": 500,
      "height": 500,
      "nodeRadius": 10
    },
    "large": {
      "width": 800,
      "height": 800,
      "nodeRadius": 15
    },
    "xLarge": {
      "width": 1200,
      "height": 1200,
      "nodeRadius": 20
    }
  }

  currentSvgElementData = this.svgElementData.small;

  // Zoom extents
  private minZoom = 0;
  private maxZoom = 10;


  /**
   * Called after component is created.
   */
  ngOnInit(): void {

    this.preCreateDiscoveryForceDirectedMap();
  }

  /**
   * Callback for when the window is resized.
   */
  @HostListener("window:resize", [])
  private onWindowResized() {

    this.preCreateDiscoveryForceDirectedMap();

  }

  /**
   * Handles pre-configurations prior to calling createDiscoveryForceDirectedMap().
   */
  preCreateDiscoveryForceDirectedMap() : void {
    
    let width = window.innerWidth;

    if (width > 1300){
      this.currentSvgElementData = this.svgElementData.xLarge;
      this.createDiscoveryForceDirectedMap();
    }
    else if (width <= 1300 && width > 800){
      this.currentSvgElementData = this.svgElementData.large;
      this.createDiscoveryForceDirectedMap();
    }
    else if (width <= 800 && width > 400) {
      this.currentSvgElementData = this.svgElementData.medium;
      this.createDiscoveryForceDirectedMap();
    }
    else if (width <= 400) {
      this.currentSvgElementData = this.svgElementData.small;
      this.createDiscoveryForceDirectedMap();
    }
  }

  /**
   * Core logic to create the force directed discovery map.
   */
  createDiscoveryForceDirectedMap(): void {

    // In case we already have a svg element (can happen on window resize events)
    d3.select("svg").remove();

    // Create the svg canvas
    let baseSvgCanvas = this.createBaseSvgCanvas();

    // To be able to zoom inside it, we need to attach a group element to the canvas
    let zoomableGroup = baseSvgCanvas.append("g");

    // Create the zoom behaviour and call it.
    let zoomBehaviour = this.createZoomBehaviour(zoomableGroup);
    baseSvgCanvas.call(zoomBehaviour)

    // TODO Remove once zoom is tested.
    zoomableGroup.append("circle")
      .attr("cx", this.currentSvgElementData.width / 2)
      .attr("cy", this.currentSvgElementData.height / 2)
      .attr("r", this.currentSvgElementData.nodeRadius)
      .style("fill", "white")
  }

  /**
   * Create and return a base svg canvas.
   * @returns Returns a newly created svg element/canvas.
   */
  createBaseSvgCanvas(): d3.Selection<SVGSVGElement, unknown, HTMLElement, any> {
    
    let svg = d3.select("div#discoveryForceDirectedMap")
    .append("svg")
    .attr("width", this.currentSvgElementData.width)
    .attr("height", this.currentSvgElementData.height)
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
