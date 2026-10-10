import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { JobService } from '../../services/job.service';
import { Job } from '../../models/job.model';

@Component({
  selector: 'app-job-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="min-h-screen bg-slate-50/60 py-8">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Back Navigation & Action Bar -->
        <div class="flex flex-wrap items-center justify-between gap-4 mb-6">
          <a
            routerLink="/jobs"
            class="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            <span>ย้อนกลับไปหน้ารวมตำแหน่งงาน</span>
          </a>

          @if (job) {
            <div class="flex items-center gap-3">
              <!-- Edit Button -->
              <a
                [routerLink]="['/jobs', job.id, 'edit']"
                class="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl shadow-sm transition-colors">
                <svg class="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
                <span>แก้ไขประกาศ (Edit)</span>
              </a>

              <!-- Delete Button -->
              <button
                (click)="openDeleteModal()"
                class="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200/80 rounded-xl transition-colors">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
                <span>ลบประกาศ (Delete)</span>
              </button>
            </div>
          }
        </div>

        <!-- 1. LOADING STATE -->
        @if (isLoading) {
          <div class="bg-white rounded-2xl p-12 border border-slate-200 shadow-sm text-center">
            <svg class="animate-spin h-8 w-8 text-indigo-600 mx-auto mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
            </svg>
            <p class="text-slate-600 text-sm font-medium">กำลังโหลดรายละเอียดตำแหน่งงาน...</p>
          </div>
        }

        <!-- 2. ERROR STATE -->
        @else if (hasError) {
          <div class="bg-red-50 border border-red-200 rounded-2xl p-8 text-center max-w-lg mx-auto">
            <h3 class="text-base font-bold text-red-900 mb-1">ไม่พบข้อมูลตำแหน่งงาน</h3>
            <p class="text-sm text-red-700 mb-6">{{ errorMessage }}</p>
            <a
              routerLink="/jobs"
              class="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-xl">
              กลับสู่หน้ารวมงาน
            </a>
          </div>
        }

        <!-- 3. JOB DETAIL CONTENT -->
        @else if (job) {
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Left / Main Column (2 spans) -->
            <div class="lg:col-span-2 space-y-6">
              <!-- Header Card -->
              <div class="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm">
                <!-- Status & Date -->
                <div class="flex flex-wrap items-center justify-between gap-2 mb-4">
                  <span class="text-xs text-slate-400">
                    ประกาศเมื่อ: {{ job.createdAt | date: 'dd/MM/yyyy' }}
                  </span>

                  <!-- Business Rule Status Indicator -->
                  @if (isJobClosed()) {
                    <span class="px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 border border-red-300 flex items-center gap-1.5">
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      ปิดรับสมัครแล้ว (Closed)
                    </span>
                  } @else {
                    <span class="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1.5">
                      <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      กำลังเปิดรับสมัคร (Open)
                    </span>
                  }
                </div>

                <h1 class="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
                  {{ job.title }}
                </h1>

                <!-- Badges -->
                <div class="flex flex-wrap gap-2 mb-6">
                  <span class="px-3 py-1 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                    {{ formatJobType(job.jobType) }}
                  </span>
                  <span class="px-3 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                    {{ formatWorkplace(job.workplaceType) }}
                  </span>
                  <span class="px-3 py-1 rounded-lg text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200">
                    {{ job.category }}
                  </span>
                  <span class="px-3 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                    📍 {{ job.location }}
                  </span>
                </div>

                <!-- Salary / Compensation Highlight -->
                <div class="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                  <div>
                    <span class="text-xs text-slate-500 block">เบี้ยเลี้ยง / อัตราค่าตอบแทน</span>
                    <span class="text-lg sm:text-xl font-bold text-indigo-700">
                      ฿{{ job.stipendMin | number }} - ฿{{ job.stipendMax | number }} / เดือน
                    </span>
                  </div>
                  <div class="text-right">
                    <span class="text-xs text-slate-500 block">วันปิดรับสมัคร</span>
                    <span class="text-xs font-bold text-slate-800">
                      {{ job.applicationDeadline | date: 'dd MMM yyyy' }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Business Rule Notice if Closed -->
              @if (isJobClosed()) {
                <div class="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl">
                  <div class="flex items-start">
                    <div class="flex-shrink-0 text-red-500 mt-0.5">
                      <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                      </svg>
                    </div>
                    <div class="ml-3">
                      <h3 class="text-xs font-bold text-red-800">เงื่อนไขทางธุรกิจ (Business Rule): ตำแหน่งงานนี้ปิดรับสมัครแล้ว</h3>
                      <p class="text-xs text-red-700 mt-1">
                        เนื่องจากสถานะของงานเป็น <strong>CLOSED</strong> หรือพ้นกำหนดวันปิดรับสมัครแล้ว ระบบจึงไม่อนุญาตให้นักศึกษาส่งใบสมัครในตำแหน่งงานนี้
                      </p>
                    </div>
                  </div>
                </div>
              }

              <!-- Description -->
              <div class="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
                <div>
                  <h2 class="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span class="w-2 h-5 bg-indigo-600 rounded-full"></span>
                    รายละเอียดงาน (Job Description)
                  </h2>
                  <p class="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                    {{ job.description }}
                  </p>
                </div>

                <!-- Requirements -->
                <div class="pt-6 border-t border-slate-100">
                  <h2 class="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span class="w-2 h-5 bg-violet-600 rounded-full"></span>
                    คุณสมบัติผู้สมัคร (Requirements)
                  </h2>
                  <p class="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                    {{ job.requirements }}
                  </p>
                </div>

                <!-- Benefits -->
                @if (job.benefits) {
                  <div class="pt-6 border-t border-slate-100">
                    <h2 class="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                      <span class="w-2 h-5 bg-emerald-600 rounded-full"></span>
                      สวัสดิการและสิ่งที่ได้รับ (Benefits & Perks)
                    </h2>
                    <p class="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                      {{ job.benefits }}
                    </p>
                  </div>
                }
              </div>
            </div>

            <!-- Right Column / Company Sidebar (1 span) -->
            <div class="space-y-6">
              <!-- Apply Action Card -->
              <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm sticky top-24">
                <h3 class="text-base font-bold text-slate-900 mb-4">สมัครตำแหน่งนี้</h3>

                @if (isJobClosed()) {
                  <button
                    disabled
                    class="w-full py-3 px-4 bg-slate-200 text-slate-400 font-semibold text-sm rounded-xl cursor-not-allowed mb-3">
                    ⛔ ปิดรับสมัครแล้ว (Closed)
                  </button>
                  <p class="text-[11px] text-slate-500 text-center">
                    ไม่สามารถส่งใบสมัครได้เนื่องจากสิ้นสุดระยะเวลา
                  </p>
                } @else {
                  <button
                    (click)="openApplyModal()"
                    class="w-full py-3.5 px-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-semibold text-sm rounded-xl shadow-md shadow-indigo-500/25 transition-all mb-3 flex items-center justify-center gap-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span>ส่งใบสมัคร (Apply Now)</span>
                  </button>

                  <a
                    [href]="'mailto:' + job.contactEmail + '?subject=สมัครงาน: ' + job.title"
                    class="w-full py-2.5 px-4 bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium text-xs rounded-xl border border-slate-200 text-center block transition-colors">
                    ✉️ ส่งอีเมลหาฝ่ายบุคคลโดยตรง
                  </a>
                }

                <div class="mt-4 pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-500">
                  <div class="flex justify-between">
                    <span>อีเมลติดต่อ:</span>
                    <strong class="text-slate-800">{{ job.contactEmail }}</strong>
                  </div>
                  <div class="flex justify-between">
                    <span>รหัสประกาศ:</span>
                    <span class="text-slate-600">#JOB-{{ job.id }}</span>
                  </div>
                </div>
              </div>

              <!-- Company Information Card -->
              @if (job.company) {
                <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                  <div class="flex items-center gap-4 mb-4">
                    <img
                      [src]="job.company.logo || 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=128&auto=format&fit=crop&q=80'"
                      [alt]="job.company.name"
                      class="w-14 h-14 rounded-xl object-cover border border-slate-100 shadow-sm"
                    />
                    <div>
                      <h4 class="text-sm font-bold text-slate-900">{{ job.company.name }}</h4>
                      <span class="text-xs text-indigo-600 font-medium">{{ job.company.industry }}</span>
                    </div>
                  </div>

                  @if (job.company.description) {
                    <p class="text-xs text-slate-600 mb-4 line-clamp-4 leading-relaxed">
                      {{ job.company.description }}
                    </p>
                  }

                  <div class="space-y-2.5 text-xs text-slate-600 pt-3 border-t border-slate-100">
                    <div class="flex items-center gap-2">
                      <span class="text-slate-400">📍</span>
                      <span>{{ job.company.location }}</span>
                    </div>
                    @if (job.company.website) {
                      <div class="flex items-center gap-2">
                        <span class="text-slate-400">🌐</span>
                        <a [href]="job.company.website" target="_blank" class="text-indigo-600 hover:underline">
                          {{ job.company.website }}
                        </a>
                      </div>
                    }
                    <div class="flex items-center gap-2">
                      <span class="text-slate-400">✉️</span>
                      <span>{{ job.company.email }}</span>
                    </div>
                  </div>
                </div>
              }
            </div>
          </div>
        }
      </div>

      <!-- Delete Confirmation Modal -->
      @if (showDeleteModal) {
        <div class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div class="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div class="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
            </div>
            <h3 class="text-lg font-bold text-slate-900 text-center mb-2">ยืนยันการลบตำแหน่งงาน?</h3>
            <p class="text-xs text-slate-500 text-center mb-6">
              คุณแน่ใจหรือไม่ว่าต้องการลบตำแหน่งงาน <strong>"{{ job?.title }}"</strong> ข้อมูลนี้จะถูกลบออกจากฐานข้อมูลอย่างถาวร
            </p>
            <div class="flex gap-3">
              <button
                (click)="showDeleteModal = false"
                class="flex-1 py-2.5 px-4 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors">
                ยกเลิก
              </button>
              <button
                (click)="confirmDelete()"
                [disabled]="isDeleting"
                class="flex-1 py-2.5 px-4 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-sm transition-colors flex items-center justify-center gap-1.5">
                @if (isDeleting) {
                  <svg class="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                  </svg>
                }
                <span>ยืนยันการลบ (Delete)</span>
              </button>
            </div>
          </div>
        </div>
      }

      <!-- Apply Success / Application Modal -->
      @if (showApplyModal) {
        <div class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div class="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div class="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h3 class="text-lg font-bold text-slate-900 text-center mb-1">ส่งใบสมัครงาน</h3>
            <p class="text-xs text-slate-500 text-center mb-4">
              ตำแหน่ง: <strong>{{ job?.title }}</strong>
            </p>

            <div class="space-y-3 mb-6">
              <div>
                <label class="block text-xs font-medium text-slate-700 mb-1">ชื่อ-นามสกุล ผู้สมัคร</label>
                <input type="text" [(ngModel)]="applicantName" placeholder="สมชาย ใจดี" class="w-full text-xs p-2.5 border border-slate-200 rounded-lg">
              </div>
              <div>
                <label class="block text-xs font-medium text-slate-700 mb-1">อีเมลติดต่อ</label>
                <input type="email" [(ngModel)]="applicantEmail" placeholder="somchai@example.com" class="w-full text-xs p-2.5 border border-slate-200 rounded-lg">
              </div>
              <div>
                <label class="block text-xs font-medium text-slate-700 mb-1">ลิงก์เรซูเม่ / Portfolio URL</label>
                <input type="url" [(ngModel)]="applicantResumeUrl" placeholder="https://linkedin.com/in/somchai" class="w-full text-xs p-2.5 border border-slate-200 rounded-lg">
              </div>
            </div>

            <div class="flex gap-3">
              <button
                (click)="showApplyModal = false"
                class="flex-1 py-2.5 px-4 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl">
                ปิด
              </button>
              <button
                (click)="submitApplication()"
                class="flex-1 py-2.5 px-4 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm">
                ยืนยันการส่งใบสมัคร
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  `,
})
export class JobDetailComponent implements OnInit {
  job: Job | null = null;
  isLoading = true;
  hasError = false;
  errorMessage = '';

  showDeleteModal = false;
  isDeleting = false;

  showApplyModal = false;
  applicantName = '';
  applicantEmail = '';
  applicantResumeUrl = '';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly jobService: JobService,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadJobDetail(+id);
    } else {
      this.hasError = true;
      this.errorMessage = 'ไม่พบรหัสตำแหน่งงานที่ต้องการ';
      this.isLoading = false;
    }
  }

  loadJobDetail(id: number): void {
    this.isLoading = true;
    this.hasError = false;
    this.jobService.getJobById(id).subscribe({
      next: (data) => {
        this.job = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load job details', err);
        this.hasError = true;
        this.errorMessage = 'ไม่พบข้อมูลตำแหน่งงาน หรือเกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์';
        this.isLoading = false;
      },
    });
  }

  isJobClosed(): boolean {
    if (!this.job) return false;
    if (this.job.status === 'CLOSED') return true;
    if (this.job.applicationDeadline && new Date(this.job.applicationDeadline) < new Date()) {
      return true;
    }
    return false;
  }

  openDeleteModal(): void {
    this.showDeleteModal = true;
  }

  confirmDelete(): void {
    if (!this.job) return;
    this.isDeleting = true;

    this.jobService.deleteJob(this.job.id).subscribe({
      next: () => {
        this.isDeleting = false;
        this.showDeleteModal = false;
        alert('ลบตำแหน่งงานสำเร็จเรียบร้อยแล้ว');
        this.router.navigate(['/jobs']);
      },
      error: (err) => {
        console.error('Delete failed', err);
        this.isDeleting = false;
        alert('เกิดข้อผิดพลาดในการลบข้อมูล กรุณาลองใหม่อีกครั้ง');
      },
    });
  }

  openApplyModal(): void {
    if (this.isJobClosed()) return;
    this.showApplyModal = true;
  }

  submitApplication(): void {
    if (!this.applicantName || !this.applicantEmail) {
      alert('กรุณากรอกชื่อและอีเมล');
      return;
    }
    alert(`ส่งใบสมัครสำหรับคุณ ${this.applicantName} เรียบร้อยแล้ว! ฝ่ายบุคคลของบริษัทจะติดต่อกลับทางอีเมล ${this.applicantEmail}`);
    this.showApplyModal = false;
  }

  formatJobType(type: string): string {
    switch (type) {
      case 'INTERNSHIP':
        return 'ฝึกงาน (Internship)';
      case 'FULL_TIME':
        return 'งานประจำ (Full-Time)';
      case 'PART_TIME':
        return 'พาร์ทไทม์ (Part-Time)';
      default:
        return type;
    }
  }

  formatWorkplace(type: string): string {
    switch (type) {
      case 'REMOTE':
        return 'Remote 100%';
      case 'HYBRID':
        return 'Hybrid Work';
      case 'ON_SITE':
        return 'On-Site';
      default:
        return type;
    }
  }
}
