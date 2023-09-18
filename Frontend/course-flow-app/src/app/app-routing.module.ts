import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { OverviewComponent } from './main-side-nav/pages/overview/overview.component';
import { MajorMinorComponent } from './main-side-nav/pages/majorminor/majorminor.component';
import { NotFoundComponent } from './main-side-nav/pages/not-found/not-found.component';
import { EditComponent } from './main-side-nav/pages/edit/edit.component';
import { NotificationsComponent } from './main-side-nav/pages/notifications/notifications.component';
import { CourseUpdatesComponent } from './main-side-nav/pages/courseupdates/courseupdates.component';
import { TrimesterContainerComponent } from './trimester-container/trimester-container.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home',
  },
  {
    path: 'home',
    component: TrimesterContainerComponent,
  },
  {
    path: 'overview',
    component: OverviewComponent,
  },
  {
    path: 'majorminor',
    component: MajorMinorComponent,
  },
  {
    path: 'edit',
    component: EditComponent,
  },
  {
    path: 'notifications',
    component: NotificationsComponent,
  },
  {
    path: 'courseupdates',
    component: CourseUpdatesComponent,
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
