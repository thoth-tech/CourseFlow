import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DiscoveryPageComponent } from './discovery/discovery-page/discovery-page.component';
import { DiscoveryForceDirectedMapComponent } from './discovery/discovery-force-directed-map/discovery-force-directed-map.component';
import { DiscoveryClusterMapComponent } from './discovery/discovery-cluster-map/discovery-cluster-map.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    DiscoveryPageComponent,
    DiscoveryForceDirectedMapComponent,
    DiscoveryClusterMapComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
