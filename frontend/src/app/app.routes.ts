import { Routes } from '@angular/router';
import { JobListComponent } from './pages/job-list/job-list.component';
import { JobDetailComponent } from './pages/job-detail/job-detail.component';
import { JobFormComponent } from './pages/job-form/job-form.component';
import { LoginComponent } from './pages/login/login.component'; // นำเข้า LoginComponent
import { RegisterComponent } from './pages/register/register.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'jobs',
    pathMatch: 'full',
  },
  {
    path: 'login', // เพิ่มเส้นทางไปหน้า Login
    component: LoginComponent,
    title: 'เข้าสู่ระบบ | Internship & Job Board',
  },
  {
    path: 'register',
    component: RegisterComponent,
    title: 'สมัครสมาชิก | Internship & Job Board',
  },
  {
    path: 'jobs',
    component: JobListComponent,
    title: 'ตำแหน่งงานและฝึกงานทั้งหมด | Internship & Job Board',
  },
  {
    path: 'jobs/new',
    component: JobFormComponent,
    title: 'ลงประกาศงานใหม่ | Internship & Job Board',
  },
  {
    path: 'jobs/:id',
    component: JobDetailComponent,
    title: 'รายละเอียดตำแหน่งงาน | Internship & Job Board',
  },
  {
    path: 'jobs/:id/edit',
    component: JobFormComponent,
    title: 'แก้ไขตำแหน่งงาน | Internship & Job Board',
  },
  {
    path: '**',
    redirectTo: 'jobs',
  },
];