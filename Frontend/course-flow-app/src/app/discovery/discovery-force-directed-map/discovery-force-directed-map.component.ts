import { Component, HostListener } from '@angular/core';
import { DiscoveryForceDirectedService } from '../../discovery-force-directed.service';
import { IDiscoveryNodeData, IDiscoveryLinkData, IDiscoveryColorData, 
         IMapProperties, IWindowSizeProperties, IDiscoveryTreeData } from '../../interfaces/discoveryInterfaces';
import * as d3 from "d3";
import {MatDialog} from '@angular/material/dialog';
import { DiscoveryDetailDialogComponent } from '../discovery-detail-dialog/discovery-detail-dialog.component';


@Component({
  selector: 'app-discovery-force-directed-map',
  templateUrl: './discovery-force-directed-map.component.html',
  styleUrls: ['./discovery-force-directed-map.component.css']
})
export class DiscoveryForceDirectedMapComponent {
  
  // Map properties
  private mapProperties: IMapProperties;
  private currentWindowSizeProperties: IWindowSizeProperties;

  // Current cached simulation.
  private currentForceDirectedSimulation: d3.Simulation<IDiscoveryNodeData, undefined>|null = null;

  // Current cached nodes and connection lines.
  private currentNodes: d3.Selection<SVGGElement | d3.BaseType, IDiscoveryNodeData, SVGGElement, unknown> | null = null;
  private currentConnectionLines: d3.Selection<SVGGElement | d3.BaseType, IDiscoveryLinkData, SVGGElement, unknown> | null = null;

  // Discovery data
  discoveryNodesData: IDiscoveryNodeData[] = [];
  discoveryLinksData: IDiscoveryLinkData[] = [];
  discoveryColorData: IDiscoveryColorData = Object();

  /**
   * Constructor for the component.
   * @param discoveryService Injected discovery service
   */
  constructor(private discoveryForceDirectedService: DiscoveryForceDirectedService, public dialog: MatDialog) {
    
    // Retrieve the data - TODO This data retrieval in NOT async, this will need to be changed once proper data format is fully sorted.
    // Map properties
    this.mapProperties = discoveryForceDirectedService.getDiscoveryMapProperties();
    this.currentWindowSizeProperties = this.mapProperties.windowSizePropertiesSizes["start"];

    //  Node and link data
    this.discoveryNodesData = this.discoveryForceDirectedService.getAllDiscoveryNodeData();
    this.discoveryLinksData = this.discoveryForceDirectedService.getAllDiscoveryLinkData();

    // Color
    this.discoveryColorData = this.discoveryForceDirectedService.getDiscoveryColorMapping();
  }

