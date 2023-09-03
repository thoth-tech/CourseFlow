/**
 * This is a custom layout that uses pre-calculated x and y positions.
 * Use scale to scale the values up since they are all normalized.
 * Nodes will appear according to positions.
 * At this point in time, the edges/links will not appear.
 *  - This is either a bug.
 *  - Or there is a specific technique to allow edges to appear in custom layouts.
 */

// Ngx-graph Imports
import { Layout, Graph, Edge } from '@swimlane/ngx-graph';

export class PositionBasedLayout implements Layout {

    // Scaler to help scale the normalized positions of the nodes.
    positionScaleMultiplier: number = 100;

    // For some reason, the run method is called 4 times which causes problems where the edges are gone in the final call.
    // This boolean will stop the run method after the first call.
    layoutHasRun: Boolean = false;

    // Cached graph.
    graph: Graph = {} as Graph;

    run(graph: Graph): Graph  {
   
        if (this.layoutHasRun) {

            return this.graph;
        }

        // Stops this from running more than once.
        this.layoutHasRun = true;

        // Update the x and y positions used by the library with the pre-calculated x and y positions.
        graph.nodes.forEach(node => {
            node.position = { 
                x: (node as any).x * this.positionScaleMultiplier, 
                y: (node as any).y * this.positionScaleMultiplier 
            };
        });

        // Update the positions of the edges.
        graph.edges.forEach((edge) => {

            this.updateEdge(graph, edge)
        })

        // Cache the graph based on the first run call.
        this.graph = graph;


        console.log(this.graph.edges)
        return this.graph;
    }
  
    updateEdge(graph: Graph, edge: Edge): Graph {

        const sourceNode = graph.nodes.find(node => node.id === edge.source);
        const targetNode = graph.nodes.find(node => node.id === edge.target);

        const edgeStartPosition = {
            x: sourceNode?.position?.x,
            y: sourceNode?.position?.y
        }

        const edgeTargetPosition = {
            x: targetNode?.position?.x,
            y: targetNode?.position?.y
        }

        edge.points = [edgeStartPosition, edgeTargetPosition];

        return graph;
    }
  }