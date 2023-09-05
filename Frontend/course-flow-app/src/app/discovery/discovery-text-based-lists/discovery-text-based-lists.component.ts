// Angular Imports
import { Component, Input, Inject } from '@angular/core';

// Interface Imports
import { IDiscoveryDataServiceInjector, IDiscoveryDataService } from 'src/app/interfaces/discoveryInterfaces';

// Enum Imports
import { EDiscoveryGroupUnitsBy } from "../../enum/discoveryEnums"

@Component({
  selector: 'app-discovery-text-based-lists',
  templateUrl: './discovery-text-based-lists.component.html',
  styleUrls: ['./discovery-text-based-lists.component.css']
})
export class DiscoveryTextBasedListsComponent {
  
  @Input() set groupUnitsBy(value: EDiscoveryGroupUnitsBy) {

  }

  constructor(@Inject(IDiscoveryDataServiceInjector) private discoveryDataService: IDiscoveryDataService) {

  }

  onViewMorePressed(): void {

  }

  onBackButtonPressed(): void {

  }
}
