import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  signup(data: any) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');

    users.push(data);

    localStorage.setItem('users', JSON.stringify(users));
  }

  login(data: any) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');

    const found = users.find(
      (u: any) => u.email === data.email && u.password === data.password
    );

    if (found) {
      localStorage.setItem('user', JSON.stringify(found));
      return true;
    }

    return false;
  }

  isLoggedIn() {
    return !!localStorage.getItem('user');
  }
}
