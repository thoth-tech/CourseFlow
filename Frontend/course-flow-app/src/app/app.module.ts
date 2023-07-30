import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DiscoveryPageComponent } from './discovery-page/discovery-page.component';
import { DiscoveryForceDirectedMapComponent } from './discovery-force-directed-map/discovery-force-directed-map.component';
import { DiscoveryClusterMapComponent } from './discovery-cluster-map/discovery-cluster-map.component';

@NgModule({
  declarations: [
    AppComponent,
    DiscoveryPageComponent,
    DiscoveryForceDirectedMapComponent,
    DiscoveryClusterMapComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
