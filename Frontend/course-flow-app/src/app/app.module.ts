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

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    UnitCardComponent,
    UnitcardContainerComponent,
    MainSideNavComponent,
    TrimesterContainerComponent,
    YearContainerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    CommonModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
