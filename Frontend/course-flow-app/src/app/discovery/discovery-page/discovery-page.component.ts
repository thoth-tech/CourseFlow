// Angular Imports
import { Component } from '@angular/core';

// Enum Imports
import { EDiscoveryGroupUnitsBy, EDiscoveryDisplayTypes } from "../../enum/discoveryEnums"


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
  displayTypeSelection: EDiscoveryDisplayTypes = EDiscoveryDisplayTypes.node_based_graph
}
