import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppState } from '../../app.reducer';
import { IngresoEgreso } from '../../modelos/ingreso-egreso.model';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { IngresoEgresoService } from '../../services/ingreso-egreso.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styles: []
})
export class DetalleComponent implements OnInit , OnDestroy{
ingresosEgresos: IngresoEgreso[] = [];
ingresosSubcription: Subscription;
  constructor( private store: Store<AppState>,
        private ingresoEgresoService: IngresoEgresoService) { }

  ngOnInit() {
    this.ingresosSubcription = this.store.select('ingresosEgresos').subscribe(({ items }) => this.ingresosEgresos
    = items );
  }
  ngOnDestroy(){
    this.ingresosSubcription.unsubscribe();
  }
  borrar( uid ) {
    //console.log( uid );
    this.ingresoEgresoService.borrarIngresoEgreso( uid )
    .then( () =>
      Swal.fire('Entrada Borrada ', 'La entrada se ha eliminada correctamente', 'success')
    )
    .catch( (err) => Swal.fire('Error al eliminar entrada ', err.message, 'error'));
  }


}
