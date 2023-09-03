// Ngx-graph Imports
import { Layout, Graph, Edge } from '@swimlane/ngx-graph';

export class PositionBasedLayout implements Layout {

    positionScaleMultiplier: number = 100;

    /**
     * Handles setting the properties of the nodes to determine the overall layout.
     * @param graph 
     * @returns 
     */
    run(graph: Graph): Graph  {

        graph.nodes.forEach(node => {
            node.position = { 
                x: (node as any).x * this.positionScaleMultiplier, 
                y: (node as any).y * this.positionScaleMultiplier 
            };
        });


        return graph;
    }
  
    /**
     * 
     * @param graph 
     * @param edge 
     * @returns 
     */
    updateEdge(graph: Graph, edge: Edge): Graph {

        return graph;
    }
  }