// Angular Imports
import { Component, Input, Inject } from '@angular/core';

// Interface Imports
import { IDiscoveryDataServiceInjector, IDiscoveryDataService, IDiscoveryHierarchicalData } from 'src/app/interfaces/discoveryInterfaces';

// Enum Imports
import { EDiscoveryGroupUnitsBy } from "../../enum/discoveryEnums"

@Component({
  selector: 'app-discovery-text-based-lists',
  templateUrl: './discovery-text-based-lists.component.html',
  styleUrls: ['./discovery-text-based-lists.component.css']
})
export class DiscoveryTextBasedListsComponent {
  
  // Params from the parent component
  @Input() set groupUnitsBy(value: EDiscoveryGroupUnitsBy) {

    this.unitData = this.discoveryDataService.getDiscoveryHierarchicalData(value);
    this.previousData = [];
  }

  // Tracking the unit data.
  previousData: IDiscoveryHierarchicalData[];
  unitData: IDiscoveryHierarchicalData;

  constructor(@Inject(IDiscoveryDataServiceInjector) private discoveryDataService: IDiscoveryDataService) {

    this.unitData = this.discoveryDataService.getDiscoveryHierarchicalData(this.groupUnitsBy);
    this.previousData = [];
  }

  /**
   * 
   * @param data 
   */
  onViewMorePressed(data: IDiscoveryHierarchicalData): void {
    
    this.previousData.push(this.unitData)
    this.unitData = data
  }

  /**
   * 
   */
  onBackButtonPressed(): void {

    let previousDataSize = this.previousData.length

    if (previousDataSize > 0) {

      let data = this.previousData.pop();

      if (data) {
        
        this.unitData = data;
      }
      
    }

  }
}
