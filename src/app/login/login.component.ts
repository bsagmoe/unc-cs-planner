import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'
import { AngularFireAuth } from 'angularfire2/auth'
import { AuthService } from '../services/auth.service'
import { UserContextService } from '../services/user-context.service'
import { LoginModel } from '../form-models/login.model'
import { Observable } from 'rxjs/Observable'
import * as firebase from 'firebase/app'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {

  user: Observable<firebase.User>
  loginModel: LoginModel = new LoginModel('', '');
  loginError: Error;
  registrationModel: LoginModel = new LoginModel('', '');
  registrationError: Error;

  constructor(private authService: AuthService,
              private router: Router) {}

  signInWithGoogle(): void {
    this.authService.signInWithGoogle()
      .then(res => {
        this.loginError = null;
      })
      .catch(error => this.loginError = error);
  }

  signInWithEmailAndPassword(): void {
    this.authService.signInWithEmailAndPassword(this.loginModel.email, this.loginModel.password)
      .then(res => {
        this.loginError = null;
      })
      .catch(error => this.loginError = error);
  }

  register(): void {
    this.authService.registerWithEmailAndPassword(this.registrationModel.email, this.registrationModel.password)
      .then(res => {
        this.registrationError = null;
      })
      .catch(error => this.registrationError = error)
  }

  signOut(): void {
    this.authService.signOut();
  }

}
