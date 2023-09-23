// Angular Imports
import { Component, Input, Inject } from '@angular/core';

// Interface Imports
import { IDiscoveryDataServiceInjector, IDiscoveryDataService, IDiscoveryData, IDiscoveryNodeData, IDiscoveryLinkData } from 'src/app/interfaces/discoveryInterfaces';

// Enum Imports
import { EDiscoveryGroupUnitsBy } from "../../enum/discoveryEnums"

@Component({
  selector: 'app-discovery-text-based-lists',
  templateUrl: './discovery-text-based-lists.component.html',
  styleUrls: ['./discovery-text-based-lists.component.css']
})
export class DiscoveryTextBasedListsComponent {
  
  discoveryData: IDiscoveryData = {} as IDiscoveryData;

  // Node data trackers.
  currentRootNode:IDiscoveryNodeData = {} as IDiscoveryNodeData;

  @Input() set groupUnitsBy(value: EDiscoveryGroupUnitsBy) {

    this.discoveryData = this.discoveryDataService.getDiscoveryData(value);

    // This logic unfortunetely will rely on the root node id being set as root.
    // TODO A better way is needed to for handling of this.
    this.currentRootNode = this.discoveryDataService.findDiscoveryNodeById("root")!;
  }

  constructor(@Inject(IDiscoveryDataServiceInjector) private discoveryDataService: IDiscoveryDataService) {
    
    // This will allow us to respond to nested events in child components.
    this.discoveryDataService.nodeSelectedEvent$.subscribe((node) => this.onViewMorePressed(node));
  }

  /**
   * Callback for when the view more button is pressed.
   * @param node Selected node.
   */
  onViewMorePressed(node: IDiscoveryNodeData): void {

    this.currentRootNode = node!;


  }
}
