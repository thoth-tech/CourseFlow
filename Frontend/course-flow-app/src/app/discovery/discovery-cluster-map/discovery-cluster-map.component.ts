import { Component, HostListener } from '@angular/core';
import * as d3 from "d3";
import { DiscoveryClusterService } from '../../discovery-cluster.service';
import { IDiscoveryNodeData, IMapProperties, IWindowSizeProperties} from '../../interfaces/discoveryInterfaces';
import {MatDialog} from '@angular/material/dialog';
import { DiscoveryDetailDialogComponent } from '../discovery-detail-dialog/discovery-detail-dialog.component';


@Component({
  selector: 'app-discovery-cluster-map',
  templateUrl: './discovery-cluster-map.component.html',
  styleUrls: ['./discovery-cluster-map.component.css']
})
export class DiscoveryClusterMapComponent {

  // Map properties
  private mapProperties: IMapProperties;
  private currentWindowSizeProperties: IWindowSizeProperties;

  // Current cached nodes and connection lines.
  private currentNodes: d3.Selection<SVGGElement | d3.BaseType, IDiscoveryNodeData, SVGGElement, unknown> | null = null;

  // Discovery data
  discoveryNodesData: IDiscoveryNodeData[] = [];

  /**
   * Constructor for the component.
   * @param discoveryService Injected discovery service
   */
  constructor(private discoveryClusterService: DiscoveryClusterService, public dialog: MatDialog) {
    
    this.mapProperties = discoveryClusterService.getDiscoveryMapProperties();
    this.currentWindowSizeProperties = this.mapProperties.windowSizePropertiesSizes["start"];
  }

  /**
   * Called after component is created.
   */
  ngOnInit(): void {

    this.discoveryNodesData = this.discoveryClusterService.getAllDiscoveryNodeData();

    // Once we get the data, we can start creating the cluster map.
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
    
    // Get the current inner width of the browser window
    let width = window.innerWidth;

    // Handle different browser sizes.
    // This also has an optimization to ensure we are not performing a reset on the map every resize tick and only once, when we have gone above or below a threshold.
    if (width > 1300) {

      if (this.currentWindowSizeProperties != this.mapProperties.windowSizePropertiesSizes["large"]) {
        
        this.currentWindowSizeProperties = this.mapProperties.windowSizePropertiesSizes["large"];
        this.createDiscoveryClusterMap();
      }
    }
    else if (width <= 1300 && width > 800) {

      if (this.currentWindowSizeProperties != this.mapProperties.windowSizePropertiesSizes["medium"]) {
        
        this.currentWindowSizeProperties = this.mapProperties.windowSizePropertiesSizes["medium"];
        this.createDiscoveryClusterMap();
      }
    }
    else if (width <= 800) {

      if (this.currentWindowSizeProperties != this.mapProperties.windowSizePropertiesSizes["small"]) {
        
        this.currentWindowSizeProperties = this.mapProperties.windowSizePropertiesSizes["small"];
        this.createDiscoveryClusterMap();
      }
    }
  }

  /**
   * Core logic to create the cluster discovery map.
   */
  createDiscoveryClusterMap(): void {

    // Create the svg canvas
    d3.select("svg").remove();
  
    // Create the svg
    let baseSvgCanvas = d3.select("div#discoveryClusterMap")
      .append("svg")
      .attr("width", this.currentWindowSizeProperties.canvasWidth)
      .attr("height", this.currentWindowSizeProperties.canvasHeight)
      .style("background", this.mapProperties.canvasColor)
      .style("border-radius", this.mapProperties.canvasBorderRadius);

    // To be able to zoom inside it, we need to attach a group element to the canvas
    let zoomableGroup = baseSvgCanvas.append("g");

    // Create and invoke the zoom behaviour.
    let zoomBehaviour = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0, 10])
      .on("zoom", (event) => this.handleOnZoom(zoomableGroup, event))
    
    baseSvgCanvas.call(zoomBehaviour)

    // Create notes
    // Create the nodes group based on the node data.
    // This is considered a group because of the fact that we are later appending a circle and label to this group.
    this.currentNodes = zoomableGroup.selectAll("node")
      .data(this.discoveryNodesData)
      .join("g")
      .attr("transform", (d: IDiscoveryNodeData) => `translate(${d.x}, ${d.y})`)

    // Create the circle element and attach it to the node.
    this.currentNodes.append('circle')
      .attr("fill", "white")
      .attr("r", this.currentWindowSizeProperties.unitNodeRadius)
      .on("click", (event, d: IDiscoveryNodeData) => { 

        this.dialog.open(DiscoveryDetailDialogComponent, {
          data: {discoveryNodeData: d},
          height: '400px', width: '400px'})
      });
  }

  /**
   * Custom zoom functionality to be passed into the zoom behaviour
   * @param zoomableElement Zoomable element.
   * @param event Event to access properties such as the transform.
   */
  handleOnZoom(zoomableElement: d3.Selection<SVGGElement, unknown, HTMLElement, any>, event: any): void {
    
    // Control the transform of the zoomable element
    zoomableElement.attr("transform", event.transform)
  }

  /**
   * Resets the simulation.
  */
  onResetViewPressed(): void {

      this.createDiscoveryClusterMap();
  }
}
