import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './header/header.component';
import { UnitCardComponent } from './unit-card/unit-card.component';

import { CommonModule } from '@angular/common';
import { UnitcardContainerComponent } from './unitcard-container/unitcard-container.component';
import { MainSideNavComponent } from './main-side-nav/main-side-nav.component';
import { TrimesterContainerComponent } from './trimester-container/trimester-container.component';
import { YearContainerComponent } from './year-container/year-container.component';

import { MatDialogModule } from '@angular/material/dialog';
import { UnitDetailDialogComponent } from './unit-detail-dialog/unit-detail-dialog.component';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { NotFoundComponent } from './main-side-nav/pages/not-found/not-found.component';
import { MajorMinorComponent } from './main-side-nav/pages/majorminor/majorminor.component';
import { EditComponent } from './main-side-nav/pages/edit/edit.component';
import { NotificationsComponent } from './main-side-nav/pages/notifications/notifications.component';
import { CourseUpdatesComponent } from './main-side-nav/pages/courseupdates/courseupdates.component';



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
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
