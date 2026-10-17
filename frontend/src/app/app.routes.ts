import { Routes } from '@angular/router';
import { JobListComponent } from './pages/job-list/job-list.component';
import { JobFormComponent } from './pages/job-form/job-form.component';
import { JobDetailComponent } from './pages/job-detail/job-detail.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'jobs', pathMatch: 'full' },
  { path: 'jobs', component: JobListComponent },
  { 
    path: 'jobs/new', 
    component: JobFormComponent, 
    canActivate: [authGuard] 
  },
  { 
    path: 'jobs/:id', 
    component: JobDetailComponent 
  },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '**', redirectTo: 'jobs' }
];