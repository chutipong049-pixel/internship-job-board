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
    <div class="min-h-screen bg-[#faf7f2] font-['Kanit'] flex items-center justify-center p-4">
      <div class="max-w-md w-full bg-white rounded-3xl p-8 shadow-sm border border-orange-100 space-y-6">
        
        <!-- โลโก้ และ หัวข้อ -->
        <div class="text-center space-y-2">
          <a routerLink="/" class="inline-flex items-center justify-center cursor-pointer">
            <img 
              src="assets/logo.png" 
              alt="JobBoard" 
              class="h-8 w-auto object-contain" 
              onerror="this.src='/assets/logo.png';"
            />
          </a>
          <h1 class="text-xl font-black text-gray-900 mt-2">เข้าสู่ระบบ</h1>
          <p class="text-xs text-gray-500 font-medium">เข้าใช้งานระบบ JobBoard ด้วยบัญชีของคุณ</p>
        </div>

        <!-- กล่องแจ้งเตือนข้อผิดพลาด -->
        <div *ngIf="errorMessage" class="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-semibold text-center">
          {{ errorMessage }}
        </div>

        <!-- ฟอร์มเข้าสู่ระบบ -->
        <form (ngSubmit)="onLogin()" class="space-y-4">
          <!-- ช่องกรอก Username / Email -->
          <div>
            <label class="block text-xs font-bold text-gray-700 mb-1.5">
              ชื่อผู้ใช้ (Username) หรือ อีเมล
            </label>
            <input 
              type="text" 
              [(ngModel)]="usernameOrEmail" 
              name="usernameOrEmail" 
              required
              placeholder="กรอก Username หรือ Email ของคุณ"
              class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#ea580c] focus:ring-1 focus:ring-[#ea580c] transition bg-blue-50/30">
          </div>

          <!-- ช่องกรอกรหัสผ่าน -->
          <div>
            <label class="block text-xs font-bold text-gray-700 mb-1.5">รหัสผ่าน</label>
            <input 
              type="password" 
              [(ngModel)]="password" 
              name="password" 
              required
              placeholder="กรอกรหัสผ่าน"
              class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#ea580c] focus:ring-1 focus:ring-[#ea580c] transition bg-blue-50/30">
          </div>

          <button 
            type="submit" 
            [disabled]="loading"
            class="w-full py-3 bg-[#ea580c] hover:bg-[#d94e08] text-white font-bold text-xs rounded-xl shadow-sm transition disabled:opacity-50 cursor-pointer">
            {{ loading ? 'กำลังตรวจสอบ...' : 'เข้าสู่ระบบ' }}
          </button>
        </form>

        <!-- ลิงก์ไปหน้าสมัครสมาชิก -->
        <div class="text-center text-xs text-gray-500 font-medium">
          ยังไม่มีบัญชีผู้ใช้? 
          <a routerLink="/register" class="text-[#ea580c] font-bold hover:underline ml-1">สมัครสมาชิก</a>
        </div>

      </div>
    </div>
  `
})
export class LoginComponent {
  usernameOrEmail = '';
  password = '';
  loading = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onLogin(): void {
    if (!this.usernameOrEmail || !this.password) {
      this.errorMessage = 'กรุณากรอกชื่อผู้ใช้/อีเมล และรหัสผ่านให้ครบถ้วน';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.authService.login({ 
      usernameOrEmail: this.usernameOrEmail.trim(), 
      password: this.password 
    }).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/jobs']);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err?.error?.message || err?.error || 'ชื่อผู้ใช้/อีเมล หรือรหัสผ่านไม่ถูกต้อง';
      }
    });
  }
}