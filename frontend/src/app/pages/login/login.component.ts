import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // เพิ่ม CommonModule สำหรับ ngIf
import { FormsModule } from '@angular/forms';     // เพิ่ม FormsModule สำหรับ ngModel
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true, // ยืนยันว่าเป็น Standalone Component
  imports: [CommonModule, FormsModule], // นำเข้าโมดูลที่ต้องใช้ที่นี่
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  onLogin() {
    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: (res: any) => {
        alert('เข้าสู่ระบบสำเร็จ!');
        localStorage.setItem('user', JSON.stringify(res.user));
        this.router.navigate(['/jobs']);
      },
      error: (err: any) => {
        this.errorMessage = err.error.message || 'อีเมลหรือรหัสผ่านไม่ถูกต้อง';
      }
    });
  }
}