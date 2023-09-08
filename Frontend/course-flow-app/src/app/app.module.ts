// Angular Imports
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

// Interface Improts
import { IDiscoveryDataServiceInjector } from 'src/app/interfaces/discoveryInterfaces'

// Service Imports
import { JsonFileDiscoveryDataService } from 'src/app/discovery/discovery-services/json-file-discovery-data.service'

// Routing Imports
import { AppRoutingModule } from './app-routing.module';

// Component Imports
import { AppComponent } from './app.component';
import { DiscoveryPageComponent } from './discovery/discovery-page/discovery-page.component';
import { DiscoveryGraphBasedMapComponent } from './discovery/discovery-graph-based-map/discovery-graph-based-map.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DiscoveryTextBasedListsComponent } from './discovery/discovery-text-based-lists/discovery-text-based-lists.component';

// Material UI Imports
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatChipsModule } from '@angular/material/chips';
import { MatRadioModule } from '@angular/material/radio';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatCardModule} from '@angular/material/card';
import {MatDividerModule} from '@angular/material/divider';
import { DiscoveryDetailedContentComponent } from './discovery/discovery-detailed-content/discovery-detailed-content.component';
import { DiscoveryConnectionSelectablesComponent } from './discovery/discovery-connection-selectables/discovery-connection-selectables.component';

@NgModule({
  declarations: [
    AppComponent,
    DiscoveryPageComponent,
    DiscoveryGraphBasedMapComponent,
    DiscoveryTextBasedListsComponent,
    DiscoveryDetailedContentComponent,
    DiscoveryConnectionSelectablesComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    MatDialogModule, MatButtonModule, MatIconModule, MatSidenavModule, 
    MatExpansionModule, MatChipsModule, MatRadioModule, MatGridListModule,
    MatCardModule, MatDividerModule
  ],
  providers: [
    { provide: IDiscoveryDataServiceInjector, useClass: JsonFileDiscoveryDataService }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
