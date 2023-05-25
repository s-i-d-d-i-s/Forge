import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { BehaviorSubject } from 'rxjs';
import { DatabaseService } from './database.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  user: firebase.User | null = null;
  uid= new BehaviorSubject<string>('');
  user_token = new BehaviorSubject<string>('');
  constructor(public auth: AngularFireAuth,public db:DatabaseService) {
    this.auth.onAuthStateChanged((user) => {
      this.user = user;
      this.user?.getIdToken().then(
        (data) => {
          this.db.refreshData(data,this.user!.uid);
          this.uid.next(this.user!.uid);
          this.user_token.next(data);
        }
      )
    })
    
  }
  isLoggedIn() {
    return this.user != null;
  }
  isUserAdmin(){
    return this.isLoggedIn() && this.user!.uid == 'FEv7BXtb2UTFkwm75X1SeZ5Y8OT2';
  }
  loginWithGoogle() {
    this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).then(
      (response) => {
        this.auth.user.subscribe(
          (response) => {
            this.user = response;
            this.uid.next(this.user!.uid);
          }
        )
      }
    );
  }
  logout() {
    this.auth.signOut();
    this.uid.next('');
  }
}
