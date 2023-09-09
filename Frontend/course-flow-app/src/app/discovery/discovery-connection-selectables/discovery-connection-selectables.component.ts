// Angular Imports
import { Component, Inject, Input } from '@angular/core';

// Interface Imports
import { IDiscoveryDataService, IDiscoveryDataServiceInjector, IConnectionData, IDiscoveryNodeData } from 'src/app/interfaces/discoveryInterfaces';

@Component({
  selector: 'app-discovery-connection-selectables',
  templateUrl: './discovery-connection-selectables.component.html',
  styleUrls: ['./discovery-connection-selectables.component.css']
})
export class DiscoveryConnectionSelectablesComponent {

  @Input() connectionsData: IConnectionData[] | undefined = [] as IConnectionData[]; 
  
  constructor(@Inject(IDiscoveryDataServiceInjector) private discoveryDataService: IDiscoveryDataService) {}

  /**
   * Event for when the connection button is pressed.
   * @param id Id of the connection-node data clicked.
   */
  onConnectionButtonClicked(id: string) {

    this.discoveryDataService.onDetailedConnectionClicked(id);
  }

  /**
   * Gets the node label from a node associated with the provided id.
   * @param id Id of the node we want to get the label of.
   */
  getNodeLabel(id: string): string {
    
    let label = "";
    let foundNode: IDiscoveryNodeData | undefined = this.discoveryDataService.findDiscoveryNodeById(id);

    if (foundNode) {
      label = foundNode.label;
    }

    return label;
  }
}
