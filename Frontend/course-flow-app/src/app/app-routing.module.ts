import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CourseMapComponent } from './course-map/course-map.component';
import { OverviewComponent } from './main-side-nav/pages/overview/overview.component';
import { MajorMinorComponent } from './main-side-nav/pages/majorminor/majorminor.component';
import { NotFoundComponent } from './main-side-nav/pages/not-found/not-found.component';
import { EditComponent } from './main-side-nav/pages/edit/edit.component';
import { NotificationsComponent } from './main-side-nav/pages/notifications/notifications.component';
import { CourseUpdatesComponent } from './main-side-nav/pages/courseupdates/courseupdates.component';
import { TrimesterContainerComponent } from './trimester-container/trimester-container.component';
import { DiscoveryPageComponent } from './discovery/discovery-page/discovery-page.component';


const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'coursemap_page_url/home',
  },
  {
    path: "coursemap_page_url",
    title: "Course Map",
    component: CourseMapComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'home',
      },
      {
        path: 'home',
        title: "Course Map Home",
        component: TrimesterContainerComponent,
      },
      {
        path: 'overview',
        title: "Course Map Overview",
        component: OverviewComponent,
      },
      {
        path: 'majorminor',
        title: "Course Map Major Minor",
        component: MajorMinorComponent,
      },
      {
        path: 'edit',
        title: "Course Map Edit",
        component: EditComponent,
      },
      {
        path: 'notifications',
        title: "Course Map Notifications",
        component: NotificationsComponent,
      },
      {
        path: 'courseupdates',
        title: "Course Map Course Updates",
        component: CourseUpdatesComponent,
      },
      {
        path: '**',
        title: "Course Map Course Not Found",
        component: NotFoundComponent,
      },
    ]
  },
  {
    path: "discovery_page_url",
    title: "Discovery Page",
    component: DiscoveryPageComponent
  },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
