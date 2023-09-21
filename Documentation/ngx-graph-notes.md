# NGX-Graph Notes

### Force Directed Graph

- Simple to use.
- Works nicely for small amounts of nodes.
- Extremely slow when dealing with large data.

### Using Custom Layouts

- I wanted to set pre-calculated positions manually.
- Nodes appear and seems to line up with positions.
- Could not get edges to appear.
- Strange behaviour where the run method is called 4 times.
- Strange behaviour where logging graph.edges shows the edges but logging the graph object shows edges as empty.

### Updating Positions after Dagre Calculations are Done
- Strange behavour when accessing properties.
  - Logging the nodes object shows a position array.
  - However, logging node.position comes up with undefined.
  - As such, cannot update nodes after the their internal calculations are done.

### Conclusions
- At this point in time, ngx-graph is not viable for the goals of CourseFlow.
- Not enough documentation around this library.
- Examples online are lacking.
- d3.js, if you know how to use it, is much better and flexible than this library.
- Until ngx-graph is updated, I think it will be better to work with d3.js and make components more flexible (essentially creating our own version of ngx-graph).