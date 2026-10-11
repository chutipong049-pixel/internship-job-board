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
    <div class="min-h-screen bg-[#faf7f2] font-['Kanit'] py-10 px-4 sm:px-6 lg:px-8">
      <div class="max-w-4xl mx-auto space-y-6">

        <div class="flex items-center justify-between">
          <a routerLink="/" class="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-[#ea580c] transition">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
            </svg>
            ยกเลิกและกลับไปหน้ารวมงาน
          </a>
          <span class="px-3.5 py-1.5 bg-orange-50 border border-orange-200 text-[#ea580c] text-xs font-bold rounded-full">
            {{ isEditMode ? 'โหมดแก้ไขประกาศ (Edit Mode)' : 'โหมดลงประกาศใหม่ (Create Mode)' }}
          </span>
        </div>

        <div class="bg-white rounded-3xl shadow-sm border border-orange-100 overflow-hidden">
          
          <div class="bg-gradient-to-r from-orange-500 to-[#ea580c] text-white px-8 py-7 shadow-sm">
            <h1 class="text-2xl font-black tracking-tight flex items-center gap-2.5">
              ลงประกาศรับสมัครงาน / ที่ฝึกงาน
            </h1>
            <p class="text-xs text-orange-100 mt-1.5 font-medium">
              กรอกข้อมูลรายละเอียดตำแหน่งงานเพื่อให้นักศึกษาและผู้สนใจสามารถค้นหาและสมัครได้
            </p>
          </div>

          <form (ngSubmit)="saveJob()" class="p-8 sm:p-10 space-y-8">

            <div class="bg-orange-50/70 border border-orange-200 rounded-2xl p-4 text-xs space-y-1.5 text-orange-950">
              <div class="font-bold flex items-center gap-1.5 text-orange-800">
                กฎทางธุรกิจของระบบ (Business Rule Reminder):
              </div>
              <ul class="list-disc list-inside text-gray-600 pl-2 space-y-1">
                <li>เบี้ยเลี้ยงสูงสุด (Stipend Max) ต้องมากกว่าหรือเท่ากับเบี้ยเลี้ยงขั้นต่ำ (Stipend Min) เสมอ</li>
                <li>วันเปิดรับสมัครงานต้องเป็นวันในอนาคตสำหรับงานที่เปิดรับสมัคร</li>
              </ul>
            </div>

            <div *ngIf="errorMessage" class="p-4 bg-red-50 border border-red-200 text-red-600 rounded-2xl text-xs font-medium">
              {{ errorMessage }}
            </div>

            <div class="space-y-4">
              <h2 class="text-sm font-bold text-gray-900">
                1. ข้อมูลพื้นฐานของตำแหน่งงาน
              </h2>

              <div>
                <label class="block text-xs font-semibold text-gray-700 mb-1.5">ชื่อตำแหน่งงาน (Job Title) <span class="text-[#ea580c]">*</span></label>
                <input 
                  type="text" 
                  [(ngModel)]="formData.title" 
                  name="title" 
                  required
                  placeholder="เช่น Frontend Developer Intern"
                  class="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#ea580c] focus:ring-1 focus:ring-[#ea580c] transition">
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-semibold text-gray-700 mb-1.5">บริษัทผู้ว่าจ้าง (Company) <span class="text-[#ea580c]">*</span></label>
                  <select 
                    [(ngModel)]="formData.companyId" 
                    name="companyId" 
                    required
                    class="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:border-[#ea580c] transition">
                    <option [ngValue]="null" disabled>เลือกบริษัท</option>
                    <option *ngFor="let c of companies" [ngValue]="c.id">{{ c.name }}</option>
                  </select>
                </div>

                <div>
                  <label class="block text-xs font-semibold text-gray-700 mb-1.5">สายงาน (Category) <span class="text-[#ea580c]">*</span></label>
                  <select 
                    [(ngModel)]="formData.category" 
                    name="category" 
                    required
                    class="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:border-[#ea580c] transition">
                    <option value="Software Engineering">Software Engineering</option>
                    <option value="Data & AI">Data & AI</option>
                    <option value="Design & Multimedia">Design & Multimedia</option>
                    <option value="Marketing & Content">Marketing & Content</option>
                    <option value="Business & Management">Business & Management</option>
                  </select>
                </div>

                <div>
                  <label class="block text-xs font-semibold text-gray-700 mb-1.5">ประเภทงาน (Job Type) <span class="text-[#ea580c]">*</span></label>
                  <select 
                    [(ngModel)]="formData.jobType" 
                    name="jobType" 
                    required
                    class="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:border-[#ea580c] transition">
                    <option value="INTERNSHIP">ฝึกงาน (Internship)</option>
                    <option value="FULL_TIME">งานประจำ (Full-time)</option>
                    <option value="PART_TIME">งานพาร์ทไทม์ (Part-time)</option>
                  </select>
                </div>

                <div>
                  <label class="block text-xs font-semibold text-gray-700 mb-1.5">สถานที่ทำงาน (Workplace) <span class="text-[#ea580c]">*</span></label>
                  <select 
                    [(ngModel)]="formData.workplaceType" 
                    name="workplaceType" 
                    required
                    class="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:border-[#ea580c] transition">
                    <option value="HYBRID">ไฮบริด (Hybrid)</option>
                    <option value="ON_SITE">เข้าทำงานที่ออฟฟิศ (On-site)</option>
                    <option value="REMOTE">ทำงานจากที่บ้าน (Remote)</option>
                  </select>
                </div>
              </div>

              <div>
                <label class="block text-xs font-semibold text-gray-700 mb-1.5">สถานที่ปฏิบัติงาน (Location Address) <span class="text-[#ea580c]">*</span></label>
                <input 
                  type="text" 
                  [(ngModel)]="formData.location" 
                  name="location" 
                  required
                  placeholder="เช่น กรุงเทพมหานคร"
                  class="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#ea580c] transition">
              </div>
            </div>

            <hr class="border-gray-100"/>

            <div class="space-y-4">
              <h2 class="text-sm font-bold text-gray-900">
                2. ค่าตอบแทนและกำหนดการ
              </h2>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label class="block text-xs font-semibold text-gray-700 mb-1.5">เบี้ยเลี้ยงต่ำสุด (บาท/เดือน)</label>
                  <input 
                    type="number" 
                    [(ngModel)]="formData.stipendMin" 
                    name="stipendMin" 
                    placeholder="เช่น 10000"
                    class="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#ea580c] transition">
                </div>

                <div>
                  <label class="block text-xs font-semibold text-gray-700 mb-1.5">เบี้ยเลี้ยงสูงสุด (บาท/เดือน)</label>
                  <input 
                    type="number" 
                    [(ngModel)]="formData.stipendMax" 
                    name="stipendMax" 
                    placeholder="เช่น 15000"
                    class="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#ea580c] transition">
                </div>

                <div>
                  <label class="block text-xs font-semibold text-gray-700 mb-1.5">วันปิดรับสมัคร (Deadline) <span class="text-[#ea580c]">*</span></label>
                  <input 
                    type="date" 
                    [(ngModel)]="formData.applicationDeadline" 
                    name="applicationDeadline" 
                    required
                    class="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:border-[#ea580c] transition">
                </div>
              </div>
            </div>

            <hr class="border-gray-100"/>

            <div class="space-y-4">
              <h2 class="text-sm font-bold text-gray-900">
                3. รายละเอียดและคุณสมบัติ
              </h2>

              <div>
                <label class="block text-xs font-semibold text-gray-700 mb-1.5">รายละเอียดหน้าที่ความรับผิดชอบ <span class="text-[#ea580c]">*</span></label>
                <textarea 
                  [(ngModel)]="formData.description" 
                  name="description" 
                  rows="4" 
                  required
                  placeholder="อธิบายลักษณะงาน..."
                  class="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#ea580c] transition"></textarea>
              </div>

              <div>
                <label class="block text-xs font-semibold text-gray-700 mb-1.5">คุณสมบัติผู้สมัคร (Requirements) <span class="text-[#ea580c]">*</span></label>
                <textarea 
                  [(ngModel)]="formData.requirements" 
                  name="requirements" 
                  rows="3" 
                  required
                  placeholder="คุณสมบัติที่ต้องการ..."
                  class="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#ea580c] transition"></textarea>
              </div>

              <div>
                <label class="block text-xs font-semibold text-gray-700 mb-1.5">สวัสดิการ (Benefits)</label>
                <textarea 
                  [(ngModel)]="formData.benefits" 
                  name="benefits" 
                  rows="3" 
                  placeholder="สวัสดิการเพิ่มเติม..."
                  class="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#ea580c] transition"></textarea>
              </div>
            </div>

            <hr class="border-gray-100"/>

            <div class="space-y-4">
              <h2 class="text-sm font-bold text-gray-900">
                4. ข้อมูลการสมัครและสถานะ
              </h2>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label class="block text-xs font-semibold text-gray-700 mb-1.5">อีเมลติดต่อ <span class="text-[#ea580c]">*</span></label>
                  <input 
                    type="email" 
                    [(ngModel)]="formData.contactEmail" 
                    name="contactEmail" 
                    required
                    placeholder="hr@example.com"
                    class="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#ea580c] transition">
                </div>

                <div>
                  <label class="block text-xs font-semibold text-gray-700 mb-1.5">
                    ลิงก์ระบบรับสมัคร <span class="text-gray-400 font-normal">(ถ้ามี)</span>
                  </label>
                  <input 
                    type="url" 
                    [(ngModel)]="formData.applicationUrl" 
                    name="applicationUrl" 
                    placeholder="https://company.com/apply"
                    class="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#ea580c] transition">
                </div>

                <div>
                  <label class="block text-xs font-semibold text-gray-700 mb-1.5">สถานะการรับสมัคร</label>
                  <select 
                    [(ngModel)]="formData.status" 
                    name="status"
                    class="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:border-[#ea580c] transition">
                    <option value="OPEN">เปิดรับสมัคร (OPEN)</option>
                    <option value="CLOSED">ปิดรับสมัคร (CLOSED)</option>
                  </select>
                </div>
              </div>
            </div>

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
                class="px-8 py-3 bg-[#ea580c] hover:bg-[#d94e08] text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer disabled:opacity-50">
                {{ loading ? 'กำลังบันทึก...' : (isEditMode ? 'อัปเดตประกาศงาน' : 'บันทึกประกาศงาน') }}
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
    companyId: 1,
    category: 'Software Engineering',
    jobType: 'INTERNSHIP',
    workplaceType: 'HYBRID',
    location: '',
    stipendMin: null,
    stipendMax: null,
    applicationDeadline: '',
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
    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() + 30);
    this.formData.applicationDeadline = defaultDate.toISOString().split('T')[0];

    this.loadCompanies();
    this.jobId = this.route.snapshot.paramMap.get('id');
    if (this.jobId) {
      this.isEditMode = true;
      this.loadJobDetail(this.jobId);
    }
  }

  loadCompanies(): void {
    this.jobService.getCompanies().subscribe({
      next: (data: any[]) => {
        if (data && data.length > 0) {
          this.companies = data;
          if (!this.isEditMode) {
            this.formData.companyId = data[0].id;
          }
        } else {
          this.setDefaultCompanies();
        }
      },
      error: () => this.setDefaultCompanies()
    });
  }

  setDefaultCompanies(): void {
    this.companies = [
      { id: 1, name: 'SCG' },
      { id: 2, name: 'Intel' },
      { id: 3, name: 'Microsoft' },
      { id: 4, name: 'Google' },
      { id: 5, name: 'Shopee' }
    ];
    if (!this.formData.companyId) {
      this.formData.companyId = 1;
    }
  }

  loadJobDetail(id: string): void {
    this.jobService.getJobById(id).subscribe({
      next: (job: any) => {
        this.formData = {
          ...job,
          jobType: job.jobType || job.type || 'INTERNSHIP',
          workplaceType: job.workplaceType || job.workplace || 'HYBRID',
          companyId: Number(job.companyId),
          applicationDeadline: job.applicationDeadline 
            ? new Date(job.applicationDeadline).toISOString().split('T')[0] 
            : '',
          applicationUrl: job.applicationUrl || job.applyUrl || ''
        };
      },
      error: () => {
        this.errorMessage = 'ไม่สามารถโหลดข้อมูลประกาศงานได้';
      }
    });
  }

  saveJob(): void {
    this.errorMessage = '';

    if (!this.formData.title || !this.formData.description || !this.formData.contactEmail) {
      this.errorMessage = 'กรุณากรอกข้อมูลที่จำเป็น (*) ให้ครบถ้วน';
      return;
    }

    if (!this.formData.applicationDeadline) {
      this.errorMessage = 'กรุณากำหนดวันปิดรับสมัคร (Deadline)';
      return;
    }

    if (this.formData.stipendMin && this.formData.stipendMax) {
      if (Number(this.formData.stipendMax) < Number(this.formData.stipendMin)) {
        this.errorMessage = 'เบี้ยเลี้ยงสูงสุดต้องมากกว่าหรือเท่ากับเบี้ยเลี้ยงขั้นต่ำ';
        return;
      }
    }

    this.loading = true;

    const payload: any = {
      title: this.formData.title.trim(),
      companyId: Number(this.formData.companyId),
      category: this.formData.category,
      jobType: this.formData.jobType,
      workplaceType: this.formData.workplaceType,
      location: this.formData.location.trim(),
      description: this.formData.description.trim(),
      requirements: this.formData.requirements.trim(),
      benefits: this.formData.benefits ? this.formData.benefits.trim() : '',
      contactEmail: this.formData.contactEmail.trim(),
      applicationDeadline: this.formData.applicationDeadline,
      status: this.formData.status || 'OPEN',
      stipendMin: this.formData.stipendMin ? Number(this.formData.stipendMin) : 0,
      stipendMax: this.formData.stipendMax ? Number(this.formData.stipendMax) : 0
    };

    if (this.formData.applicationUrl && this.formData.applicationUrl.trim()) {
      payload.applicationUrl = this.formData.applicationUrl.trim();
      payload.applyUrl = this.formData.applicationUrl.trim();
    }

    const action$ = (this.isEditMode && this.jobId)
      ? this.jobService.updateJob(this.jobId, payload)
      : this.jobService.createJob(payload);

    action$.subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/jobs']);
      },
      error: (err: any) => {
        this.loading = false;
        if (err?.error?.message) {
          this.errorMessage = Array.isArray(err.error.message)
            ? err.error.message.join(', ')
            : err.error.message;
        } else {
          this.errorMessage = 'เกิดข้อผิดพลาดในการบันทึกข้อมูล กรุณาลองใหม่อีกครั้ง';
        }
      }
    });
  }
}