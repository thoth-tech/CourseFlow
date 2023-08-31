// Angular Imports
import { Component, Input, Inject } from '@angular/core';

// Interface Imports
import { IDiscoveryDataServiceInjector, IDiscoveryDataService, IDiscoveryHierarchicalData, IDiscoveryGraphProperties, IDiscoveryGraphUtilitiesService, IDiscoveryGraphUtilitiesServiceInjector } from 'src/app/interfaces/discoveryInterfaces';

// Enum Imports
import { EDiscoveryGroupUnitsBy } from "../../enum/discoveryEnums"

@Component({
  selector: 'app-discovery-graph-based-map',
  templateUrl: './discovery-graph-based-map.component.html',
  styleUrls: ['./discovery-graph-based-map.component.css']
})
export class DiscoveryGraphBasedMapComponent {

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

  }

}
