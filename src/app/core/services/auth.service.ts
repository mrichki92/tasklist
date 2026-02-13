import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  login(data: any) {
    console.log('LOGIN', data);
    localStorage.setItem('user', JSON.stringify(data));
  }

  signup(data: any) {
    console.log('SIGNUP', data);
  }

  isLoggedIn() {
    return !!localStorage.getItem('user');
  }

  constructor() { }
}
