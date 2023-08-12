import { Component, HostListener } from '@angular/core';
import { DiscoveryForceDirectedV2Service } from '../../discovery-force-directed-v2.service';
import { IDiscoveryNodeData, IDiscoveryLinkData, IDiscoveryColorData, 
         IMapProperties, IWindowSizeProperties, IDiscoveryData } from '../../interfaces/discoveryInterfaces';
import * as d3 from "d3";
import {MatDialog} from '@angular/material/dialog';


@Component({
  selector: 'app-discovery-force-directed-map-v2',
  templateUrl: './discovery-force-directed-map-v2.component.html',
  styleUrls: ['./discovery-force-directed-map-v2.component.css']
})
export class DiscoveryForceDirectedMapV2Component {
  
  // Map properties
  private mapProperties: IMapProperties;
  private currentWindowSizeProperties: IWindowSizeProperties;

  // Current cached simulation.
  private currentForceDirectedSimulation: d3.Simulation<IDiscoveryNodeData, undefined>|null = null;

  // Current cached nodes and connection lines.
  private currentNodes: d3.Selection<SVGGElement | d3.BaseType, IDiscoveryNodeData, SVGGElement, unknown> | null = null;
  private currentConnectionLines: d3.Selection<SVGGElement | d3.BaseType, IDiscoveryLinkData, SVGGElement, unknown> | null = null;

  // Discovery data
  discoveryData: IDiscoveryData = Object();
  discoveryColorData: IDiscoveryColorData = Object();

  // More details panel
  moreDetailsPanelTitle: string = "Faculty Area"
  moreDetailsPanelDescription: string = "Faculties corresponding to specific fields within Deakin University."

  /**
   * Constructor for the component.
   * @param discoveryService Injected discovery service
   */
  constructor(private discoveryForceDirectedService: DiscoveryForceDirectedV2Service, public dialog: MatDialog) {
  
    // Retrieve the data - TODO This data retrieval in NOT async, this will need to be changed once proper data format is fully sorted.
    // Map properties
    this.mapProperties = discoveryForceDirectedService.getDiscoveryMapProperties();
    this.currentWindowSizeProperties = this.mapProperties.windowSizePropertiesSizes["start"];

    //  Discovery data
    this.discoveryData = this.discoveryForceDirectedService.getAllDiscoveryData();

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

    this.moreDetailsPanelTitle = "Faculty Area"
    this.moreDetailsPanelDescription = "Faculties corresponding to specific fields within Deakin University."

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

    // Start the force directed sim.
    this.startForceDirectedSimulation(zoomableGroup, this.discoveryData.facultyNodes);
  }

  /**
   * Create and return a zoom behaviour.
   * @param zoomableElement Element that we to apply zooming functionality to.
   * @returns Returns a zoomable behaviour.
   */
    createZoomBehaviour(zoomableElement:d3.Selection<SVGGElement, unknown, HTMLElement, any>) : d3.ZoomBehavior<SVGSVGElement, unknown> {
    
      let zoomBehaviour = d3.zoom<SVGSVGElement, unknown>()
        .scaleExtent([this.mapProperties.maxZoomOutAmount, this.mapProperties.maxZoomInAmount])
        .on("zoom", (event) => {
      
          // Control the transform of the zoomable element
          zoomableElement.attr("transform", event.transform)
      })
  
      return zoomBehaviour;
    }

