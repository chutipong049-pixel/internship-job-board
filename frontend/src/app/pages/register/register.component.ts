import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HttpClientModule],
  template: `
    <div class="min-h-screen bg-[#FFFBF7] flex items-center justify-center p-4 font-sans">
      <div class="max-w-md w-full bg-white rounded-3xl shadow-sm border border-orange-100 p-8 space-y-6">
        
        <!-- โลโก้หรือหัวข้อ -->
        <div class="text-center space-y-2">
          <div class="inline-block bg-orange-500 text-white p-3 rounded-2xl shadow-xs text-xl font-bold">
            💼
          </div>
          <h1 class="text-2xl font-extrabold text-gray-900">สร้างบัญชีผู้ใช้ใหม่</h1>
          <p class="text-xs text-gray-500">สมัครสมาชิกเพื่อเริ่มต้นค้นหาและสมัครงานกับเรา</p>
        </div>

        <!-- ข้อความแจ้งเตือน Error / Success -->
        <div *ngIf="errorMessage" class="bg-red-50 border border-red-200 text-red-600 text-xs p-3 rounded-xl">
          {{ errorMessage }}
        </div>
        <div *ngIf="successMessage" class="bg-emerald-50 border border-emerald-200 text-emerald-600 text-xs p-3 rounded-xl">
          {{ successMessage }}
        </div>

        <!-- ฟอร์มสมัครสมาชิก -->
        <div class="space-y-4">
          <div>
            <label class="block text-xs font-semibold text-gray-600 mb-1">ชื่อ - นามสกุล</label>
            <input type="text" [(ngModel)]="name" placeholder="ระบุชื่อของคุณ" 
                   class="w-full text-xs border border-gray-200 rounded-xl px-3.5 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-gray-50/50">
          </div>

          <div>
            <label class="block text-xs font-semibold text-gray-600 mb-1">อีเมล</label>
            <input type="email" [(ngModel)]="email" placeholder="name@example.com" 
                   class="w-full text-xs border border-gray-200 rounded-xl px-3.5 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-gray-50/50">
          </div>

          <div>
            <label class="block text-xs font-semibold text-gray-600 mb-1">รหัสผ่าน</label>
            <input type="password" [(ngModel)]="password" placeholder="••••••••" 
                   class="w-full text-xs border border-gray-200 rounded-xl px-3.5 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-gray-50/50">
          </div>

          <button (click)="onRegister()" class="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl text-xs shadow-md shadow-orange-500/20 transition cursor-pointer">
            สมัครสมาชิก
          </button>
        </div>

        <!-- ลิงก์กลับไปหน้า Login -->
        <div class="text-center text-xs text-gray-500 pt-2">
          มีบัญชีอยู่แล้ว? 
          <a routerLink="/login" class="text-orange-600 font-bold hover:underline">เข้าสู่ระบบ</a>
        </div>

      </div>
    </div>
  `
})
export class RegisterComponent {
  name: string = '';
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  onRegister(): void {
    if (!this.email || !this.password) {
      this.errorMessage = 'กรุณากรอกอีเมลและรหัสผ่านให้ครบถ้วน';
      return;
    }

    this.http.post('http://localhost:3000/api/auth/register', {
      name: this.name,
      email: this.email,
      password: this.password,
      role: 'STUDENT'
    }).subscribe({
      next: (res: any) => {
        this.successMessage = 'สมัครสมาชิกสำเร็จ! กำลังพากลับไปหน้าเข้าสู่ระบบ...';
        this.errorMessage = '';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1500);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'เกิดข้อผิดพลาดในการสมัครสมาชิก กรุณาลองใหม่อีกครั้ง';
        this.successMessage = '';
      }
    });
  }
}