// Angular Imports
import { Component, Input } from '@angular/core';

// Data Type Imports
import { IDiscoveryHierarchicalData } from 'src/app/interfaces/discoveryInterfaces';

// Enum Imports
import { EDiscoveryGroupUnitsBy } from "../../enum/discoveryEnums"

// Services Imports
import { DiscoveryService } from 'src/app/discovery.service';

@Component({
  selector: 'app-discovery-text-based-lists',
  templateUrl: './discovery-text-based-lists.component.html',
  styleUrls: ['./discovery-text-based-lists.component.css']
})
export class DiscoveryTextBasedListsComponent {
  
  // Params from the parent component
  @Input() set groupUnitsBy(value: EDiscoveryGroupUnitsBy) {

    this.unitData = this.discoveryService.getDiscoveryUnitData(value);
    this.previousData = [];
  }

  // Tracking the unit data.
  previousData: IDiscoveryHierarchicalData[];
  unitData: IDiscoveryHierarchicalData;

  constructor(private discoveryService: DiscoveryService) {

    this.unitData = this.discoveryService.getDiscoveryUnitData(this.groupUnitsBy);
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
