/*
This is taken (and modified) from the AngularFire2 github page: https://github.com/angular/angularfire2/issues/282
*/

import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase/app';

@Injectable()
export class AuthService {

  private _user: firebase.User;

  constructor(public afAuth: AngularFireAuth, private db: AngularFireDatabase) {
    afAuth.authState.subscribe(user => this.user = user);
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

  signInWithGoogle(): firebase.Promise<any> {
    console.log('signing in with google')
    return this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
      .then(response => {
        this.db.object(`/users/${response.user.uid}`)
          .subscribe(user => {
            if (!user.$exists()) {
              const {displayName, email, emailVerified, photoURL, uid} = response.user;
              this.db.object(`/users/${response.user.uid}`).set({
                displayName,
                email,
                emailVerified,
                photoURL,
                uid
              })
            }
          });
      })
      .catch(err => console.log('ERRROR @ AuthService#signInWithGoogle() :', err));
  }

  signInWithEmailAndPassword(email: string, password: string): firebase.Promise<any> {
      console.log('signing in with email and password')
      return this.afAuth.auth.signInWithEmailAndPassword(email, password)
        .catch(err => console.log('ERROR @ AuthService#signInWithEmailAndPassword() :', err))
  }

  registerWithEmailAndPassword(email: string, password: string): firebase.Promise<any> {
      console.log('registering')
      return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
        .then(user => {
            this.db.object(`/users/${user.uid}`)
                .set({
                    email,
                    uid: user.uid,
                })
        })
        .catch(err => console.log('ERROR @ AuthService#registerWithEmailAndPassword() :', err))
  }

  signOut(): void {
    console.log('signing out')
    this.afAuth.auth.signOut();
  }

}
