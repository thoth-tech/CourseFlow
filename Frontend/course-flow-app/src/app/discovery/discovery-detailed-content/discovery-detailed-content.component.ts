// Angular Imports
import { Component, Input } from '@angular/core';

// Interface Imports
import { IDiscoveryNodeData } from 'src/app/interfaces/discoveryInterfaces';

@Component({
  selector: 'app-discovery-detailed-content',
  templateUrl: './discovery-detailed-content.component.html',
  styleUrls: ['./discovery-detailed-content.component.css']
})
export class DiscoveryDetailedContentComponent {

  @Input() detailedData!: IDiscoveryNodeData; 
}
