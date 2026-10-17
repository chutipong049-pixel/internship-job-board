import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { JobService } from '../../services/job.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-job-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="min-h-screen bg-[#faf7f2] font-['Kanit'] py-10 px-4 sm:px-6 lg:px-8">
      <div class="max-w-2xl mx-auto bg-white rounded-3xl p-8 border border-orange-100 shadow-sm space-y-6">
        
        <!-- หัวข้อ -->
        <div class="flex items-center justify-between border-b border-gray-100 pb-4">
          <div>
            <h1 class="text-xl font-black text-gray-900">ลงประกาศรับสมัครงาน</h1>
            <p class="text-xs text-gray-500 font-medium mt-1">กรอกข้อมูลตำแหน่งงานเพื่อเผยแพร่บน JobBoard</p>
          </div>
          <a routerLink="/jobs" class="text-xs font-bold text-gray-400 hover:text-[#ea580c] transition">
            ยกเลิก
          </a>
        </div>

        <!-- ป้ายแสดงผู้ลงประกาศ -->
        <div class="p-3.5 bg-orange-50 border border-orange-200/80 rounded-2xl flex items-center justify-between">
          <div class="flex items-center gap-2.5">
            <div class="w-7 h-7 rounded-full bg-[#ea580c] text-white flex items-center justify-center text-xs font-black uppercase">
              {{ (currentUser?.name || currentUser?.username || 'U').charAt(0) }}
            </div>
            <div>
              <span class="text-[11px] text-gray-500 block">ลงประกาศในนาม:</span>
              <span class="text-xs font-extrabold text-gray-800">
                {{ currentUser?.name || currentUser?.username || 'ผู้ใช้งานทั่วไป' }}
              </span>
            </div>
          </div>
          <span class="text-[10px] bg-white px-2 py-1 rounded-full border border-orange-100 font-bold text-[#ea580c]">
            ผู้ประกาศงาน
          </span>
        </div>

        <!-- แจ้งเตือน Error -->
        <div *ngIf="errorMessage" class="p-3.5 bg-red-50 border border-red-200 text-red-600 rounded-2xl text-xs font-semibold">
          {{ errorMessage }}
        </div>

        <!-- ฟอร์มกรอกข้อมูล -->
        <form (ngSubmit)="saveJob()" class="space-y-4 text-xs font-semibold">
          
          <div>
            <label class="block text-gray-700 mb-1.5 font-bold">ชื่อตำแหน่งงาน <span class="text-red-500">*</span></label>
            <input 
              type="text" 
              [(ngModel)]="title" 
              name="title" 
              required
              placeholder="เช่น Full Stack Developer"
              class="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#ea580c] transition">
          </div>

          <!-- เลือกบริษัท -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-gray-700 mb-1.5 font-bold">เลือกบริษัท <span class="text-red-500">*</span></label>
              <select 
                [(ngModel)]="companyId" 
                name="companyId"
                required
                class="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-[#ea580c] transition">
                <option *ngFor="let c of companies" [ngValue]="c.id">
                  {{ c.name }}
                </option>
              </select>
            </div>

            <!-- สายงาน / Category -->
            <div>
              <label class="block text-gray-700 mb-1.5 font-bold">สายงาน / หมวดหมู่ <span class="text-red-500">*</span></label>
              <select 
                [(ngModel)]="category" 
                name="category"
                class="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-[#ea580c] transition">
                <option value="DEVELOPMENT">Software & Web Development</option>
                <option value="DESIGN">Design & Multimedia</option>
                <option value="MARKETING">Digital Marketing</option>
                <option value="BUSINESS">Business & Management</option>
                <option value="DATA">Data Science & AI</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-gray-700 mb-1.5 font-bold">ประเภทงาน</label>
              <select 
                [(ngModel)]="jobType" 
                name="jobType"
                class="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-[#ea580c] transition">
                <option value="INTERNSHIP">ฝึกงาน (Internship)</option>
                <option value="FULL_TIME">งานประจำ (Full-Time)</option>
                <option value="PART_TIME">งานพาร์ทไทม์ (Part-Time)</option>
              </select>
            </div>

            <div>
              <label class="block text-gray-700 mb-1.5 font-bold">รูปแบบการทำงาน</label>
              <select 
                [(ngModel)]="workplaceType" 
                name="workplaceType"
                class="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-[#ea580c] transition">
                <option value="HYBRID">Hybrid</option>
                <option value="ON_SITE">On-Site</option>
                <option value="REMOTE">Remote</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-gray-700 mb-1.5 font-bold">สถานที่ / จังหวัด <span class="text-red-500">*</span></label>
            <input 
              type="text" 
              [(ngModel)]="location" 
              name="location" 
              required
              placeholder="เช่น นครศรีธรรมราช, กรุงเทพมหานคร"
              class="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#ea580c] transition">
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-gray-700 mb-1.5 font-bold">ค่าตอบแทนขั้นต่ำ (บาท)</label>
              <input 
                type="number" 
                [(ngModel)]="stipendMin" 
                name="stipendMin" 
                placeholder="เช่น 15000"
                class="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#ea580c] transition">
            </div>
            <div>
              <label class="block text-gray-700 mb-1.5 font-bold">ค่าตอบแทนสูงสุด (บาท)</label>
              <input 
                type="number" 
                [(ngModel)]="stipendMax" 
                name="stipendMax" 
                placeholder="เช่น 25000"
                class="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#ea580c] transition">
            </div>
          </div>

          <!-- วันปิดรับสมัคร -->
          <div>
            <label class="block text-gray-700 mb-1.5 font-bold">วันปิดรับสมัคร <span class="text-red-500">*</span></label>
            <input 
              type="date" 
              [(ngModel)]="applicationDeadline" 
              name="applicationDeadline" 
              required
              class="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-[#ea580c] transition">
          </div>

          <div>
            <label class="block text-gray-700 mb-1.5 font-bold">รายละเอียดงาน <span class="text-red-500">*</span></label>
            <textarea 
              [(ngModel)]="description" 
              name="description" 
              rows="3" 
              required
              placeholder="ระบุหน้าที่ความรับผิดชอบเบื้องต้น..."
              class="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#ea580c] transition"></textarea>
          </div>

          <!-- คุณสมบัติผู้สมัคร -->
          <div>
            <label class="block text-gray-700 mb-1.5 font-bold">คุณสมบัติผู้สมัคร (Requirements) <span class="text-red-500">*</span></label>
            <textarea 
              [(ngModel)]="requirements" 
              name="requirements" 
              rows="3" 
              required
              placeholder="เช่น สามารถใช้งาน Angular, TypeScript หรือ Git ได้..."
              class="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#ea580c] transition"></textarea>
          </div>

          <div>
            <label class="block text-gray-700 mb-1.5 font-bold">อีเมลติดต่อรับสมัคร <span class="text-red-500">*</span></label>
            <input 
              type="email" 
              [(ngModel)]="contactEmail" 
              name="contactEmail" 
              required
              placeholder="hr@company.com"
              class="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#ea580c] transition">
          </div>

          <button 
            type="submit" 
            [disabled]="loading || companies.length === 0"
            class="w-full py-3 bg-[#ea580c] hover:bg-[#d94e08] text-white font-bold rounded-xl shadow-sm transition disabled:opacity-50 cursor-pointer">
            {{ loading ? 'กำลังบันทึกข้อมูล...' : 'ยืนยันและลงประกาศงาน' }}
          </button>
        </form>

      </div>
    </div>
  `
})
export class JobFormComponent implements OnInit {
  title = '';
  companyId: number | null = null;
  companies: any[] = [];

  category = 'DEVELOPMENT';
  jobType = 'FULL_TIME';
  workplaceType = 'HYBRID';
  location = 'นครศรีธรรมราช';
  stipendMin: number | null = 15000;
  stipendMax: number | null = 25000;
  applicationDeadline = '2026-12-31';
  description = '';
  requirements = '';
  contactEmail = '';

  loading = false;
  errorMessage = '';
  currentUser: any = null;

  private readonly apiUrl = window.location.hostname === 'localhost'
    ? 'http://localhost:3000/api'
    : 'https://internship-job-board.onrender.com/api';

  constructor(
    private jobService: JobService,
    private authService: AuthService,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser?.email) {
      this.contactEmail = this.currentUser.email;
    }
    this.loadCompanies();
  }

  loadCompanies(): void {
    this.http.get<any[]>(`${this.apiUrl}/companies`).subscribe({
      next: (data) => {
        if (data && data.length > 0) {
          this.companies = data;
          this.companyId = data[0].id;
        } else {
          this.companies = [{ id: 1, name: 'SCG' }];
          this.companyId = 1;
        }
      },
      error: () => {
        this.companies = [{ id: 1, name: 'SCG' }];
        this.companyId = 1;
      }
    });
  }

  saveJob(): void {
    if (!this.title || !this.companyId || !this.location || !this.description || !this.requirements || !this.contactEmail || !this.applicationDeadline) {
      this.errorMessage = 'กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วนทุกช่อง';
      return;
    }

    if (this.stipendMin && this.stipendMax && Number(this.stipendMax) < Number(this.stipendMin)) {
      this.errorMessage = 'ค่าตอบแทนสูงสุดต้องมากกว่าหรือเท่ากับค่าตอบแทนขั้นต่ำ';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    // ระบุชื่อผู้ใช้ปัจจุบัน
    const author = this.currentUser?.name || this.currentUser?.username || this.currentUser?.email?.split('@')[0] || 'User';

    // แนบ [posted_by:ชื่อผู้ใช้] ไว้ท้าย description เพื่อให้ถูกบันทึกลง Database ได้อย่างแน่นอน
    const combinedDescription = `${this.description.trim()} [posted_by:${author}]`;

    const payload = {
      title: this.title.trim(),
      companyId: Number(this.companyId),
      category: this.category,
      jobType: this.jobType,
      workplaceType: this.workplaceType,
      location: this.location.trim(),
      stipendMin: this.stipendMin ? Number(this.stipendMin) : 0,
      stipendMax: this.stipendMax ? Number(this.stipendMax) : 0,
      description: combinedDescription,
      requirements: this.requirements.trim(),
      applicationDeadline: this.applicationDeadline,
      contactEmail: this.contactEmail.trim(),
      postedBy: author
    };

    this.jobService.createJob(payload).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/jobs']);
      },
      error: (err) => {
        this.loading = false;
        const msg = err?.error?.message;
        this.errorMessage = Array.isArray(msg) ? msg.join(', ') : (msg || 'บันทึกไม่สำเร็จ กรุณาตรวจสอบข้อมูล');
      }
    });
  }
}