import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from "@ngrx/store";
import { AppState } from '../../app.reducer';
import * as actions from "../../share/ui.actions";

import Swal from 'sweetalert2'
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: []
})
export class LoginComponent implements OnInit, OnDestroy {

  loginForm: FormGroup;
  cargando: boolean;
  uiSubscription: Subscription;


  constructor( private fb: FormBuilder,
                private authService: AuthService,
                private store:Store<AppState>,
                private router: Router) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      correo:['',  [Validators.required, Validators.email]],
      password :['',  Validators.required]
    });

    this.uiSubscription = this.store.select('ui')
    .subscribe( ui => this.cargando = ui.isLoading);

  }

ngOnDestroy(): void {
  //Called once, before the instance is destroyed.
  //Add 'implements OnDestroy' to the class.
  this.uiSubscription.unsubscribe();
}

  loginUsuario() {

    this.store.dispatch( actions.isLoading());

    if(this.loginForm.invalid) { return; }

    const { nombre, correo, password} = this.loginForm.value;

  this.authService.loginUsuario( correo, password)
  .then( (value) => {
    //Swal.close();
    //console.log(value);
    this.store.dispatch( actions.stopLoading() );
    this.router.navigate(['/']);
   })
  .catch( err => {
   // console.error(err);
   this.store.dispatch( actions.stopLoading() );

    Swal.fire({
      icon: 'error',
      title: err.message,
      text: 'Something went wrong!',
    })});
  }
}
