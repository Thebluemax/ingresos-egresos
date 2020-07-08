import { Pipe, PipeTransform } from '@angular/core';
import { IngresoEgreso } from '../modelos/ingreso-egreso.model';

@Pipe({
  name: 'ordenIngresos'
})
export class OrdenIngresosPipe implements PipeTransform {

  transform(items: IngresoEgreso[]): IngresoEgreso[] {
    let arreglo = items.slice();
    return arreglo.sort( (a, b) => {
        if (a.tipo === 'ingreso') {
          return -1;
        } else {
          return 1;
        }
    });
  }

}