  /**
   * Starts a force directed simulation.
   */
  startForceDirectedSimulation(parentNode:d3.Selection<SVGGElement, unknown, HTMLElement, any>, 
                               nodeData: IDiscoveryNodeData[]): void {

    if (this.currentForceDirectedSimulation) {
      this.currentForceDirectedSimulation.stop();
    }

    nodeData.forEach((node) => {
      node.x = undefined;
      node.y = undefined;
    })

    parentNode.selectAll("g").remove();

    // Create the simulation behaviour
    // To my understanding, force many body will apply an equal force to all nodes. Without the link property, nodes will spread out from each other.
    // With the link property, we can attach nodes with each other and form a graph. Unlinked nodes will spread out by itself, and links nodes I assume will have forces applied in a different manner.
    this.currentForceDirectedSimulation = d3.forceSimulation(nodeData)
        //.force("link", d3.forceLink(this.discoveryLinksData).id(this.getNodeId))
      .force("charge", d3.forceManyBody().strength((data : d3.SimulationNodeDatum) => {
        
        let d: IDiscoveryNodeData = data as IDiscoveryNodeData

        let force: number = 0;

        if (d.nodeLabelType === "Faculty") {
          force = -2000 / nodeData.length
        }
          
        else if (d.nodeLabelType === "Discipline") {
          force = -2000 / nodeData.length
        }
        else{
          force = -2000 / nodeData.length
        }

        return force;
      }))
      .force("center", d3.forceCenter(this.currentWindowSizeProperties.canvasWidth / 2, this.currentWindowSizeProperties.canvasHeight / 2))


    // Create the nodes group based on the node data.
    // This is considered a group because of the fact that we are later appending a circle and label to this group.
    this.currentNodes = parentNode.selectAll("node")
      .data(nodeData)
      .join("g")

    // Create the circle element and attach it to the node.
    this.currentNodes.append('circle')
      .attr("fill", (d : IDiscoveryNodeData) => this.discoveryColorData[d.group])
      .attr("r", (d : IDiscoveryNodeData) => {
        let radius = 0;
        
        if (d.nodeLabelType === "Faculty") {

          radius = this.currentWindowSizeProperties.fieldNodeRadius;
        }
        else if (d.nodeLabelType === "Discipline") {

          radius = this.currentWindowSizeProperties.specializationNodeRadius;
        }
        else if (d.nodeLabelType === "Unit") {

          radius = this.currentWindowSizeProperties.unitNodeRadius;
        }

        return radius;
      })
      .on("click", (event, d: IDiscoveryNodeData) => { 

        if (d.nodeLabelType == "Faculty") {

          this.moreDetailsPanelTitle = d.id;
          this.moreDetailsPanelDescription = d.description;
          this.startForceDirectedSimulation(parentNode, this.discoveryData.disciplineNodes[d.id]);
        }
        else if (d.nodeLabelType == "Discipline") {
          
          this.moreDetailsPanelTitle = d.id;
          this.moreDetailsPanelDescription = d.description;
          this.startForceDirectedSimulation(parentNode, this.discoveryData.unitNodes[d.id]);
        }
        else if (d.nodeLabelType == "Unit") {
          this.moreDetailsPanelTitle = d.name;
          this.moreDetailsPanelDescription = d.description;
        }
      });

    // Create the text element and attach it to the group.
    this.currentNodes.append("text")
    .text((d: IDiscoveryNodeData) => d.id)          
    .style('font-size', (d: IDiscoveryNodeData) => {
      let radius = 0;
      
      if (d.nodeLabelType === "Faculty") {

        radius = this.currentWindowSizeProperties.fieldNodeRadius;
      }
      else if (d.nodeLabelType === "Discipline") {

        radius = this.currentWindowSizeProperties.specializationNodeRadius;
      }
      else if (d.nodeLabelType === "Unit") {

        radius = this.currentWindowSizeProperties.unitNodeRadius;
      }

      return radius;
    })
    .attr('x', (d: IDiscoveryNodeData) => {

      let x = 0;
        
      if (d.nodeLabelType === "Faculty") {

        x = this.currentWindowSizeProperties.fieldLabelProperties.x;
      }
      else if (d.nodeLabelType === "Discipline") {

        x = this.currentWindowSizeProperties.specializationLabelProperties.x;
      }
      else if (d.nodeLabelType === "Unit") {

        x = this.currentWindowSizeProperties.unitLabelProperties.x;
      }

      return x;
    })
    .attr('y', (d: IDiscoveryNodeData) => {

      let y = 0;
        
      if (d.nodeLabelType === "Faculty") {

        y = this.currentWindowSizeProperties.fieldLabelProperties.y;
      }
      else if (d.nodeLabelType === "Discipline") {

        y = this.currentWindowSizeProperties.specializationLabelProperties.y;
      }
      else if (d.nodeLabelType === "Unit") {

        y = this.currentWindowSizeProperties.unitLabelProperties.y;
      }

      return y;
    })
    .style('font-weight', '900')
    .style('fill', 'rgba(255, 255, 255, 0.8');


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
   * Resets the simulation.
   */
    onResetViewPressed(): void {

      this.createDiscoveryForceDirectedMap();
    }
}
