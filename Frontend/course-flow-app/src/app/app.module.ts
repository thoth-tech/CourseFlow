// Angular Imports
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Interface Improts
import { IDiscoveryDataServiceInjector } from 'src/app/interfaces/discoveryInterfaces'

// Service Imports
import { JsonFileDiscoveryDataService } from 'src/app/discovery/discovery-services/json-file-discovery-data.service'

// Routing Imports
import { AppRoutingModule } from './app-routing.module';

// App Component Imports
import { AppComponent } from './app.component';

// Course Map Component Imports
import { HeaderComponent } from './header/header.component';
import { UnitCardComponent } from './unit-card/unit-card.component';
import { UnitcardContainerComponent } from './unitcard-container/unitcard-container.component';
import { MainSideNavComponent } from './main-side-nav/main-side-nav.component';
import { TrimesterContainerComponent } from './trimester-container/trimester-container.component';
import { YearContainerComponent } from './year-container/year-container.component';
import { UnitDetailDialogComponent } from './unit-detail-dialog/unit-detail-dialog.component';
import { NotFoundComponent } from './main-side-nav/pages/not-found/not-found.component';
import { MajorMinorComponent } from './main-side-nav/pages/majorminor/majorminor.component';
import { EditComponent } from './main-side-nav/pages/edit/edit.component';
import { NotificationsComponent } from './main-side-nav/pages/notifications/notifications.component';
import { CourseUpdatesComponent } from './main-side-nav/pages/courseupdates/courseupdates.component';

// Discovery Component Imports
import { DiscoveryPageComponent } from './discovery/discovery-page/discovery-page.component';
import { DiscoveryGraphBasedMapComponent } from './discovery/discovery-graph-based-map/discovery-graph-based-map.component';
import { DiscoveryTextBasedListsComponent } from './discovery/discovery-text-based-lists/discovery-text-based-lists.component';
import { DiscoveryDetailedContentComponent } from './discovery/discovery-detailed-content/discovery-detailed-content.component';
import { DiscoveryConnectionSelectablesComponent } from './discovery/discovery-connection-selectables/discovery-connection-selectables.component';
import { DiscoveryCardSelectableComponent } from './discovery/discovery-card-selectable/discovery-card-selectable.component';

// Material UI Imports
import { MatExpansionModule } from '@angular/material/expansion';
import { MatChipsModule } from '@angular/material/chips';
import { MatRadioModule } from '@angular/material/radio';
import { MatGridListModule } from '@angular/material/grid-list';
import  {MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialogModule } from '@angular/material/dialog';



@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    UnitCardComponent,
    UnitcardContainerComponent,
    MainSideNavComponent,
    TrimesterContainerComponent,
    YearContainerComponent,
    UnitDetailDialogComponent,
    MajorMinorComponent, 
    EditComponent, 
    NotificationsComponent, 
    CourseUpdatesComponent, 
    NotFoundComponent
    DiscoveryPageComponent,
    DiscoveryGraphBasedMapComponent,
    DiscoveryTextBasedListsComponent,
    DiscoveryDetailedContentComponent,
    DiscoveryConnectionSelectablesComponent,
    DiscoveryCardSelectableComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    CommonModule,
    HttpClientModule,
    MatDialogModule,
    MatToolbarModule,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule
    FormsModule,
    MatExpansionModule, 
    MatChipsModule, 
    MatRadioModule, 
    MatGridListModule,
    MatCardModule
  ],
  providers: [
    { provide: IDiscoveryDataServiceInjector, useClass: JsonFileDiscoveryDataService }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
