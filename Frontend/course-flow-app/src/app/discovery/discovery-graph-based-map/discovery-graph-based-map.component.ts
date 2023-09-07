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
  zoomLevel: number = 0.5;

  // Edge Properties
  linkWidth: number = 0.1;
  linkOpacity: number = 0.1;
  linkColor: string = "black";
   
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

        this.zoomableGroupElement.attr("transform", event.transform)
      }

    })

    // If we have a base canvas, apply/call the zoom behaviour to the element.
    if (this.baseSvgCanvasElement) {

        this.baseSvgCanvasElement.call(zoomBehaviour.transform, 
          d3.zoomIdentity.translate(this.width / 4, this.height / 4)
                         .scale(this.zoomLevel))
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
        .attr("fill", "blue")
        .attr("r", 2)

      // Append text to the node group.
      this.renderedNodeGroup.append("text")
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

    this.toggleLinks(nodeClicked.id);
  }


  /**
   * Modify required link properties to highlight related links to node.
   * @param originNodeId Origin node id.
   * @param targetNodeId Target node id.
   */
  toggleLinks(nodeId: string): void {
    
    if (this.renderedLinks) {

      this.renderedLinks
        .attr("stroke", link => {

          let color = this.linkColor;
          
          if (nodeId === link.source || nodeId === link.target) {
            color = "blue"
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
}
