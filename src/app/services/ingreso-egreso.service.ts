import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { IngresoEgreso } from '../modelos/ingreso-egreso.model';
import { AuthService } from './auth.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class IngresoEgresoService {

  constructor( private firestore: AngularFirestore,
    private authService: AuthService) { }

  crearIngresoEgreso(ingresoEgreso: IngresoEgreso) {

    const uid = this.authService.user.uid;

    delete ingresoEgreso.uid;
    //console.log(ingresoEgreso,"from in out service");
   return this.firestore.doc(`${ uid }/ingresos-egresos`)
    .collection('items')
    .add({...ingresoEgreso})
    .then( (ref) => {
      console.log('objeto insertado', ref);

    })
    .catch( err => console.warn(err));
  }

  initIngresosEgresosListener(uid: string) {

   return this.firestore.collection(`${ uid }/ingresos-egresos/items`)
    .snapshotChanges()
    .pipe(
      map( snapshot => {
        return snapshot.map( doc => ({

            ...doc.payload.doc.data() as any,
            uid: doc.payload.doc.id
          })
        );
      })
    );

  }

  borrarIngresoEgreso (uidItem: string) {
    const uidUser = this.authService.user.uid;

    return this.firestore.doc(`${ uidUser }/ingresos-egresos/items/${ uidItem }`).delete();

  }
}
