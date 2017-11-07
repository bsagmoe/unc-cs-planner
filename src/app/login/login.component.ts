import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'
import { AngularFireAuth } from 'angularfire2/auth'
import { AuthService } from '../services/auth.service'
import { LoginModel, RegistrationModel } from '../form-models/login.model'
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
  registrationModel: RegistrationModel = new RegistrationModel('', '', '');
  registrationSubmitted: boolean;
  registrationError: Error;

  constructor(public authService: AuthService,
              private router: Router) {
                this.registrationSubmitted = false;
              }

  // // Currently not used, only UNC accounts are accepted (for now)
  // signInWithGoogle(): void {
  //   this.authService.signInWithGoogle()
  //     .then(res => {
  //       this.loginError = null;
  //       this.router.navigate(['community']);
  //     })
  //     .catch(error => this.loginError = error);
  // }

  signInWithEmailAndPassword(): void {
    this.authService.signInWithEmailAndPassword(this.loginModel.email, this.loginModel.password)
      .then(res => {
        this.loginError = null;
        this.router.navigate(['community']);
      })
      .catch(error => this.loginError = error);
  }

  register(): void {
    this.authService.registerWithEmailAndPassword(this.registrationModel)
      .then(res => {
        this.registrationError = null;
        this.registrationSubmitted = true;
      })
      .catch(error => {
        this.registrationError = error
      })
  }
}
