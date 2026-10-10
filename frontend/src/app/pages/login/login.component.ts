import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="min-h-screen bg-white flex items-center justify-center p-4">
      <!-- การ์ดกรอบโค้งมน พร้อมขอบสีส้มจาง ๆ สไตล์เดียวกับหน้า Register -->
      <div class="w-full max-w-[420px] bg-white rounded-3xl border border-orange-100/80 p-8 sm:p-10 shadow-sm text-center">
        
        <!-- ไอคอนกระเป๋าสีส้ม -->
        <div class="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#ea580c] text-white shadow-md shadow-orange-500/20 mb-5">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7 fill-current" viewBox="0 0 24 24">
            <path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z"/>
          </svg>
        </div>

        <!-- หัวข้อหลักและคำบรรยาย -->
        <h1 class="text-2xl font-bold text-gray-900 tracking-tight">
          เข้าสู่ระบบ
        </h1>
        <p class="text-xs text-gray-500 mt-1.5 mb-6">
          ยินดีต้อนรับกลับมา ค้นหาและสมัครงานกับเรา
        </p>

        <!-- ข้อความแจ้งเตือน Error -->
        <div *ngIf="errorMessage" class="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs text-left">
          {{ errorMessage }}
        </div>

        <!-- ฟอร์มเข้าสู่ระบบ -->
        <form (ngSubmit)="onLogin()" class="space-y-4 text-left">
          <!-- อีเมล -->
          <div>
            <label class="block text-xs font-semibold text-gray-700 mb-1.5">อีเมล</label>
            <input 
              type="email" 
              name="email"
              [(ngModel)]="email" 
              required
              placeholder="name@example.com"
              class="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition duration-150"
            />
          </div>

          <!-- รหัสผ่าน -->
          <div>
            <label class="block text-xs font-semibold text-gray-700 mb-1.5">รหัสผ่าน</label>
            <input 
              type="password" 
              name="password"
              [(ngModel)]="password" 
              required
              placeholder="••••••"
              class="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition duration-150"
            />
          </div>

          <!-- ปุ่มเข้าสู่ระบบสีส้มมน -->
          <div class="pt-2">
            <button 
              type="submit" 
              [disabled]="loading"
              class="w-full py-3.5 px-4 bg-[#ea580c] hover:bg-[#d94e08] active:bg-[#c2410c] text-white font-medium rounded-xl text-sm transition-all duration-150 shadow-md shadow-orange-500/25 disabled:opacity-60 cursor-pointer">
              {{ loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ' }}
            </button>
          </div>
        </form>

        <!-- ลิงก์ไปหน้าสมัครสมาชิก -->
        <p class="mt-6 text-xs text-gray-500">
          ยังไม่มีบัญชี? 
          <a routerLink="/register" class="font-semibold text-[#ea580c] hover:underline cursor-pointer">
            สมัครสมาชิก
          </a>
        </p>

      </div>
    </div>
  `
})
export class LoginComponent {
  email = '';
  password = '';
  loading = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onLogin() {
    if (!this.email || !this.password) {
      this.errorMessage = 'กรุณากรอกอีเมลและรหัสผ่าน';
      return;
    }

    this.errorMessage = '';
    this.loading = true;

    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/']);
      },
      error: (err: any) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'อีเมลหรือรหัสผ่านไม่ถูกต้อง';
      }
    });
  }
}