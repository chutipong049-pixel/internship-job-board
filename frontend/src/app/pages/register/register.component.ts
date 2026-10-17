import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="min-h-screen bg-[#faf7f2] font-['Kanit'] flex items-center justify-center p-4">
      <div class="max-w-md w-full bg-white rounded-3xl p-8 shadow-sm border border-orange-100 space-y-6">
        
        <div class="text-center space-y-2">
          <a routerLink="/" class="inline-flex items-center gap-2">
            <img src="assets/logo.png" alt="JobBoard" class="h-8 w-auto object-contain" onerror="this.src='/assets/logo.png';"/>
          </a>
          <h1 class="text-xl font-black text-gray-900 mt-2">สมัครสมาชิกใหม่</h1>
          <p class="text-xs text-gray-500 font-medium">สร้างบัญชีผู้ใช้งานเพื่อเข้าสู่ระบบ JobBoard</p>
        </div>

        <div *ngIf="errorMessage" class="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-semibold">
          {{ errorMessage }}
        </div>

        <form (ngSubmit)="onRegister()" class="space-y-4">
          <!-- 1. ช่องกรอก Username -->
          <div>
            <label class="block text-xs font-bold text-gray-700 mb-1.5">
              ชื่อผู้ใช้ (Username) <span class="text-[#ea580c]">*</span>
            </label>
            <input 
              type="text" 
              [(ngModel)]="username" 
              name="username" 
              required
              placeholder="ตั้งชื่อผู้ใช้ เช่น chuti_p"
              class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#ea580c] focus:ring-1 focus:ring-[#ea580c] transition">
          </div>

          <!-- 2. ช่องกรอก Email -->
          <div>
            <label class="block text-xs font-bold text-gray-700 mb-1.5">
              อีเมล (Email) <span class="text-[#ea580c]">*</span>
            </label>
            <input 
              type="email" 
              [(ngModel)]="email" 
              name="email" 
              required
              placeholder="example@mail.com"
              class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#ea580c] focus:ring-1 focus:ring-[#ea580c] transition">
          </div>

          <!-- 3. ช่องกรอก Password -->
          <div>
            <label class="block text-xs font-bold text-gray-700 mb-1.5">
              รหัสผ่าน (Password) <span class="text-[#ea580c]">*</span>
            </label>
            <input 
              type="password" 
              [(ngModel)]="password" 
              name="password" 
              required
              placeholder="กำหนดรหัสผ่าน"
              class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#ea580c] focus:ring-1 focus:ring-[#ea580c] transition">
          </div>

          <button 
            type="submit" 
            [disabled]="loading"
            class="w-full py-3 bg-[#ea580c] hover:bg-[#d94e08] text-white font-bold text-xs rounded-xl shadow-sm transition disabled:opacity-50 cursor-pointer">
            {{ loading ? 'กำลังสร้างบัญชี...' : 'สมัครสมาชิก' }}
          </button>
        </form>

        <div class="text-center text-xs text-gray-500 font-medium">
          มีบัญชีอยู่แล้ว? 
          <a routerLink="/login" class="text-[#ea580c] font-bold hover:underline">เข้าสู่ระบบ</a>
        </div>

      </div>
    </div>
  `
})
export class RegisterComponent {
  username = '';
  email = '';
  password = '';
  loading = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onRegister(): void {
    if (!this.username || !this.email || !this.password) {
      this.errorMessage = 'กรุณากรอกข้อมูลให้ครบถ้วนทุกช่อง';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const payload = {
      username: this.username.trim(),
      name: this.username.trim(),
      email: this.email.trim(),
      password: this.password
    };

    this.authService.register(payload).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err?.error?.message || 'สมัครสมาชิกไม่สำเร็จ กรุณาลองใหม่อีกครั้ง';
      }
    });
  }
}