import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        
        <!-- Header โลโก้และชื่อระบบ -->
        <div class="text-center">
          <div class="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-orange-100 text-orange-600 mb-3 text-2xl">
            💼
          </div>
          <h2 class="text-2xl font-black text-gray-900 tracking-tight">
            Internship & Job Board
          </h2>
          <p class="mt-1 text-sm text-gray-500">
            {{ isRegister ? 'สร้างบัญชีใหม่เพื่อเริ่มต้นใช้งานระบบ' : 'ยินดีต้อนรับกลับมา กรุณาเข้าสู่ระบบ' }}
          </p>

          <!-- ปุ่มสลับโหมด เข้าสู่ระบบ / สมัครสมาชิก -->
          <div class="mt-6 flex rounded-xl bg-gray-100 p-1">
            <button 
              type="button"
              (click)="isRegister = false; errorMsg = ''; successMsg = ''"
              [class.bg-white]="!isRegister"
              [class.text-orange-600]="!isRegister"
              [class.shadow-sm]="!isRegister"
              [class.text-gray-500]="isRegister"
              class="w-1/2 py-2 text-sm font-bold rounded-lg transition-all duration-200">
              เข้าสู่ระบบ
            </button>
            <button 
              type="button"
              (click)="isRegister = true; errorMsg = ''; successMsg = ''"
              [class.bg-white]="isRegister"
              [class.text-orange-600]="isRegister"
              [class.shadow-sm]="isRegister"
              [class.text-gray-500]="!isRegister"
              class="w-1/2 py-2 text-sm font-bold rounded-lg transition-all duration-200">
              สมัครสมาชิก
            </button>
          </div>
        </div>

        <!-- กล่องแจ้งเตือน Alert -->
        <div *ngIf="errorMsg" class="mt-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-medium">
          {{ errorMsg }}
        </div>
        <div *ngIf="successMsg" class="mt-4 p-3 bg-green-50 border border-green-200 text-green-600 rounded-xl text-sm font-medium">
          {{ successMsg }}
        </div>

        <!-- Form Input -->
        <form class="mt-6 space-y-4" (ngSubmit)="handleSubmit()">
          
          <!-- ฟิลด์ชื่อ (เฉพาะสมัครสมาชิก) -->
          <div *ngIf="isRegister">
            <label class="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">ชื่อ - นามสกุล</label>
            <input 
              type="text" 
              [(ngModel)]="formData.name" 
              name="name" 
              required
              placeholder="เช่น นายธนากร มั่นคง" 
              class="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm transition">
          </div>

          <!-- ฟิลด์อีเมล -->
          <div>
            <label class="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">อีเมล (Email)</label>
            <input 
              type="email" 
              [(ngModel)]="formData.email" 
              name="email" 
              required
              placeholder="name@example.com" 
              class="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm transition">
          </div>

          <!-- ฟิลด์รหัสผ่าน -->
          <div>
            <label class="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">รหัสผ่าน (Password)</label>
            <input 
              type="password" 
              [(ngModel)]="formData.password" 
              name="password" 
              required
              placeholder="••••••••" 
              class="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm transition">
          </div>

          <!-- ฟิลด์ประเภทผู้ใช้งาน (เฉพาะสมัครสมาชิก) -->
          <div *ngIf="isRegister">
            <label class="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">สถานะผู้ใช้งาน</label>
            <select 
              [(ngModel)]="formData.role" 
              name="role" 
              class="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm bg-white transition">
              <option value="STUDENT">👨‍🎓 นักศึกษา / ผู้สมัครงาน (Student)</option>
              <option value="COMPANY">🏢 บริษัท / ผู้ประกอบการ (Company)</option>
            </select>
          </div>

          <!-- ปุ่ม Action สีส้ม -->
          <div class="pt-2">
            <button 
              type="submit" 
              [disabled]="loading"
              class="w-full py-3 px-4 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-bold rounded-xl shadow-md shadow-orange-500/20 transition duration-150 ease-in-out cursor-pointer disabled:opacity-50">
              <span *ngIf="loading">กำลังประมวลผล...</span>
              <span *ngIf="!loading">{{ isRegister ? 'ยืนยันการสมัครสมาชิก' : 'เข้าสู่ระบบ' }}</span>
            </button>
          </div>
        </form>

        <!-- ลิงก์สลับมุมมองด้านล่าง -->
        <div class="mt-6 text-center text-xs text-gray-500">
          <span *ngIf="!isRegister">
            ยังไม่มีบัญชีใช้งาน? 
            <button type="button" (click)="isRegister = true; errorMsg = ''; successMsg = ''" class="text-orange-600 font-bold hover:underline">
              สมัครสมาชิกที่นี่
            </button>
          </span>
          <span *ngIf="isRegister">
            มีบัญชีผู้ใช้อยู่แล้ว? 
            <button type="button" (click)="isRegister = false; errorMsg = ''; successMsg = ''" class="text-orange-600 font-bold hover:underline">
              เข้าสู่ระบบที่นี่
            </button>
          </span>
        </div>

      </div>
    </div>
  `
})
export class LoginComponent {
  isRegister = false;
  loading = false;
  errorMsg = '';
  successMsg = '';

  formData = {
    name: '',
    email: '',
    password: '',
    role: 'STUDENT'
  };

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  handleSubmit() {
    this.errorMsg = '';
    this.successMsg = '';
    this.loading = true;

    if (this.isRegister) {
      // โหมดสมัครสมาชิก
      this.authService.register(this.formData).subscribe({
        next: () => {
          this.loading = false;
          this.successMsg = 'สมัครสมาชิกสำเร็จเรียบร้อย! กรุณาเข้าสู่ระบบ';
          this.isRegister = false;
          this.formData.password = '';
        },
        error: (err: any) => {
          this.loading = false;
          this.errorMsg = err.error?.message || 'การสมัครสมาชิกล้มเหลว กรุณาตรวจสอบข้อมูลอีกครั้ง';
        }
      });
    } else {
      // โหมดเข้าสู่ระบบ
      this.authService.login({ email: this.formData.email, password: this.formData.password }).subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['/']);
        },
        error: (err: any) => {
          this.loading = false;
          this.errorMsg = err.error?.message || 'อีเมลหรือรหัสผ่านไม่ถูกต้อง';
        }
      });
    }
  }
}