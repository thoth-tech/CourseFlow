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
  previousRootNode: IDiscoveryNodeData[] = [] as IDiscoveryNodeData[];

  @Input() set groupUnitsBy(value: EDiscoveryGroupUnitsBy) {

    this.discoveryData = this.discoveryDataService.getDiscoveryData(value);

    // This logic unfortunetely will rely on the root node id being set as root.
    // TODO A better way is needed to for handling of this.
    this.currentRootNode = this.discoveryDataService.findDiscoveryNodeById("root")!;
  }

  constructor(@Inject(IDiscoveryDataServiceInjector) private discoveryDataService: IDiscoveryDataService) {

  }

  /**
   * Callback for when the view more button is pressed.
   * @param data Data of associated card pressed (this correspond to the node data).
   */
  onViewMorePressed(id: string): void {

    this.previousRootNode.push(this.currentRootNode);
    this.currentRootNode = this.discoveryDataService.findDiscoveryNodeById(id)!;
  }

  /**
   * Callback for when the back button is pressed.
   */
  onBackButtonPressed(): void {

    if (this.previousRootNode.length !== 0) {
      this.currentRootNode = this.previousRootNode.pop()!;
    }
  }

  /**
   * Gets the node label from a node associated with the provided id.
   * @param id Id of the node we want to get the label of.
   */
  getConnectionLabel(id: string): string {
  
    let label = "";
    let foundNode: IDiscoveryNodeData | undefined = this.discoveryDataService.findDiscoveryNodeById(id);

    if (foundNode) {
      label = foundNode.label;
    }

    return label;
  }
}
