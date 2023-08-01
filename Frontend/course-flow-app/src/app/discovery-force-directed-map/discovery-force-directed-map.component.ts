import { Component, HostListener } from '@angular/core';
import { DiscoveryService } from '../discovery.service';
import { DiscoveryNodeData, DiscoveryLinkData, DiscoveryColorData} from '../discoveryInterfaces';
import * as d3 from "d3";

interface LabelProperties {
  x: number;
  y: number;
  fontSize: string;
}

@Component({
  selector: 'app-discovery-force-directed-map',
  templateUrl: './discovery-force-directed-map.component.html',
  styleUrls: ['./discovery-force-directed-map.component.css']
})
export class DiscoveryForceDirectedMapComponent {
  
  // Width based graph data.
  private widthBasedGraphData = {
    "small": {
      "width": 400,
      "height": 400,
      "nodeDistance": 60,
      "clusterForce": -50,
      "fieldNodeRadius": 10,
      "specializationNodeRadius": 5,
      "unitNodeRadius": 2.5,
    },
    "medium": {
      "width": 800,
      "height": 800,
      "nodeDistance": 90,
      "clusterForce": -80,
      "fieldNodeRadius": 30,
      "specializationNodeRadius": 15,
      "unitNodeRadius": 7.5,
    },
    "large": {
      "width": 1200,
      "height": 1200,
      "nodeDistance": 120,
      "clusterForce": -120,
      "fieldNodeRadius": 50,
      "specializationNodeRadius": 25,
      "unitNodeRadius": 12.5,
    }
  }

  private widthZoomBasedGraphData = this.widthBasedGraphData.small;

  // Individual graph properties
  private canvasColor = "#232224";
  private canvasBorderRadius = "20px";
  private lineOpacity = 0.2;
  private unitLabelProperties: LabelProperties = {
    x: 10,
    y: 0,
    fontSize: "3pt"
  }
  private specializationLabelProperties: LabelProperties = {
    x: 20,
    y: 0,
    fontSize: "8pt"
  }
  private fieldLabelProperties: LabelProperties = {
    x: 40,
    y: 0,
    fontSize: "15pt"
  }

  // Zoom extents.
  private minZoom = 0;
  private maxZoom = 10;
  
  // Current cached simulation.
  private currentForceDirectedSimulation: d3.Simulation<DiscoveryNodeData, undefined>|null = null;

  // Current cached nodes and connection lines.
  private currentNodes: d3.Selection<SVGGElement | d3.BaseType, DiscoveryNodeData, SVGGElement, unknown> | null = null;
  private currentConnectionLines: d3.Selection<SVGGElement | d3.BaseType, DiscoveryLinkData, SVGGElement, unknown> | null = null;

  // Discovery data
  discoveryNodesData: DiscoveryNodeData[] = [];
  discoveryLinksData: DiscoveryLinkData[] = [];
  discoveryColorData: DiscoveryColorData = Object();

  /**
   * Constructor for the component.
   * @param discoveryService Injected discovery service
   */
  constructor(private discoveryService: DiscoveryService) {}

