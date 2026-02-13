import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { LivenessComponent } from './pages/liveness/liveness.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent},
    { path: 'signup', component: SignupComponent},
    { path: 'liveness', component: LivenessComponent},
    { path: '', redirectTo: 'login', pathMatch: 'full'}
];
