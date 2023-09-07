// Angular Imports
import { Component, Input, Inject } from '@angular/core';

// Interface Imports
import { IDiscoveryDataServiceInjector, IDiscoveryDataService, IDiscoveryData, IDiscoveryNodeData, IDiscoveryLinkData } from 'src/app/interfaces/discoveryInterfaces';

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
  renderedNodeGroup: d3.Selection<SVGGElement | d3.BaseType, IDiscoveryNodeData, SVGGElement, unknown> | null = null;
  renderedLinks: d3.Selection<SVGGElement | d3.BaseType, IDiscoveryLinkData, SVGGElement, unknown> | null = null;

  // Graph Properties.
  width: number = 1920;
  height: number = 1920;
  initialZoomLevel: number = 0.2;
  currentZoomLevel: number = 0.2;

  // Node Properties.
  nodeColor: string = "rgba(255, 0, 0, 0.8)"
  nodeRadius: number = 5;
  selectedNodeColor: string = "rgba(0, 0, 255, 0.8)";

  // Text Properties
  fontSize: number = 5;

  // Link/Edge Properties
  linkWidth: number = 0.1;
  linkOpacity: number = 0.1;
  linkColor: string = "black";
  selectedLinkColor: string = "rgba(0, 0, 255, 0.5)";
   
  constructor(@Inject(IDiscoveryDataServiceInjector) private discoveryDataService: IDiscoveryDataService) {}

  /**
   * Input for group units by param.
   */
  @Input() set groupUnitsBy(value: EDiscoveryGroupUnitsBy) {

    this.discoveryData = this.discoveryDataService.getDiscoveryData(value);
    this.createDiscoveryMap();
  }

  /**
   * Finds a node by id.
   * @param id Id of the node.
   * @returns Found node.
   */
  getNodeById(id: string): IDiscoveryNodeData {

    let foundNode: IDiscoveryNodeData | null = null;
  
    if (this.discoveryData.nodeData) {

      foundNode = this.discoveryData.nodeData.find((node) => node.id === id) as IDiscoveryNodeData;
    }
      
    return foundNode as IDiscoveryNodeData;
  }

  /**
   * Create the discovery map.
   */
  createDiscoveryMap(): void {

    d3.select("div#graphBasedMap").select("svg").remove();

    this.baseSvgCanvasElement = this.createBaseCanvas();

    this.zoomableGroupElement = this.baseSvgCanvasElement.append("g");

    this.initializeZoom();

    this.renderLinks();

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
      .attr("width", this.width)
      .attr("height", this.height)
      .style("background-color", "white")
      .style("border-radius", "20px");
  }

  /**
   * Initializes the zoom related behaviour.
   */
  initializeZoom(): void {
  
    // Create the zoom behaviour with zoomimg in/out functionality.
    let zoomBehaviour = d3.zoom<SVGSVGElement, unknown>().on("zoom", (event) => {
        
      if (this.zoomableGroupElement) {

        // Handle zoom.
        this.zoomableGroupElement.attr("transform", event.transform)

        // To help with optimization, lets only update visuals on intervals.
        // d3.js has a quantize function to help with this.
        let quantizedZoomDelegate: d3.ScaleQuantize<number, never> = d3.scaleQuantize([0, 1], [0, 0.2, 0.4, 0.6, 0.8, 1]);
        let quantizedZoom: number = quantizedZoomDelegate(event.transform.k);


        // Update visuals based on zoom level and if the value has actually changed.
        if (quantizedZoom < this.currentZoomLevel || quantizedZoom > this.currentZoomLevel) {

          this.currentZoomLevel = quantizedZoom;

          this.updateNodesOnZoom(quantizedZoom);
          this.updateTextOnZoom(quantizedZoom)
        }
      }
    })

    // If we have a base canvas, apply/call the zoom behaviour to the element.
    if (this.baseSvgCanvasElement) {

        this.baseSvgCanvasElement.call(zoomBehaviour.transform, 
          d3.zoomIdentity.translate(this.width / 4, this.height / 4)
                         .scale(this.initialZoomLevel))
                         .call(zoomBehaviour);
    }
  }

  /**
   * Render nodes.
   */
  renderNodes(): void {

    if (this.zoomableGroupElement) {

      // Create the node group.
      this.renderedNodeGroup = this.zoomableGroupElement.selectAll("node")
        .data(this.discoveryData.nodeData)
        .join("g")
        .attr("transform", nodeData => `translate(${(nodeData as any).x * this.width}, ${(nodeData as any).y * this.height})`)
        .on("click", (event, nodeData) => this.handleOnNodeClicked(nodeData))

      // Append a circle shape to the node group.
      this.renderedNodeGroup.append('circle')
        .attr("fill", this.nodeColor)
        .attr("r", this.nodeRadius)
        .attr("opacity", this.initialZoomLevel)

      // Append text to the node group.
      this.renderedNodeGroup.append("text")
        .text((nodeData) => nodeData.label)  
        .style("visibility", (nodeData) => nodeData.group === 1 ? "visible" : "hidden")
        .style("font-size", (nodeData) =>  {

          let fontSize = this.fontSize;

          if (nodeData.group === 1) {

            fontSize *= 50;
          }

          return fontSize;

        })
      }

      // Calling this to set the initial opacity (and inverse opacity).
      this.updateTextOnZoom(this.currentZoomLevel);
  }

  /**
   * Render links.
   */
  renderLinks(): void {

    if (this.zoomableGroupElement) {

      this.renderedLinks = this.zoomableGroupElement.append("g")
        .selectAll("line")
        .data(this.discoveryData.linkData)
        .join("line")
        .attr("x1", link => (this.getNodeById(link.source).x as number) * this.width)
        .attr("y1", link => (this.getNodeById(link.source).y as number) * this.height)
        .attr("x2", link => (this.getNodeById(link.target).x as number) * this.width)
        .attr("y2", link => (this.getNodeById(link.target).y as number) * this.height)
        .attr("stroke", this.linkColor)
        .attr("stroke-width", this.linkWidth)
        .attr("stroke-opacity", this.linkOpacity)
    } 
  }

  /**
   * Handles logic when a node is clicked.
   */
  handleOnNodeClicked(nodeClicked: IDiscoveryNodeData): void {
    this.toggleNode(nodeClicked.id);
    this.toggleLinks(nodeClicked.id);
  }

  /**
   * Modify required node properties to highlight node clicked.
   * @param nodeId Node id.
   */
  toggleNode(nodeId: string): void {

    if (this.renderedNodeGroup) {

      this.renderedNodeGroup.selectAll("circle")
      .filter((nodeData: any) => nodeData.id !== nodeId)
        .attr("r", this.nodeRadius)
        .attr("fill", this.nodeColor)
        .attr("opacity", 0.1)
        
      this.renderedNodeGroup.selectAll("circle")
        .filter((nodeData: any) => nodeData.id === nodeId)
          .attr("r", this.nodeRadius * 2)
          .attr("fill", this.selectedNodeColor)
          .attr("opacity", 1)
    }
  }

  /**
   * Modify required link properties to highlight related links to node.
   * @param nodeId Node id.
   */
  toggleLinks(nodeId: string): void {
    
    if (this.renderedLinks) {

      this.renderedLinks
        .attr("stroke", link => {

          let color = this.linkColor;
          
          if (nodeId === link.source || nodeId === link.target) {
            color = this.selectedLinkColor;
          }

          return color;
        })
        .attr("stroke-opacity", link => {

          let oapcity = this.linkOpacity;
          
          if (nodeId === link.source || nodeId === link.target) {
            
            oapcity = 1;
          }

          return oapcity;
        })
        .attr("stroke-width", link => {

          let width = this.linkWidth;
          
          if (nodeId === link.source || nodeId === link.target) {
            
            width = 1;
          }

          return width;
        })
    }
  }

  /**
   * Update nodes based on zoom level.
   * @param zoomValue Current zoom level.
   */
  updateNodesOnZoom(zoomValue: number) : void {

    if (this.renderedNodeGroup) {

      this.renderedNodeGroup.selectAll("circle")
        .attr("opacity", zoomValue)
    }
  }

  /**
   * Update text based on zoom level.
   * @param zoomValue Current zoom level.
   */
  updateTextOnZoom(zoomValue: number) : void {

    if (this.renderedNodeGroup) {

      this.renderedNodeGroup.selectAll("text")
        .style("visibility", (nodeData: any) => {

          let discoveryNodeData: IDiscoveryNodeData = nodeData as IDiscoveryNodeData;
          let visibility: string = "visible"

          if (discoveryNodeData.group === 2 && zoomValue < 1) {

            visibility = "hidden";
          }

          return visibility;
        })
        .attr("opacity", (nodeData: any) => {

          let discoveryNodeData: IDiscoveryNodeData = nodeData as IDiscoveryNodeData;
          let opacity: number = zoomValue;
          
          // Basically, make group 1 fade out as we zoom in, and make group 2 (the lowest layer group) fade in.
          if (discoveryNodeData.group == 1) {
            opacity = 1 - zoomValue;
          }
          else if (discoveryNodeData.group == 2) {
            opacity = zoomValue;
          }

          return opacity;

        })
    }

  }
}
