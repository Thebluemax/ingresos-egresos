import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from "@ngrx/store";

import Swal from 'sweetalert2'

import { AuthService } from '../../services/auth.service';
import { AppState } from '../../app.reducer';
import * as actions from "../../share/ui.actions";
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: []
})
export class RegisterComponent implements OnInit, OnDestroy {

  registroForm: FormGroup;
  cargando: boolean;
  uiSubscription: Subscription;

  constructor(private fb: FormBuilder,
    private authService: AuthService,
    private store: Store<AppState>,
    private router: Router) { }

  ngOnInit() {
    this.registroForm = this.fb.group({
      nombre: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    this.uiSubscription = this.store.select('ui')
      .subscribe(ui => this.cargando = ui.isLoading);
  }
  ngOnDestroy() {
    this.uiSubscription.unsubscribe();
  }
  crearUsuario() {
    //console.log(this.registroForm);
    if (this.registroForm.invalid) { return; }

    this.store.dispatch(actions.isLoading());
    /*Swal.fire({
      title: 'Creando Usuario',
      timerProgressBar: true,
      onBeforeOpen: () => {
        Swal.showLoading()
      },
    });*/

    const { nombre, correo, password } = this.registroForm.value;

    this.authService.crearUsuario(nombre, correo, password)
      .then((value) => {
        console.log(value);
        this.store.dispatch(actions.stopLoading());
        //Swal.close();
        this.router.navigate(['/']);
      })
      .catch(err => {
        console.error(err);
        this.store.dispatch(actions.stopLoading());

        Swal.fire({
          icon: 'error',
          title: 'Opps...',
          text: err.message,
        })
      });
  }
}
