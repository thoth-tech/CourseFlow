import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DiscoveryPageComponent } from './discovery/discovery-page/discovery-page.component';
import { DiscoveryForceDirectedMapComponent } from './discovery/discovery-force-directed-map/discovery-force-directed-map.component';
import { DiscoveryClusterMapComponent } from './discovery/discovery-cluster-map/discovery-cluster-map.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DiscoveryDetailDialogComponent } from './discovery/discovery-detail-dialog/discovery-detail-dialog.component';

import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';

@NgModule({
  declarations: [
    AppComponent,
    DiscoveryPageComponent,
    DiscoveryForceDirectedMapComponent,
    DiscoveryClusterMapComponent,
    DiscoveryDetailDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatDialogModule, MatButtonModule, MatIconModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
