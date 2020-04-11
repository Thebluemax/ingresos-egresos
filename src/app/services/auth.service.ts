import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

import { map } from "rxjs/operators";
import { Usuario } from '../modelos/usuario.model';
import { AngularFirestore } from '@angular/fire/firestore';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor( public authF: AngularFireAuth,
                private firestore:AngularFirestore ) { }

  initAuthListener() {
    this.authF.authState.subscribe( fuser => {
      console.log(fuser);
    });
  }

  crearUsuario(nombre:string, correo:string, password:string) {

    return this.authF.auth.createUserWithEmailAndPassword(correo, password)
            .then(({ user }) =>{

              const newUser = new Usuario( user.uid, user.email, nombre );

              return  this.firestore.doc(`${ user.uid }/usuario`)
                .set( { ...newUser });
            });

  }

  loginUsuario(correo:string, password:string) {

    return this.authF.auth.signInWithEmailAndPassword(correo, password);

  }

  logout() {
    return this.authF.auth.signOut();
  }

  isAuth (){
    return this.authF.authState.pipe(
      map(fbUser => fbUser != null)
    )
  }
}
