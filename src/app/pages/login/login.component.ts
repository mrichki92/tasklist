import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="card">
      <h2>Welcome Back</h2>
      <form [formGroup]="form" (ngSubmit)="submit()">
        <input formControlName="email" placeholder="Email" />
        <input formControlName="password" type="password" placeholder="Password" />
        <button>Login</button>
      </form>
      <a class="link" routerLink="/signup">Create account</a>
    </div>
  `
})
export class LoginComponent {
  fb = inject(FormBuilder);
  auth = inject(AuthService);
  router = inject(Router);

  form = this.fb.group({ email: '', password: '' });

  submit() {
    this.auth.login(this.form.value);
    this.router.navigate(['/liveness']);
  }
}

