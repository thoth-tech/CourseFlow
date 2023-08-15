// Angular Imports
import { Component } from '@angular/core';

// Data Type Imports
import { IDiscoveryHierarchicalData, IDiscoveryGraphProperties } from 'src/app/interfaces/discoveryInterfaces';

// Services Imports
import { DiscoveryService } from 'src/app/discovery.service';

// Third-Party Imports
import * as d3 from "d3";


@Component({
  selector: 'app-discovery-faculty-based-map',
  templateUrl: './discovery-faculty-based-map.component.html',
  styleUrls: ['./discovery-faculty-based-map.component.css']
})
export class DiscoveryFacultyBasedMapComponent {

  nodeProperties: IDiscoveryGraphProperties = {
    
    forceManyBodyStrength: {
      "0": 0,
      "1": -20,
      "2": -50,
      "3": -100
    },
    linkDistance: {
      "0": 1,
      "1": 5,
      "2": 10,
      "3": 20
    },
    nodeRadius: {
      "0": 50,
      "1": 20,
      "2": 5,
      "3": 1
    }
  }
  

  /**
   * Constructor for the component.
   * @param discoveryService Injected discovery service
   */
  constructor(private discoveryService: DiscoveryService) {

  }

  /**
   * Called after component is created.
   */
  ngOnInit(): void {

    this.createDiscoveryMap();
  }

  /**
   * Create the discovery map.
   */
  createDiscoveryMap(): void {

    // Create the svg canvas element.
    let baseSvgCanvasElement = this.createBaseCanvas();

    // To be able to zoom inside the base canvas, we need to attach a group element to the canvas.
    let zoomableGroupElement = baseSvgCanvasElement.append("g");

    // Create the zoom behaviour and call it.
    let zoomBehaviour = this.createZoomBehaviour(zoomableGroupElement);
    baseSvgCanvasElement
      .call(zoomBehaviour.transform, d3.zoomIdentity.translate(400, 400).scale(0.3))
      .call(zoomBehaviour);

      // Start graph simulation
      this.startGraphSimulation(zoomableGroupElement);
    }

  /**
   * Create the base svg canvas and return it.
   * @returns Base svg canvas element.
   */
  createBaseCanvas(): d3.Selection<SVGSVGElement, unknown, HTMLElement, any> {

    return d3
      .select("div#facultyBasedMap")
      .append("svg")
      .attr("width", 1000)
      .attr("height", 1000)
      .style("background-color", "#ececec")
      .style("border-radius", "20px");
  }

  /**
   * Create and return a zoom behaviour.
   * @param zoomableElement Element that we to apply zooming functionality to.
   * @returns Returns a zoomable behaviour.
   */
  createZoomBehaviour(zoomableElement:d3.Selection<SVGGElement, unknown, HTMLElement, any>): d3.ZoomBehavior<SVGSVGElement, unknown> {
  
    return d3
      .zoom<SVGSVGElement, unknown>()
      .on("zoom", (event) => {
        
        // Control the transform of the zoomable element
        zoomableElement.attr("transform", event.transform)
    })
  }

  /**
   * Starts a physics simulation to layout the nodes.
   * @param parentNode Parent element to attach nodes to.
   */
  startGraphSimulation(parentElement:d3.Selection<SVGGElement, unknown, HTMLElement, any>): void {

    const root: d3.HierarchyNode<IDiscoveryHierarchicalData> = d3.hierarchy<IDiscoveryHierarchicalData>(this.discoveryService.getDiscoveryUnitData())
    const links: d3.HierarchyLink<IDiscoveryHierarchicalData>[] = root.links();
    const nodes: d3.HierarchyNode<IDiscoveryHierarchicalData>[] = root.descendants();

    const sim = d3.forceSimulation(nodes as d3.SimulationNodeDatum[])
      .force("link", 
        d3.forceLink(links as d3.SimulationLinkDatum<d3.SimulationNodeDatum>[])
          .id((nodeData: d3.SimulationNodeDatum) => {

            let nodeDataAsHierarchicalData = (nodeData as any).data as IDiscoveryHierarchicalData
            return nodeDataAsHierarchicalData.id
          })
          .distance((linkData: d3.SimulationLinkDatum<d3.SimulationNodeDatum>) => { 

              let nodeData: IDiscoveryHierarchicalData = (linkData.source as any).data as IDiscoveryHierarchicalData;
              return this.nodeProperties.linkDistance[nodeData.group];

            })
          .strength(2))
      .force("charge", 
        d3.forceManyBody()
        .strength((nodeData: d3.SimulationNodeDatum) => {
          
          let nodeDataAsHierarchicalData = (nodeData as any).data as IDiscoveryHierarchicalData
          return this.nodeProperties.forceManyBodyStrength[nodeDataAsHierarchicalData.group]
        }))
      .force("x", d3.forceX())
      .force("y", d3.forceY())
      .force("center", d3.forceCenter(1000 / 2, 1000 / 2))

    const link = parentElement.append("g")
      .attr("stroke", "red")
      .attr("stroke-width", 0.2)
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(links)
      .join("line")

    const node = parentElement.append("g")
      .selectAll("circle")
      .data(nodes)
      .join("circle")
      .attr("fill", "black")
      .attr("r", (nodeData: d3.HierarchyNode<IDiscoveryHierarchicalData>) => this.nodeProperties.nodeRadius[nodeData.data.group])
      

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
}
