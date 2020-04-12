import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IngresoEgreso } from '../modelos/ingreso-egreso.model';
import { IngresoEgresoService } from '../services/ingreso-egreso.service';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import * as actions from '../share/ui.actions'
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ingreso-egreso',
  templateUrl: './ingreso-egreso.component.html',
  styles: []
})
export class IngresoEgresoComponent implements OnInit, OnDestroy {

  ingresoForm: FormGroup;
  tipo: string = 'ingreso';
  cargando: boolean;
  storeSubcription: Subscription;


  constructor(private fb: FormBuilder,
    private store: Store<AppState>,
    private ingresoEgresoService: IngresoEgresoService) { }

  ngOnInit() {
    this.ingresoForm = this.fb.group({
      description: ['', Validators.required],
      monto: ['', Validators.required],
    });

    this.storeSubcription = this.store.select( 'ui' )
    .subscribe( ui => this.cargando = ui.isLoading);
  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.storeSubcription.unsubscribe();

  }
  guardar() {
    if (this.ingresoForm.invalid) {
      return;
    }
    this.store.dispatch(actions.isLoading());
    const { description, monto } = this.ingresoForm.value;

    const ingresoEgreso = new IngresoEgreso(description, monto, this.tipo);

    this.ingresoEgresoService.crearIngresoEgreso(ingresoEgreso)
    .then( () => {
      this.store.dispatch(actions.stopLoading());
      Swal.fire(
        'Datos guardados',
         `${ingresoEgreso.tipo}: ${ingresoEgreso.monto}`,
        'success'
      );
      this.ingresoForm.reset();
    })
    .catch((err) => {
      console.warn(err.message);
      this.store.dispatch(actions.stopLoading());
    });

    //console.log( this.ingresoForm.value);
    //console.log( this.tipo);
  }
}
