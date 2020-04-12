import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import * as inOutActions from '../ingreso-egreso/ingreso-egreso.actions';

import { filter } from 'rxjs/operators';
import { Subscribable, Subscription } from 'rxjs';

import { IngresoEgresoService } from '../services/ingreso-egreso.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: []
})
export class DashboardComponent implements OnInit, OnDestroy {

  userSubcription: Subscription;
  inOutSubcription: Subscription;
  useName: string;

  constructor( private store: Store<AppState>,
                private ingresoEgresoService: IngresoEgresoService) { }

  ngOnInit() {
    this.userSubcription = this.store.select('user')
    .pipe(
      filter( auth => auth.user !== null )
    )
    .subscribe( ({ user }) =>{
     this.useName = user.nombre;
     this.inOutSubcription = this.ingresoEgresoService.initIngresosEgresosListener( user.uid )
      .subscribe( ingresosEgresosFB => {
        this.store.dispatch( inOutActions.setItems({ items: ingresosEgresosFB }))
      });
    })
  }
 ngOnDestroy(){
   this.inOutSubcription.unsubscribe();
this.userSubcription.unsubscribe();
 }
}
