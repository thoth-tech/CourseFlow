import { Component } from '@angular/core';

enum EDiscoveryGroupUnitsBy {
  faculty,
  degree,
  related_units
}

enum EDiscoveryDisplayTypes {
  node_based_graph,
  text_based_lists
}

@Component({
  selector: 'app-discovery-page',
  templateUrl: './discovery-page.component.html',
  styleUrls: ['./discovery-page.component.css']
})
export class DiscoveryPageComponent {
  
  // Enum to define the different options available for the discovery page.
  discoveryGroupUnitsBy = EDiscoveryGroupUnitsBy
  discoveryDisplayTypes = EDiscoveryDisplayTypes

  // Tracking the current enum states.
  groupBySelection: EDiscoveryGroupUnitsBy = EDiscoveryGroupUnitsBy.faculty;
  displayTypeSelection: EDiscoveryDisplayTypes = EDiscoveryDisplayTypes.text_based_lists
}
