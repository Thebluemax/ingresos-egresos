import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: []
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  constructor( private fb: FormBuilder,
                private authService: AuthService,
                private router: Router) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      correo:['',  [Validators.required, Validators.email]],
      password :['',  Validators.required]
    })
  }
  loginUsuario() {
    if(this.loginForm.invalid) { return; }
    Swal.fire({
      title: 'Comprobando Credenciales',
      timerProgressBar: true,
      onBeforeOpen: () => {
        Swal.showLoading()
      },
    });
    const { nombre, correo, password} = this.loginForm.value;

  this.authService.loginUsuario( correo, password)
  .then( (value) => {
    Swal.close();
    //console.log(value);
    this.router.navigate(['/']);
   })
  .catch( err => {
   // console.error(err);
    Swal.fire({
      icon: 'error',
      title: err.message,
      text: 'Something went wrong!',
    })});
  }
}
