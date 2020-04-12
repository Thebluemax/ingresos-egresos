import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../app.reducer';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: []
})
export class SidebarComponent implements OnInit {

  userName: string;
userSubcription: Subscription;
  constructor( private authService:AuthService,
                private router: Router,
                private store: Store<AppState>) { }

  ngOnInit() {
    this.userSubcription = this.store.select( 'user' )
    .pipe(
      filter( ({ user }) => {
        return user !== null;
      })
    )
    .subscribe(({ user }) => { this.userName = user.nombre});
  }

  closeSession() {
    this.userSubcription.unsubscribe();
    this.authService.logout()
    .then( value => {
      //console.log(value);
      this.router.navigate(['/login'])
    });
  }
}
