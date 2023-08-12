import { Component } from '@angular/core';

@Component({
  selector: 'app-discovery-page',
  templateUrl: './discovery-page.component.html',
  styleUrls: ['./discovery-page.component.css']
})
export class DiscoveryPageComponent {
  
  // The map type to display
  mapType = "force-directed-v2";
}