  /**
   * Called after component is created.
   */
  ngOnInit(): void {

    // Once we get the data, we can start creating the force directed map.
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
        this.createDiscoveryForceDirectedMap();
      }
    }
    else if (width <= 1300 && width > 800) {

      if (this.currentWindowSizeProperties != this.mapProperties.windowSizePropertiesSizes["medium"]) {
        
        this.currentWindowSizeProperties = this.mapProperties.windowSizePropertiesSizes["medium"];
        this.createDiscoveryForceDirectedMap();
      }
    }
    else if (width <= 800) {

      if (this.currentWindowSizeProperties != this.mapProperties.windowSizePropertiesSizes["small"]) {
        
        this.currentWindowSizeProperties = this.mapProperties.windowSizePropertiesSizes["small"];
        this.createDiscoveryForceDirectedMap();
      }
    }
  }

  /**
   * Core logic to create the force directed discovery map.
   */
  createDiscoveryForceDirectedMap(): void {

    // In case we already have a svg element (can happen on window resize events)
    d3.select("svg").remove();

    // Create the svg canvas
    let baseSvgCanvas =  d3.select("div#discoveryForceDirectedMap")
                           .append("svg")
                           .attr("width", this.currentWindowSizeProperties.canvasWidth)
                           .attr("height", this.currentWindowSizeProperties.canvasHeight)
                           .style("background", this.mapProperties.canvasColor)
                           .style("border-radius", this.mapProperties.canvasBorderRadius);

    // To be able to zoom inside it, we need to attach a group element to the canvas
    let zoomableGroup = baseSvgCanvas.append("g");

    // Create the zoom behaviour and call it.
    let zoomBehaviour = this.createZoomBehaviour(zoomableGroup);
    baseSvgCanvas.call(zoomBehaviour)



    console.log(this.discoveryForceDirectedService.getDiscoveryTreeData())
    const root = d3.hierarchy(this.discoveryForceDirectedService.getDiscoveryTreeData())
    const links:any = root.links();
    const nodes:any = root.descendants();

    const sim = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id((d:any) => d.id).distance(10).strength(1))
      .force("charge", d3.forceManyBody().strength(-100))
      .force("x", d3.forceX())
      .force("y", d3.forceY())
      .force("center", d3.forceCenter(this.currentWindowSizeProperties.canvasWidth / 2, this.currentWindowSizeProperties.canvasHeight / 2))

    const link = zoomableGroup.append("g")
    .attr("stroke", "red")
    .attr("stroke-width", 0.2)
    .attr("stroke-opacity", 0.6)
    .selectAll("line")
    .data(links)
    .join("line")

    const node = zoomableGroup.append("g")
    .selectAll("circle")
    .data(nodes)
    .join("circle")
    .attr("fill", "white")
    .attr("r", 1.5)
    .on("click", (event, d: any) => { 

      this.dialog.open(DiscoveryDetailDialogComponent, {
        data: {name: d.data.name},
        height: '400px', width: '400px'})
    });

    sim.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y)
      node
        .attr("cx", (d: any) => d.x)
        .attr("cy", (d: any) => d.y)

    })
  }

  /**
   * Create and return a zoom behaviour.
   * @param zoomableElement Element that we to apply zooming functionality to.
   * @returns Returns a zoomable behaviour.
   */
  createZoomBehaviour(zoomableElement:d3.Selection<SVGGElement, unknown, HTMLElement, any>) : d3.ZoomBehavior<SVGSVGElement, unknown> {
    
    let zoomBehaviour = d3.zoom<SVGSVGElement, unknown>()
      //.scaleExtent([this.mapProperties.maxZoomOutAmount, this.mapProperties.maxZoomInAmount])
      .on("zoom", (event) => {
        
        if (event.transform.k < 1.2) {
          this.modifyElementsOnZoomLayerOne();
        }
        else if (event.transform.k >= 1.2 && event.transform.k < 2) {
          this.modifyElementsOnZoomLayerTwo();
        }
        else if (event.transform.k >= 2) {
          this.modifyElementsOnZoomLayerThree();
        }

        // Control the transform of the zoomable element
        zoomableElement.attr("transform", event.transform)
    })

    return zoomBehaviour;
  }

  /**
   * Starts a force directed simulation.
   */
  startForceDirectedSimulation(parentNode:d3.Selection<SVGGElement, unknown, HTMLElement, any>): void {

    if (this.currentForceDirectedSimulation) {
      this.currentForceDirectedSimulation.stop();
    }

    this.discoveryNodesData.forEach((node) => {
      node.x = undefined;
      node.y = undefined;
    })

    // Create the simulation behaviour
    // To my understanding, force many body will apply an equal force to all nodes. Without the link property, nodes will spread out from each other.
    // With the link property, we can attach nodes with each other and form a graph. Unlinked nodes will spread out by itself, and links nodes I assume will have forces applied in a different manner.
    //
    this.currentForceDirectedSimulation = d3.forceSimulation(this.discoveryNodesData)
      .force("link", d3.forceLink(this.discoveryLinksData).id(this.getNodeId).distance((l: IDiscoveryLinkData) => l.distance))
      .force("charge", d3.forceManyBody().strength(this.currentWindowSizeProperties.clusterForce))
      .force("center", d3.forceCenter(this.currentWindowSizeProperties.canvasWidth / 2, this.currentWindowSizeProperties.canvasHeight / 2))

    // Create links based on the link data.
    this.currentConnectionLines = parentNode.append("g")
      .attr("stroke", "white")
      .attr("stroke-opacity", this.mapProperties.lineOpacity)
      .selectAll("line")
      .data(this.discoveryLinksData)
      .join("line");
  
    // Create the nodes group based on the node data.
    // This is considered a group because of the fact that we are later appending a circle and label to this group.
    this.currentNodes = parentNode.selectAll("node")
      .data(this.discoveryNodesData)
      .join("g")

    // Create the circle element and attach it to the node.
    this.currentNodes.append('circle')
      .attr("fill", (d : IDiscoveryNodeData) => this.discoveryColorData[d.group])
      .attr("r", (d: IDiscoveryNodeData) => {
        let radius = 0;
        
        if (d.nodeLabelType === "Field") {

          radius = this.currentWindowSizeProperties.fieldNodeRadius;
        }
        else if (d.nodeLabelType === "Specialization") {

          radius = this.currentWindowSizeProperties.specializationNodeRadius;
        }
        else if (d.nodeLabelType === "Unit") {

          radius = this.currentWindowSizeProperties.unitNodeRadius;
        }

        return radius;
      })
      .on("click", (event, d: IDiscoveryNodeData) => { 

        this.dialog.open(DiscoveryDetailDialogComponent, {
          data: {discoveryNodeData: d},
          height: '400px', width: '400px'})
      });

    // Create the text element and attach it to the group.
    this.currentNodes.append("text")
    .text((d: IDiscoveryNodeData) => d.id)          
    .style('font-size', (d: IDiscoveryNodeData) => {
          
      let fontSize = "";
        
      if (d.nodeLabelType === "Field") {

        fontSize = this.currentWindowSizeProperties.fieldLabelProperties.fontSize;
      }
      else if (d.nodeLabelType === "Specialization") {

        fontSize = this.currentWindowSizeProperties.specializationLabelProperties.fontSize;
      }
      else if (d.nodeLabelType === "Unit") {

        fontSize = this.currentWindowSizeProperties.unitLabelProperties.fontSize;
      }

      return fontSize;
    })
    .attr('x', (d: IDiscoveryNodeData) => {

      let x = 0;
        
      if (d.nodeLabelType === "Field") {

        x = this.currentWindowSizeProperties.fieldLabelProperties.x;
      }
      else if (d.nodeLabelType === "Specialization") {

        x = this.currentWindowSizeProperties.specializationLabelProperties.x;
      }
      else if (d.nodeLabelType === "Unit") {

        x = this.currentWindowSizeProperties.unitLabelProperties.x;
      }

      return x;
    })
    .attr('y', (d: IDiscoveryNodeData) => {

      let y = 0;
        
      if (d.nodeLabelType === "Field") {

        y = this.currentWindowSizeProperties.fieldLabelProperties.y;
      }
      else if (d.nodeLabelType === "Specialization") {

        y = this.currentWindowSizeProperties.specializationLabelProperties.y;
      }
      else if (d.nodeLabelType === "Unit") {

        y = this.currentWindowSizeProperties.unitLabelProperties.y;
      }

      return y;
    })
    .style('font-weight', '900')
    .style('fill', 'rgba(255, 255, 255, 0.8');


    // By default, lets set the nodes and links to the zoom out state
    this.modifyElementsOnZoomLayerOne();

    this.currentForceDirectedSimulation.on("tick", () => {

      if (this.currentConnectionLines) {
        this.currentConnectionLines
        .attr("x1", (d: IDiscoveryLinkData) => (d.source as IDiscoveryNodeData).x || 0)
        .attr("y1", (d: IDiscoveryLinkData) => (d.source as IDiscoveryNodeData).y || 0)
        .attr("x2", (d: IDiscoveryLinkData) => (d.target as IDiscoveryNodeData).x || 0)
        .attr("y2", (d: IDiscoveryLinkData) => (d.target as IDiscoveryNodeData).y || 0)
      }

      if (this.currentNodes) {
        this.currentNodes
        .attr("transform", (d: IDiscoveryNodeData) => `translate(${d.x || 0}, ${d.y || 0})`);

      // At this point in time, we don't need the sim to keep running once the layout is done.
      if (this.currentForceDirectedSimulation && this.currentForceDirectedSimulation.alpha() < 0.2) {
        this.currentForceDirectedSimulation.stop();
      }
      }
    });
  }
  
  /**
   * 
   * @param newNode 
   * @returns 
   */
  getNodeId(newNode: d3.SimulationNodeDatum): string | number {

    let node: IDiscoveryNodeData = newNode as IDiscoveryNodeData;
    return node.id;
  }
  
  /**
   * Modifies element properties when zoomed to level one.
   */
  modifyElementsOnZoomLayerOne(): void {
    
    // Modify node properties
    if (this.currentNodes) {

      this.currentNodes.select('circle')
        .attr("visibility", (d: IDiscoveryNodeData) => d.nodeLabelType === "Field" ? "visible" : "hidden")

      this.currentNodes.select("text")
        .attr("visibility", (d: IDiscoveryNodeData) => d.nodeLabelType === "Field" ? "visible" : "hidden")
    }

    // Modify line properties
    if (this.currentConnectionLines) {
      
      this.currentConnectionLines
        .attr("visibility", "hidden")
    }
  }
  
  /**
   * Modifies element properties when zoomed to level two.
   */
  modifyElementsOnZoomLayerTwo(): void {
    
    // Modify node properties
    if (this.currentNodes) {
      
      this.currentNodes.select('circle')
        .attr("visibility", (d: IDiscoveryNodeData) => d.nodeLabelType === "Specialization" ? 'visible' : 'hidden')

      this.currentNodes.select("text")
        .attr("visibility", (d: IDiscoveryNodeData) => d.nodeLabelType === "Specialization" ? 'visible' : 'hidden')

    }

    // Modify line properties
    if (this.currentConnectionLines) {
      
      this.currentConnectionLines
        .attr("visibility", (d : IDiscoveryLinkData) => d.lineLabelType === "Field" ? 'visible' : 'hidden')
    }
  }

  /**
   * Modifies element properties when zoomed to level three.
   */
  modifyElementsOnZoomLayerThree(): void {
          
    // Modify node properties
    if (this.currentNodes) {

      this.currentNodes.select('circle')
        .attr("visibility", (d: IDiscoveryNodeData) => d.nodeLabelType === "Unit" ? 'visible' : 'hidden')

      this.currentNodes.select("text")
      .attr("visibility", (d: IDiscoveryNodeData) => d.nodeLabelType === "Unit" ? 'visible' : 'hidden')
    }

    // Modify line properties
    if (this.currentConnectionLines) {
      
      this.currentConnectionLines
        .attr("visibility", "Visible")
    }
  }

  /**
   * Resets the simulation.
   */
  onResetViewPressed(): void {

    this.createDiscoveryForceDirectedMap();
  }
}
