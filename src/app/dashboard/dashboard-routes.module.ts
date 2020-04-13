import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { dasboardRoutes } from './dahboard.routes';
import { AuthGuard } from '../services/auth.guard';

const rutasHijas: Routes = [
  { path: '', component: DashboardComponent,
      children: dasboardRoutes,
    //canActivate: [ AuthGuard]
  },
]

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild( rutasHijas ),
  ],
  exports: [
    RouterModule
  ]
})
export class DashboardRoutesModule { }
