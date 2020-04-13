import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import * as actions from '../auth/auth.actions';
import * as actionsInOut from '../ingreso-egreso/ingreso-egreso.actions';

import { map } from "rxjs/operators";
import { Usuario } from '../modelos/usuario.model';
import { Subscription } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userSubcription?: Subscription;
  private _user: Usuario;

  get user() {
    return this._user;
  }

  constructor(public authF: AngularFireAuth,
    private firestore: AngularFirestore,
    private store: Store<AppState>) { }

  initAuthListener() {
    this.authF.authState.subscribe(fuser => {
      // console.log(fuser);
      if (fuser) {
        this.userSubcription = this.firestore.doc(`${ fuser.uid }/usuario`).valueChanges()
        .subscribe( (fireUser:any) => {

          const user = Usuario.fromFirebase( fireUser );
          this._user = user;
          this.store.dispatch( actions.setUser({ user }));

        });
      } else {
        //console.log('Llamar unset del user');
        this._user = null;
        if (this.userSubcription) {
          this.userSubcription.unsubscribe();
        }
        this.store.dispatch( actions.unSetUser());
        this.store.dispatch( actionsInOut.unSetItems());

      }
    });
  }

  crearUsuario(nombre: string, correo: string, password: string) {

    return this.authF.auth.createUserWithEmailAndPassword(correo, password)
      .then(({ user }) => {

        const newUser = new Usuario(user.uid, user.email, nombre);

        return this.firestore.doc(`${user.uid}/usuario`)
          .set({ ...newUser });
      });

  }

  loginUsuario(correo: string, password: string) {

    return this.authF.auth.signInWithEmailAndPassword(correo, password);

  }

  logout() {
    return this.authF.auth.signOut();
  }

  isAuth() {
    return this.authF.authState.pipe(
      map(fbUser => fbUser != null)
    )
  }


}
