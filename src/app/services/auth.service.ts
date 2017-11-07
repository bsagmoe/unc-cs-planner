/*
This is taken (and modified) from the AngularFire2 github page: https://github.com/angular/angularfire2/issues/282
*/

import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestoreDocument } from 'angularfire2/firestore'
import * as firebase from 'firebase/app';

import { User } from '../user';
import { UserService } from './user.service'
import { RegistrationModel } from '../form-models/login.model';

@Injectable()
export class AuthService {

  private _user: firebase.User;
  private _userObject: AngularFirestoreDocument<User>;

  constructor(public afAuth: AngularFireAuth,
              private userService: UserService) {
    afAuth.authState.subscribe(user => {
      this.user = user;
      if (this.user) {
        this._userObject = userService.getUser(this.user.uid);
      }
     });
  }

  get userObject(): AngularFirestoreDocument<User> {
    return this._userObject;
  }

  get user(): firebase.User {
    return this._user;
  }

  set user(value: firebase.User) {
    this._user = value;
  }

  get authenticated(): boolean {
    return this._user !== null;
  }

  get uid(): string {
    return this.authenticated ? this.user.uid : '';
  }

  // // Not currently in use
  // signInWithGoogle(): firebase.Promise<any> {
  //   return this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
  //     .then(response => {
  //       this.userService.getUser(response.user.uid)
  //         .subscribe(user => {
  //           // This is the first time they've logged in using Google
  //           if (!(user as any).$exists()) {
  //             const { displayName, email, uid } = response.user;
  //             this.userService.createUser(response.user.uid, {
  //               displayName,
  //               email,
  //               uid
  //             })
  //           }
  //         })
  //     })
  // }

  signInWithEmailAndPassword(email: string, password: string): Promise<any> {
      return this.afAuth.auth.signInWithEmailAndPassword(email, password);
  }

  registerWithEmailAndPassword(registrationModel: RegistrationModel): Promise<any> {
      const uncRegex = /[\S]+@(\S+.)?unc.edu/

      if (!uncRegex.test(registrationModel.email)) {
        console.log('rejecting');
        return Promise.reject( { message: 'You must use a UNC email to sign up for this service'} );
      } else if (registrationModel.password !== registrationModel.confirmPassword) {
        return Promise.reject( { message: 'Your passwords must match'} );
      }

      return this.afAuth.auth.createUserWithEmailAndPassword(registrationModel.email, registrationModel.password)
        .then((user) => {
          // Delete sensitive information
          delete registrationModel.password;
          delete registrationModel.confirmPassword;

          const displayName = registrationModel.email.split('@')[0];

          this.userService.createUser(user.uid, {
            displayName,
            ...registrationModel,
            uid: user.uid
          })

          this.afAuth.auth.currentUser.updateProfile( { displayName, photoURL: null } )

          return user.sendEmailVerification().then(function() {
            return Promise.resolve();
          }).catch(function(error) {
            return Promise.reject({ message: 'Verification e-mail could not be sent. Try again later' });
          });
        })
  }

  signOut(): void {
    this.afAuth.auth.signOut();
  }

}