  /**
   * Called after component is created.
   */
  ngOnInit(): void {

    // Retrieve the data - TODO This data retrieval in NOT async, this will need to be changed once proper data format is fully sorted.
    this.discoveryNodesData = this.discoveryService.getAllDiscoveryNodeData();
    this.discoveryLinksData = this.discoveryService.getAllDiscoveryLinkData();
    this.discoveryColorData = this.discoveryService.getDiscoveryColorMapping();

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
   * TODO Need to optimize this, this is essentially going to re-create the svg everytime the browser's size changes.
   */
  preCreateDiscoveryForceDirectedMap() : void {
    
    // Get the current inner width of the browser window
    let width = window.innerWidth;

    // Handle different browser sizes.
    // This also has an optimization to ensure we are not performing a reset on the map every resize tick and only once, when we have gone above or below a threshold.
    if (width > 1300) {

      if (this.widthZoomBasedGraphData != this.widthBasedGraphData.large) {
        
        this.widthZoomBasedGraphData = this.widthBasedGraphData.large;
        this.createDiscoveryForceDirectedMap();
      }
    }
    else if (width <= 1300 && width > 800) {

      if (this.widthZoomBasedGraphData != this.widthBasedGraphData.medium) {
        
        this.widthZoomBasedGraphData = this.widthBasedGraphData.medium;
        this.createDiscoveryForceDirectedMap();
      }
    }
    else if (width <= 800) {

      if (this.widthZoomBasedGraphData != this.widthBasedGraphData.small) {
        
        this.widthZoomBasedGraphData = this.widthBasedGraphData.small;
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
    let baseSvgCanvas = this.createBaseSvgCanvas();

    // To be able to zoom inside it, we need to attach a group element to the canvas
    let zoomableGroup = baseSvgCanvas.append("g");

    // Create the zoom behaviour and call it.
    let zoomBehaviour = this.createZoomBehaviour(zoomableGroup);
    baseSvgCanvas.call(zoomBehaviour)

    // Start the force directed sim.
    this.startForceDirectedSimulation(zoomableGroup);
  }

  /**
   * Create and return a base svg canvas.
   * @returns Returns a newly created svg element/canvas.
   */
  createBaseSvgCanvas(): d3.Selection<SVGSVGElement, unknown, HTMLElement, any> {
    
    let svg = d3.select("div#discoveryForceDirectedMap")
    .append("svg")
    .attr("width", this.widthZoomBasedGraphData.width)
    .attr("height", this.widthZoomBasedGraphData.height)
    .style("background", this.canvasColor)
    .style("border-radius", this.canvasBorderRadius);

    return svg;
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
        
        if (event.transform.k < 1.5) {
          this.modifyElementsOnZoomLayerOne();
        }
        else if (event.transform.k >= 1.5 && event.transform.k < 3) {
          this.modifyElementsOnZoomLayerTwo();
        }
        else if (event.transform.k >= 3) {
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
      this.currentForceDirectedSimulation = d3.forceSimulation(this.discoveryNodesData)
        .force("link", d3.forceLink(this.discoveryLinksData).id(this.getNodeId).distance(this.widthZoomBasedGraphData.nodeDistance))
        .force("charge", d3.forceManyBody().strength(this.widthZoomBasedGraphData.clusterForce))
        .force("center", d3.forceCenter(this.widthZoomBasedGraphData.width / 2, this.widthZoomBasedGraphData.height / 2))


      // Create links based on the link data.
      this.currentConnectionLines = parentNode.append("g")
        .attr("stroke", "white")
        .attr("stroke-opacity", this.lineOpacity)
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
        .attr("fill", (d : DiscoveryNodeData) => this.discoveryColorData[d.group])
        .attr("r", (d: DiscoveryNodeData) => {
          let radius = 0;
          
          if (d.nodeLabelType === "Field") {

            radius = this.widthZoomBasedGraphData.fieldNodeRadius;
          }
          else if (d.nodeLabelType === "Specialization") {

            radius = this.widthZoomBasedGraphData.specializationNodeRadius;
          }
          else if (d.nodeLabelType === "Unit") {

            radius = this.widthZoomBasedGraphData.unitNodeRadius;
          }

          return radius;
        });
  
      // Create the text element and attach it to the group.
      this.currentNodes.append("text")
      .text((d: DiscoveryNodeData) => d.id)          
      .style('font-size', (d: DiscoveryNodeData) => {
            
        let fontSize = "";
          
        if (d.nodeLabelType === "Field") {

          fontSize = this.fieldLabelProperties.fontSize;
        }
        else if (d.nodeLabelType === "Specialization") {

          fontSize = this.specializationLabelProperties.fontSize;
        }
        else if (d.nodeLabelType === "Unit") {

          fontSize = this.unitLabelProperties.fontSize;
        }

        return fontSize;
      })
      .attr('x', (d: DiscoveryNodeData) => {

        let x = 0;
          
        if (d.nodeLabelType === "Field") {

          x = this.fieldLabelProperties.x;
        }
        else if (d.nodeLabelType === "Specialization") {

          x = this.specializationLabelProperties.x;
        }
        else if (d.nodeLabelType === "Unit") {

          x = this.unitLabelProperties.x;
        }

        return x;
      })
      .attr('y', (d: DiscoveryNodeData) => {

        let y = 0;
          
        if (d.nodeLabelType === "Field") {

          y = this.fieldLabelProperties.y;
        }
        else if (d.nodeLabelType === "Specialization") {

          y = this.specializationLabelProperties.y;
        }
        else if (d.nodeLabelType === "Unit") {

          y = this.unitLabelProperties.y;
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
          .attr("x1", (d: DiscoveryLinkData) => (d.source as DiscoveryNodeData).x || 0)
          .attr("y1", (d: DiscoveryLinkData) => (d.source as DiscoveryNodeData).y || 0)
          .attr("x2", (d: DiscoveryLinkData) => (d.target as DiscoveryNodeData).x || 0)
          .attr("y2", (d: DiscoveryLinkData) => (d.target as DiscoveryNodeData).y || 0)
        }
  
        if (this.currentNodes) {
          this.currentNodes
          .attr("transform", (d: DiscoveryNodeData) => `translate(${d.x || 0}, ${d.y || 0})`);
  
        // At this point in time, we don't need the sim to keep running once the layout is done.
        if (this.currentForceDirectedSimulation && this.currentForceDirectedSimulation.alpha() < 0.001) {
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
  
      let node: DiscoveryNodeData = newNode as DiscoveryNodeData;
      return node.id;
    }
  
    /**
     * Modifies element properties when zoomed out.
     */
    modifyElementsOnZoomLayerOne(): void {
      
      // Modify node properties
      if (this.currentNodes) {
  
        this.currentNodes.select('circle')
          .attr("visibility", (d: DiscoveryNodeData) => d.nodeLabelType === "Field" ? "visible" : "hidden")
 
        this.currentNodes.select("text")
          .attr("visibility", (d: DiscoveryNodeData) => d.nodeLabelType === "Field" ? "visible" : "hidden")
      }

      // Modify line properties
      if (this.currentConnectionLines) {
        
        this.currentConnectionLines
          .attr("visibility", "hidden")
      }
    }
  
    /**
     * Modify element properties when zoomed in.
     */
    modifyElementsOnZoomLayerTwo(): void {
      
      // Modify node properties
      if (this.currentNodes) {
        
        this.currentNodes.select('circle')
          .attr("visibility", (d: DiscoveryNodeData) => d.nodeLabelType === "Field" || d.nodeLabelType === "Specialization" ? 'visible' : 'hidden')

        this.currentNodes.select("text")
          .attr("visibility", (d: DiscoveryNodeData) => d.nodeLabelType === "Specialization" ? 'visible' : 'hidden')

      }

      // Modify line properties
      if (this.currentConnectionLines) {
        
        this.currentConnectionLines
          .attr("visibility", (d : DiscoveryLinkData) => d.lineLabelType === "Field" ? 'visible' : 'hidden')
      }
    }

    modifyElementsOnZoomLayerThree(): void {
            
      // Modify node properties
      if (this.currentNodes) {
  
        this.currentNodes.select('circle')
          .attr("visibility", 'visible');
  
        this.currentNodes.select("text")
        .attr("visibility", (d: DiscoveryNodeData) => d.nodeLabelType === "Unit" ? 'visible' : 'hidden')
      }
  
      // Modify line properties
      if (this.currentConnectionLines) {
        
        this.currentConnectionLines
          .attr("visibility", "Visible")
      }
    }
}
