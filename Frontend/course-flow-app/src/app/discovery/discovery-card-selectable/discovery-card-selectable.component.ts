import { Component, Input, Inject } from '@angular/core';

// Interface Imports
import { IConnectionData, IDiscoveryNodeData, IDiscoveryDataServiceInjector, IDiscoveryDataService } from 'src/app/interfaces/discoveryInterfaces';

@Component({
  selector: 'app-discovery-card-selectable',
  templateUrl: './discovery-card-selectable.component.html',
  styleUrls: ['./discovery-card-selectable.component.css']
})
export class DiscoveryCardSelectableComponent {

  @Input() connections: IConnectionData[]  = [] as IConnectionData[]; 

  constructor(@Inject(IDiscoveryDataServiceInjector) private discoveryDataService: IDiscoveryDataService) {

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


  /**
   * Response to view more being pressed.
   * @param id Id of associated card pressed.
   */
  onViewMorePressed(id: string): void {

    this.discoveryDataService.onDetailedConnectionClicked(id);
  }
}
