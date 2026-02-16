import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="card">
      <h2>Create Account ✨</h2>
      <form [formGroup]="form" (ngSubmit)="submit()">
        <input formControlName="name" placeholder="Full Name" />
        <input formControlName="email" placeholder="Email" />
        <input formControlName="password" type="password" placeholder="Password" />
        <button>Signup</button>
      </form>
      <a class="link" routerLink="/login">Already have account?</a>
    </div>
  `
})
export class SignupComponent {
  fb = inject(FormBuilder);
  auth = inject(AuthService);

  form = this.fb.group({ name: '', email: '', password: '' });

  submit() {
    console.log('Form Value:', this.form.value);
    this.auth.signup(this.form.value);
    console.log('User saved to localStorage');
    alert('Signup Success!');
  }

}
