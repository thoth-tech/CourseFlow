// Angular Imports
import { Component, Input, Inject } from '@angular/core';

// Interface Imports
import { IDiscoveryDataServiceInjector, IDiscoveryDataService, IDiscoveryHierarchicalData, IDiscoveryGraphProperties, IDiscoveryGraphZoomLevelProperties, IDiscoveryGraphUtilitiesService, IDiscoveryGraphUtilitiesServiceInjector } from 'src/app/interfaces/discoveryInterfaces';

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

  // Contains all graph related visual properties.
  graphProperties: IDiscoveryGraphProperties = {} as IDiscoveryGraphProperties;
  currentGraphZoomLevelProperties: IDiscoveryGraphZoomLevelProperties = {} as IDiscoveryGraphZoomLevelProperties;
  currentZoomLevel = 0;

  // Current group by unit enum value
  currentGroupByUnitValue: EDiscoveryGroupUnitsBy = EDiscoveryGroupUnitsBy.faculty;

  // Original/base nodes hierarchy cache.
  originalHierarchicalData: IDiscoveryHierarchicalData = {} as IDiscoveryHierarchicalData;
  originalRoot: d3.HierarchyNode<IDiscoveryHierarchicalData> = {} as d3.HierarchyNode<IDiscoveryHierarchicalData>;

  // Current node related properties containing the core link and node data - not to be confused with the node and link visuals.
  currentRoot: d3.HierarchyNode<IDiscoveryHierarchicalData> = {} as d3.HierarchyNode<IDiscoveryHierarchicalData>;
  currentLinks: d3.HierarchyLink<IDiscoveryHierarchicalData>[] = [];
  currentNodes: d3.HierarchyNode<IDiscoveryHierarchicalData>[] = [];

  // Canvas, node and link visuals.
  baseSvgCanvasElement: d3.Selection<SVGSVGElement, unknown, HTMLElement, any> | null = null;
  zoomableGroupElement: d3.Selection<SVGGElement, unknown, HTMLElement, any> | null = null;
  currentRenderedNodes: d3.Selection<SVGGElement | d3.BaseType, d3.HierarchyNode<IDiscoveryHierarchicalData>, SVGGElement, unknown> | null = null;;
  currentRenderedLinks: d3.Selection<SVGGElement | d3.BaseType, d3.HierarchyLink<IDiscoveryHierarchicalData>, SVGGElement, unknown> | null = null;

  // Simulation.
  sim: d3.Simulation<d3.SimulationNodeDatum, undefined> | null = null;

  /**
   * Constructor for the component.
   * @param discoveryDataService Injected discovery data service.
   */
  constructor(@Inject(IDiscoveryDataServiceInjector) private discoveryDataService: IDiscoveryDataService,
              @Inject(IDiscoveryGraphUtilitiesServiceInjector) private discoveryGraphUtilitiesService: IDiscoveryGraphUtilitiesService) {
  }

  /**
   * Input for group units by param.
   */
  @Input() set groupUnitsBy(value: EDiscoveryGroupUnitsBy) {

    // Cache the current group by units enum
    this.currentGroupByUnitValue = value;

    // Get the graph properties.
    this.graphProperties = this.discoveryGraphUtilitiesService.getGraphBaseProperties();
    this.currentGraphZoomLevelProperties = this.graphProperties.zoomLevelProperties["0"];

    // Get the data
    this.originalHierarchicalData = this.discoveryDataService.getDiscoveryHierarchicalData(this.currentGroupByUnitValue);
    
    // Set the original root node which we can use later if needed (such as getting the node descendents etc).
    this.originalRoot = d3.hierarchy<IDiscoveryHierarchicalData>(this.originalHierarchicalData);

    // Reset graph with new data.
    this.resetGraphWithNewData(this.originalHierarchicalData);
  }

  /**
   * Create the discovery map.
   */
  createDiscoveryMap(): void {

    // If sim exists, stop the sim in case it is still running it.
    if (this.sim) {
      this.sim.stop();
    }

    // Remove canvas if aleady exists
    if (this.baseSvgCanvasElement) {
      this.baseSvgCanvasElement.remove()
    }

    // Create the svg canvas element.
    this.baseSvgCanvasElement = this.createBaseCanvas();

    // To be able to zoom inside the base canvas, we need to attach a group element to the canvas.
    this.zoomableGroupElement = this.baseSvgCanvasElement.append("g");

    // Start graph simulation.
    this.startGraphSimulation(this.zoomableGroupElement);

    // Handle zooming capabilities.
    this.handleZoom(this.zoomableGroupElement, this.baseSvgCanvasElement); 
  }

  /**
   * Create the base svg canvas and return it.
   * @returns Base svg canvas element.
   */
  createBaseCanvas(): d3.Selection<SVGSVGElement, unknown, HTMLElement, any> {

    return d3
      .select("div#graphBasedMap")
      .append("svg")
      .attr("width", this.graphProperties.width)
      .attr("height", this.graphProperties.height)
      .style("background-color", this.graphProperties.canvasColor)
      .style("border-radius", this.graphProperties.canvasBorderRadius);
  }

  /**
   * Handle the zoom related behaviour.
   * @param zoomableElement Element that we want to apply zooming functionality to.
   * @param baseSvgCanvasElement Base canvas which will facilitate the zoom behaviour..
   */
  handleZoom(zoomableElement:d3.Selection<SVGGElement, unknown, HTMLElement, any>, 
             baseSvgCanvasElement: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>): void {
  
    // Create the zoom behaviour for the zoomable element.
    let zoomBehaviour = d3.zoom<SVGSVGElement, unknown>().on("zoom", (event) => {
        
        // Work out the zoom level and change graph properties.
        // TODO Requires improvement in terms of flexibility.
        if (this.currentZoomLevel != 0 && event.transform.k <= 0.8) {
          this.currentZoomLevel = 0
          this.currentGraphZoomLevelProperties = this.graphProperties.zoomLevelProperties["0"]
          this.modifyElementsAtZoomLevel();
        }
        else if (this.currentZoomLevel != 1 && event.transform.k > 0.8) {
          this.currentZoomLevel = 1;
          this.currentGraphZoomLevelProperties = this.graphProperties.zoomLevelProperties["1"]
          this.modifyElementsAtZoomLevel();
        }

        // Control the transform of the zoomable element.
        zoomableElement.attr("transform", event.transform)
    })

    // To get the zoom behaviour to work, we need to get the base canvas to call the behaviour.
    baseSvgCanvasElement.call(zoomBehaviour.transform, d3.zoomIdentity.translate(
                              this.graphProperties.width / 2 + this.graphProperties.iniitialCanvasTranslationOffsetX, 
                              this.graphProperties.height / 2 + this.graphProperties.iniitialCanvasTranslationOffsetY)
                              .scale(this.discoveryGraphUtilitiesService.calculateInitialZoom(this.currentNodes, this.originalRoot.descendants())))
                        .call(zoomBehaviour);
  }

  /**
   * Starts a physics simulation to layout the nodes.
   * @param parentNode Parent element to attach nodes to.
   */
  startGraphSimulation(parentElement:d3.Selection<SVGGElement, unknown, HTMLElement, any>): void {

    // Create the physics simulation and apply different types of forces.
    this.sim = d3.forceSimulation(this.currentNodes as d3.SimulationNodeDatum[])
                  .force("link", d3.forceLink(this.currentLinks as d3.SimulationLinkDatum<d3.SimulationNodeDatum>[])
                                   .id((nodeData: d3.SimulationNodeDatum) => this.getNodeAsDiscoveryHierarchicalData(nodeData).id)
                                   .distance((linkData: any) => this.discoveryGraphUtilitiesService.calculateLinkDistance(linkData))
                                   .strength(1))
                  .force("charge", d3.forceManyBody()
                                     .strength(this.discoveryGraphUtilitiesService.calculateForceStrength(this.currentRoot)))
        

    // Create the links using the links data.
    this.currentRenderedLinks = parentElement.append("g")
      .selectAll("line")
      .data(this.currentLinks)
      .join("line")
      .attr("stroke", "black")
      .attr("stroke-width", (linkData: d3.HierarchyLink<IDiscoveryHierarchicalData>) => this.currentGraphZoomLevelProperties.linkWidth[this.getNodeAsDiscoveryHierarchicalData(linkData.source).group])
      .attr("stroke-opacity", (linkData: d3.HierarchyLink<IDiscoveryHierarchicalData>) => this.currentGraphZoomLevelProperties.linkOpacity[this.getNodeAsDiscoveryHierarchicalData(linkData.source).group])

    // Create a node group, based on the node data. 
    // We can add shapes and text to this group.
    this.currentRenderedNodes = parentElement.selectAll("node")
      .data(this.currentNodes)
      .join("g")
      .on("click", (event: PointerEvent, node: d3.HierarchyNode<IDiscoveryHierarchicalData>) => this.showUnitDetailedGraph(event, node))

    // Append a circle shape to the node group.
    this.currentRenderedNodes.append('circle')
      .attr("fill", (nodeData: d3.HierarchyNode<IDiscoveryHierarchicalData>) => this.currentGraphZoomLevelProperties.nodeColor[nodeData.data.group])
      .attr("r", (nodeData: d3.HierarchyNode<IDiscoveryHierarchicalData>) => this.currentGraphZoomLevelProperties.nodeRadius[nodeData.data.group])
    
    // Append text to the node group.
    this.currentRenderedNodes.append("text")
      .text((nodeData: d3.HierarchyNode<IDiscoveryHierarchicalData>) => this.getNodeAsDiscoveryHierarchicalData(nodeData).name)          
      .attr('x', (nodeData: d3.HierarchyNode<IDiscoveryHierarchicalData>) => this.currentGraphZoomLevelProperties.textXOffset[this.getNodeAsDiscoveryHierarchicalData(nodeData).group])
      .attr('y', (nodeData: d3.HierarchyNode<IDiscoveryHierarchicalData>) => this.currentGraphZoomLevelProperties.textYOffset[this.getNodeAsDiscoveryHierarchicalData(nodeData).group])
      .style('font-size', (nodeData: d3.HierarchyNode<IDiscoveryHierarchicalData>) => this.currentGraphZoomLevelProperties.textFontSize[this.getNodeAsDiscoveryHierarchicalData(nodeData).group])
      .style('font-weight', (nodeData: d3.HierarchyNode<IDiscoveryHierarchicalData>) => this.currentGraphZoomLevelProperties.textFontWieight[this.getNodeAsDiscoveryHierarchicalData(nodeData).group])

    // Start the actual simulation tick.
    this.sim.on("tick", () => {

      // Set up the link line positions using (x, y) coordinates for source and target nodes - these are calculated from the physics simulation.
      if (this.currentRenderedLinks != null) {

        this.currentRenderedLinks
        .attr("x1", (linkData: d3.HierarchyLink<IDiscoveryHierarchicalData>) => (linkData.source as d3.SimulationNodeDatum).x || 0)
        .attr("y1", (linkData: d3.HierarchyLink<IDiscoveryHierarchicalData>) => (linkData.source as d3.SimulationNodeDatum).y || 0)
        .attr("x2", (linkData: d3.HierarchyLink<IDiscoveryHierarchicalData>) => (linkData.target as d3.SimulationNodeDatum).x || 0)
        .attr("y2", (linkData: d3.HierarchyLink<IDiscoveryHierarchicalData>) => (linkData.target as d3.SimulationNodeDatum).y || 0)
      }

      // Set up node positions based on their (x, y) coordinates - calculated from physics simulation.
      if (this.currentRenderedNodes != null) {

        this.currentRenderedNodes.attr("transform", (nodeData: d3.HierarchyNode<IDiscoveryHierarchicalData>) => `translate(${(nodeData as d3.SimulationNodeDatum).x || 0}, ${(nodeData as d3.SimulationNodeDatum).y || 0})`);
      }

      // Stopping the sim after a certain point - can remove this if allowing users to move nodes around.
      if (this.sim && this.sim.alpha() < 0.05) {
        this.sim.stop();
      }
    })
  }

  /**
   * Gets/casts node data to type IDiscoveryHierarchicalData.
   * @param nodeData Node data
   * @returns Node as IDiscoveryHierarchicalData
   */
  getNodeAsDiscoveryHierarchicalData(nodeData: any): IDiscoveryHierarchicalData {
    return nodeData.data as IDiscoveryHierarchicalData;
  }

  /**
   * Modify rendered node and link properties based on zoom level.
   */
  modifyElementsAtZoomLevel(): void {

    // Modify node properties
    if (this.currentRenderedNodes) {

      this.currentRenderedNodes.select('circle')
        .attr("fill", (nodeData: d3.HierarchyNode<IDiscoveryHierarchicalData>) => this.currentGraphZoomLevelProperties.nodeColor[nodeData.data.group])
        .attr("r", (nodeData: d3.HierarchyNode<IDiscoveryHierarchicalData>) => this.currentGraphZoomLevelProperties.nodeRadius[nodeData.data.group])

      this.currentRenderedNodes.select("text")
        .text((nodeData: d3.HierarchyNode<IDiscoveryHierarchicalData>) => this.getNodeAsDiscoveryHierarchicalData(nodeData).name)          
        .attr('x', (nodeData: d3.HierarchyNode<IDiscoveryHierarchicalData>) => this.currentGraphZoomLevelProperties.textXOffset[this.getNodeAsDiscoveryHierarchicalData(nodeData).group])
        .attr('y', (nodeData: d3.HierarchyNode<IDiscoveryHierarchicalData>) => this.currentGraphZoomLevelProperties.textYOffset[this.getNodeAsDiscoveryHierarchicalData(nodeData).group])
        .style('font-size', (nodeData: d3.HierarchyNode<IDiscoveryHierarchicalData>) => this.currentGraphZoomLevelProperties.textFontSize[this.getNodeAsDiscoveryHierarchicalData(nodeData).group])
        .style('font-weight', (nodeData: d3.HierarchyNode<IDiscoveryHierarchicalData>) => this.currentGraphZoomLevelProperties.textFontWieight[this.getNodeAsDiscoveryHierarchicalData(nodeData).group])
    }

    // Modify line properties
    if (this.currentRenderedLinks) {
      
      this.currentRenderedLinks
        .attr("stroke-width", (linkData: d3.HierarchyLink<IDiscoveryHierarchicalData>) => this.currentGraphZoomLevelProperties.linkWidth[this.getNodeAsDiscoveryHierarchicalData(linkData.source).group])
        .attr("stroke-opacity", (linkData: d3.HierarchyLink<IDiscoveryHierarchicalData>) => this.currentGraphZoomLevelProperties.linkOpacity[this.getNodeAsDiscoveryHierarchicalData(linkData.source).group])
    }
  }

  /**
   * Shows a new graph for a node with its own specific connections and information.
   */
  showUnitDetailedGraph(event: PointerEvent, node: d3.HierarchyNode<IDiscoveryHierarchicalData>): void {

    this.resetGraphWithNewData(node.data);
  }

  /**
   * Resets the graph to the original graph with all the nodes.
   */
  resetGraphToOriginalData(): void {

    this.resetGraphWithNewData(this.originalHierarchicalData);
  }

  /**
   * Resets the graph with data provided.
   */
  resetGraphWithNewData(data: IDiscoveryHierarchicalData): void {

    // Get the detailed data by id
    this.currentRoot = d3.hierarchy<IDiscoveryHierarchicalData>(data);
    this.currentLinks = this.currentRoot.links();
    this.currentNodes  = this.currentRoot.descendants();

    // Create the discovery map.
    this.createDiscoveryMap();
  }
}
