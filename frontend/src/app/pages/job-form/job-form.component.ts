import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { JobService } from '../../services/job.service';

@Component({
  selector: 'app-job-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="min-h-screen bg-gray-50/50 py-10 px-4 sm:px-6 lg:px-8">
      <div class="max-w-4xl mx-auto space-y-6">

        <!-- แถบด้านบน: ปุ่มย้อนกลับและสถานะโหมด -->
        <div class="flex items-center justify-between">
          <a routerLink="/" class="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-orange-600 transition">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
            </svg>
            ยกเลิกและกลับไปหน้ารวมงาน
          </a>
          <span class="px-3.5 py-1.5 bg-orange-50 border border-orange-200/80 text-orange-700 text-xs font-bold rounded-full">
            {{ isEditMode ? 'โหมดแก้ไขประกาศ (Edit Mode)' : 'โหมดลงประกาศใหม่ (Create Mode)' }}
          </span>
        </div>

        <!-- การ์ดฟอร์มหลัก -->
        <div class="bg-white rounded-3xl shadow-sm border border-orange-100 overflow-hidden">
          
          <!-- แบนเนอร์หัวการ์ดสีส้มสดใสตามธีมหลัก -->
          <div class="bg-gradient-to-r from-orange-500 to-[#ea580c] text-white px-8 py-7 shadow-sm">
            <h1 class="text-2xl font-black tracking-tight text-white flex items-center gap-2.5">
              <span>📢</span> ลงประกาศรับสมัครงาน / ที่ฝึกงาน
            </h1>
            <p class="text-xs text-orange-100 mt-1.5 font-medium">
              กรอกข้อมูลรายละเอียดตำแหน่งงานเพื่อให้นักศึกษาและผู้สนใจสามารถค้นหาและสมัครได้
            </p>
          </div>

          <form (ngSubmit)="saveJob()" class="p-8 sm:p-10 space-y-8">

            <!-- กล่องเตือนเงื่อนไข Business Rule -->
            <div class="bg-orange-50/70 border border-orange-200 rounded-2xl p-4 text-xs space-y-1.5 text-orange-950">
              <div class="font-bold flex items-center gap-1.5 text-orange-800">
                <span>💡</span> กฎทางธุรกิจของระบบ (Business Rule Reminder):
              </div>
              <ul class="list-disc list-inside text-gray-600 pl-2 space-y-1">
                <li>เบี้ยเลี้ยงสูงสุด (Stipend Max) ต้องมากกว่าหรือเท่ากับเบี้ยเลี้ยงขั้นต่ำ (Stipend Min) เสมอ</li>
                <li>วันเปิดรับสมัครงานต้องเป็นวันในอนาคตสำหรับงานที่เปิดรับสมัคร</li>
              </ul>
            </div>

            <!-- ข้อความแจ้งเตือน Error -->
            <div *ngIf="errorMessage" class="p-4 bg-red-50 border border-red-200 text-red-600 rounded-2xl text-xs font-medium">
              {{ errorMessage }}
            </div>

            <!-- หมวดที่ 1: ข้อมูลพื้นฐาน -->
            <div class="space-y-4">
              <h2 class="text-sm font-bold text-gray-900 flex items-center gap-2">
                1. ข้อมูลพื้นฐานของตำแหน่งงาน
              </h2>

              <div>
                <label class="block text-xs font-semibold text-gray-700 mb-1.5">ชื่อตำแหน่งงาน (Job Title) <span class="text-orange-600">*</span></label>
                <input 
                  type="text" 
                  [(ngModel)]="formData.title" 
                  name="title" 
                  required
                  placeholder="เช่น Frontend Developer Intern (Angular)"
                  class="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition">
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-semibold text-gray-700 mb-1.5">บริษัทผู้ว่าจ้าง (Company) <span class="text-orange-600">*</span></label>
                  <select 
                    [(ngModel)]="formData.companyId" 
                    name="companyId" 
                    required
                    class="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition">
                    <option value="" disabled selected>เลือกบริษัท</option>
                    <option *ngFor="let c of companies" [value]="c.id">{{ c.name }}</option>
                  </select>
                </div>

                <div>
                  <label class="block text-xs font-semibold text-gray-700 mb-1.5">สายงาน (Category) <span class="text-orange-600">*</span></label>
                  <select 
                    [(ngModel)]="formData.category" 
                    name="category" 
                    required
                    class="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition">
                    <option value="Software Engineering">Software Engineering</option>
                    <option value="Data & AI">Data & AI</option>
                    <option value="Design & Multimedia">Design & Multimedia</option>
                    <option value="Marketing & Content">Marketing & Content</option>
                    <option value="Business & Management">Business & Management</option>
                  </select>
                </div>

                <div>
                  <label class="block text-xs font-semibold text-gray-700 mb-1.5">ประเภทงาน (Job Type) <span class="text-orange-600">*</span></label>
                  <select 
                    [(ngModel)]="formData.type" 
                    name="type" 
                    required
                    class="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition">
                    <option value="INTERNSHIP">ฝึกงาน (Internship)</option>
                    <option value="FULL_TIME">งานประจำ (Full-time)</option>
                    <option value="PART_TIME">งานพาร์ทไทม์ (Part-time)</option>
                    <option value="CONTRACT">สัญญาจ้าง (Contract)</option>
                  </select>
                </div>

                <div>
                  <label class="block text-xs font-semibold text-gray-700 mb-1.5">สถานที่ทำงาน (Workplace) <span class="text-orange-600">*</span></label>
                  <select 
                    [(ngModel)]="formData.workplace" 
                    name="workplace" 
                    required
                    class="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition">
                    <option value="HYBRID">ไฮบริด (Hybrid)</option>
                    <option value="ON_SITE">เข้าทำงานที่ออฟฟิศ (On-site)</option>
                    <option value="REMOTE">ทำงานจากที่บ้าน (Remote)</option>
                  </select>
                </div>
              </div>

              <div>
                <label class="block text-xs font-semibold text-gray-700 mb-1.5">สถานที่ปฏิบัติงาน (Location Address) <span class="text-orange-600">*</span></label>
                <input 
                  type="text" 
                  [(ngModel)]="formData.location" 
                  name="location" 
                  required
                  placeholder="เช่น Bangkok (BTS สยาม) หรือ เมืองทองธานี นนทบุรี"
                  class="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition">
              </div>
            </div>

            <hr class="border-gray-100"/>

            <!-- หมวดที่ 2: ค่าตอบแทน -->
            <div class="space-y-4">
              <h2 class="text-sm font-bold text-gray-900 flex items-center gap-2">
                2. ค่าตอบแทนและค่าชดเชย (Stipend & Compensation)
              </h2>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-semibold text-gray-700 mb-1.5">เบี้ยเลี้ยงต่ำสุด (บาท/เดือน)</label>
                  <input 
                    type="number" 
                    [(ngModel)]="formData.stipendMin" 
                    name="stipendMin" 
                    placeholder="เช่น 10000"
                    class="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition">
                </div>

                <div>
                  <label class="block text-xs font-semibold text-gray-700 mb-1.5">เบี้ยเลี้ยงสูงสุด (บาท/เดือน)</label>
                  <input 
                    type="number" 
                    [(ngModel)]="formData.stipendMax" 
                    name="stipendMax" 
                    placeholder="เช่น 15000"
                    class="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition">
                </div>
              </div>
            </div>

            <hr class="border-gray-100"/>

            <!-- หมวดที่ 3: รายละเอียดงาน -->
            <div class="space-y-4">
              <h2 class="text-sm font-bold text-gray-900 flex items-center gap-2">
                3. รายละเอียดและคุณสมบัติ
              </h2>

              <div>
                <label class="block text-xs font-semibold text-gray-700 mb-1.5">รายละเอียดและหน้าที่ความรับผิดชอบ <span class="text-orange-600">*</span></label>
                <textarea 
                  [(ngModel)]="formData.description" 
                  name="description" 
                  rows="4" 
                  required
                  placeholder="อธิบายลักษณะงานที่ต้องปฏิบัติในแต่ละวัน..."
                  class="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition"></textarea>
              </div>

              <div>
                <label class="block text-xs font-semibold text-gray-700 mb-1.5">คุณสมบัติผู้สมัคร (Requirements) <span class="text-orange-600">*</span></label>
                <textarea 
                  [(ngModel)]="formData.requirements" 
                  name="requirements" 
                  rows="3" 
                  required
                  placeholder="- นักศึกษาชั้นปีที่ 3-4 สาขาคอมพิวเตอร์&#10;- สามารถใช้งาน HTML, CSS, JavaScript / TypeScript ได้"
                  class="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition"></textarea>
              </div>

              <div>
                <label class="block text-xs font-semibold text-gray-700 mb-1.5">สวัสดิการและสิ่งที่จะได้รับ (Benefits & Perks)</label>
                <textarea 
                  [(ngModel)]="formData.benefits" 
                  name="benefits" 
                  rows="3"
                  placeholder="- ฟรีอาหารกลางวัน และเครื่องดื่ม&#10;- โควตาบรรจุงานประจำหลังเรียนจบ"
                  class="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition"></textarea>
              </div>
            </div>

            <hr class="border-gray-100"/>

            <!-- หมวดที่ 4: ข้อมูลการสมัครและสถานะ -->
            <div class="space-y-4">
              <h2 class="text-sm font-bold text-gray-900 flex items-center gap-2">
                4. ข้อมูลการสมัครและสถานะ
              </h2>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label class="block text-xs font-semibold text-gray-700 mb-1.5">อีเมลติดต่อรับสมัคร <span class="text-orange-600">*</span></label>
                  <input 
                    type="email" 
                    [(ngModel)]="formData.contactEmail" 
                    name="contactEmail" 
                    required
                    placeholder="hr@example.com"
                    class="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition">
                </div>

                <!-- ปลดล็อกให้ไม่ต้องบังคับใส่ลิงก์ ไม่ใส่ก็บันทึกได้ -->
                <div>
                  <label class="block text-xs font-semibold text-gray-700 mb-1.5">
                    ลิงก์ระบบรับสมัคร <span class="text-gray-400 font-normal">(ถ้ามี)</span>
                  </label>
                  <input 
                    type="url" 
                    [(ngModel)]="formData.applicationUrl" 
                    name="applicationUrl" 
                    placeholder="https://company.com/apply (เว้นว่างได้)"
                    class="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition">
                </div>

                <div>
                  <label class="block text-xs font-semibold text-gray-700 mb-1.5">สถานะการรับสมัคร (Status)</label>
                  <select 
                    [(ngModel)]="formData.status" 
                    name="status"
                    class="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition">
                    <option value="OPEN">เปิดรับสมัคร (OPEN)</option>
                    <option value="CLOSED">ปิดรับสมัคร (CLOSED)</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- ปุ่มกดยกเลิกและบันทึกข้อมูลธีมสีส้ม -->
            <div class="flex items-center justify-end gap-3 pt-6 border-t border-gray-100">
              <button 
                type="button" 
                routerLink="/"
                class="px-6 py-3 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100 transition cursor-pointer">
                ยกเลิก
              </button>
              <button 
                type="submit" 
                [disabled]="loading"
                class="px-8 py-3 bg-[#ea580c] hover:bg-[#d94e08] active:bg-[#c2410c] text-white font-bold text-xs rounded-xl shadow-md shadow-orange-500/20 transition cursor-pointer disabled:opacity-50">
                {{ loading ? 'กำลังบันทึก...' : (isEditMode ? 'อัปเดตประกาศงาน' : 'บันทึกประกาศงาน (Post Job)') }}
              </button>
            </div>

          </form>
        </div>

      </div>
    </div>
  `
})
export class JobFormComponent implements OnInit {
  isEditMode = false;
  jobId: string | null = null;
  loading = false;
  errorMessage = '';

  companies: any[] = [];

  formData: any = {
    title: '',
    companyId: '',
    category: 'Software Engineering',
    type: 'INTERNSHIP',
    workplace: 'HYBRID',
    location: '',
    stipendMin: null,
    stipendMax: null,
    description: '',
    requirements: '',
    benefits: '',
    contactEmail: '',
    applicationUrl: '',
    status: 'OPEN'
  };

  constructor(
    private jobService: JobService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadCompanies();
    this.jobId = this.route.snapshot.paramMap.get('id');
    if (this.jobId) {
      this.isEditMode = true;
      this.loadJobDetail(this.jobId);
    }
  }

  loadCompanies(): void {
    const serviceAny = this.jobService as any;
    if (typeof serviceAny.getCompanies === 'function') {
      serviceAny.getCompanies().subscribe({
        next: (data: any[]) => this.companies = data,
        error: () => this.setDefaultCompanies()
      });
    } else {
      this.setDefaultCompanies();
    }
  }

  setDefaultCompanies(): void {
    this.companies = [
      { id: '1', name: 'Google (Technology & AI)' },
      { id: '2', name: 'Shopee (E-Commerce)' },
      { id: '3', name: 'SCG (Conglomerate)' },
      { id: '4', name: 'Microsoft (Cloud & Tech)' },
      { id: '5', name: 'Intel (Hardware & Systems)' }
    ];
    if (!this.formData.companyId) {
      this.formData.companyId = this.companies[0].id;
    }
  }

  loadJobDetail(id: string): void {
    const serviceAny = this.jobService as any;
    const fetch$ = typeof serviceAny.getJobById === 'function' 
      ? serviceAny.getJobById(id) 
      : serviceAny.getJob(id);

    if (fetch$) {
      fetch$.subscribe({
        next: (job: any) => {
          this.formData = {
            ...job,
            applicationUrl: job.applicationUrl || ''
          };
        },
        error: () => {
          this.errorMessage = 'ไม่สามารถโหลดข้อมูลประกาศงานเดิมได้';
        }
      });
    }
  }

  saveJob(): void {
    this.errorMessage = '';

    // ตรวจสอบเฉพาะฟิลด์ที่จำเป็น (applicationUrl ปล่อยว่างได้ ไม่ติดเงื่อนไข)
    if (!this.formData.title || !this.formData.description || !this.formData.contactEmail) {
      this.errorMessage = 'กรุณากรอกข้อมูลที่จำเป็น (*) ให้ครบถ้วน';
      return;
    }

    // Business Rule: ตรวจสอบเบี้ยเลี้ยงสูงสุด/ต่ำสุด
    if (this.formData.stipendMin && this.formData.stipendMax) {
      if (Number(this.formData.stipendMax) < Number(this.formData.stipendMin)) {
        this.errorMessage = 'เบี้ยเลี้ยงสูงสุด (Stipend Max) ต้องมากกว่าหรือเท่ากับเบี้ยเลี้ยงขั้นต่ำ (Stipend Min)';
        return;
      }
    }

    this.loading = true;

    const payload: any = {
      ...this.formData,
      stipendMin: this.formData.stipendMin ? Number(this.formData.stipendMin) : null,
      stipendMax: this.formData.stipendMax ? Number(this.formData.stipendMax) : null,
      applicationUrl: this.formData.applicationUrl ? String(this.formData.applicationUrl).trim() : null
    };

    const targetId = this.jobId ? String(this.jobId) : '';
    const serviceAny = this.jobService as any;

    const action$ = (this.isEditMode && targetId)
      ? serviceAny.updateJob(targetId, payload)
      : serviceAny.createJob(payload);

    (action$ as any).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/']);
      },
      error: (err: any) => {
        this.loading = false;
        this.errorMessage = err?.error?.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล กรุณาลองใหม่อีกครั้ง';
      }
    });
  }
}