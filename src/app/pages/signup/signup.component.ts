import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { Route } from '@angular/router';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
   <div class="card">
  <h2>Create Account ✨</h2>

  <!-- Loading Bar -->
  <div class="loading-bar" *ngIf="loading">
    <div class="loading-progress"></div>
  </div>

  <form [formGroup]="form" (ngSubmit)="submit()">
    <input formControlName="name" placeholder="Full Name" />
    <input formControlName="email" placeholder="Email" />
    <input formControlName="password" type="password" placeholder="Password" />
    <button [disabled]="loading">
      {{ loading ? 'Processing...' : 'Signup' }}
    </button>
  </form>

  <a class="link" routerLink="/login">Already have account?</a>
</div>

  `
})
export class SignupComponent {
  router = inject(Router);
  fb = inject(FormBuilder);
  auth = inject(AuthService);
  loading = false;

  form = this.fb.group({ name: '', email: '', password: '' });

  submit() {
  this.loading = true;

  console.log('Form Value:', this.form.value);

  setTimeout(() => {

    this.auth.signup(this.form.value);
    console.log('User saved to localStorage');
    this.loading = false;
    alert('Signup Success!');
    this.router.navigate(['/login']);
  }, 1200); // simulasi loading 1.2 detik
}



}
