import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router"
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { dasboardRoutes } from './dashboard/dahboard.routes';
import { AuthGuard } from './services/auth.guard';


const routes:Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: '',
    canLoad: [ AuthGuard ],
      loadChildren: () => import('./ingreso-egreso/ingreso-egreso.module').then( m => m.IngresoEgresoModule)
  },
 /* { path: '', component: DashboardComponent,
      children: dasboardRoutes,
    canActivate: [ AuthGuard] },*/
  { path: '**', redirectTo: '' },

];

@NgModule({

  imports: [
    RouterModule.forRoot( routes)
  ],
  exports: [
    RouterModule
  ]

})

export class AppRoutingModule {}
