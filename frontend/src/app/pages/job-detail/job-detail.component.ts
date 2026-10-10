import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { JobService } from '../../services/job.service';

@Component({
  selector: 'app-job-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-gray-50/60 py-10 px-4 sm:px-6 lg:px-8">
      <div class="max-w-6xl mx-auto space-y-6">

        <!-- แถบด้านบน: ปุ่มย้อนกลับ และปุ่มจัดการประกาศ -->
        <div class="flex items-center justify-between">
          <a routerLink="/" class="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-orange-600 transition">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
            </svg>
            ย้อนกลับไปหน้ารวมตำแหน่งงาน
          </a>

          <div class="flex items-center gap-3">
            <button 
              [routerLink]="['/jobs', job?.id, 'edit']"
              class="px-4 py-2 border border-gray-200 bg-white hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 text-gray-700 text-xs font-semibold rounded-xl transition flex items-center gap-1.5 shadow-sm cursor-pointer">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
              </svg>
              แก้ไขประกาศ (Edit)
            </button>
            <button 
              (click)="deleteJob()"
              class="px-4 py-2 border border-red-200 bg-white hover:bg-red-50 text-red-600 text-xs font-semibold rounded-xl transition flex items-center gap-1.5 shadow-sm cursor-pointer">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
              </svg>
              ลบประกาศ (Delete)
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

          <!-- ฝั่งซ้าย: ข้อมูลประกาศงานหลัก -->
          <div class="lg:col-span-2 space-y-6">

            <!-- การ์ดส่วนหัวตำแหน่งงาน -->
            <div class="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm space-y-6">
              <div class="flex items-center justify-between">
                <span class="text-xs text-gray-500 font-medium">
                  ประกาศเมื่อ: {{ job?.createdAt | date:'dd/MM/yyyy' }}
                </span>
                <span 
                  [class.bg-emerald-50]="job?.status === 'OPEN'"
                  [class.text-emerald-700]="job?.status === 'OPEN'"
                  [class.border-emerald-200]="job?.status === 'OPEN'"
                  [class.bg-gray-100]="job?.status !== 'OPEN'"
                  [class.text-gray-600]="job?.status !== 'OPEN'"
                  class="px-3.5 py-1 text-xs font-bold rounded-full border flex items-center gap-1.5">
                  <span class="w-2 h-2 rounded-full" [class.bg-emerald-500]="job?.status === 'OPEN'" [class.bg-gray-400]="job?.status !== 'OPEN'"></span>
                  {{ job?.status === 'OPEN' ? 'กำลังเปิดรับสมัคร (Open)' : 'ปิดรับสมัครแล้ว (Closed)' }}
                </span>
              </div>

              <h1 class="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                {{ job?.title }}
              </h1>

              <!-- ป้าย Tag หมวดหมู่งาน (ปรับเป็นโทนสีส้มและเทาอ่อน) -->
              <div class="flex flex-wrap gap-2 pt-1">
                <span class="px-3 py-1.5 bg-orange-50 border border-orange-200/80 text-orange-700 text-xs font-bold rounded-xl">
                  {{ job?.type || 'งานประจำ (Full-Time)' }}
                </span>
                <span class="px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-semibold rounded-xl">
                  {{ job?.workplace || 'Hybrid Work' }}
                </span>
                <span class="px-3 py-1.5 bg-orange-100/60 text-orange-800 text-xs font-semibold rounded-xl">
                  {{ job?.category || 'Software Engineering' }}
                </span>
                <span class="px-3 py-1.5 bg-gray-100 text-gray-600 text-xs font-medium rounded-xl flex items-center gap-1">
                  📍 {{ job?.location || 'กรุงเทพมหานคร' }}
                </span>
              </div>

              <!-- แถบค่าตอบแทนและวันปิดรับสมัคร (ตัวเลขสีส้มเข้มโดดเด่น) -->
              <div class="bg-gray-50/70 border border-gray-100 rounded-2xl p-5 flex items-center justify-between">
                <div>
                  <div class="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">เบี้ยเลี้ยง / อัตราค่าตอบแทน</div>
                  <div class="text-xl sm:text-2xl font-black text-[#ea580c] mt-0.5">
                    <ng-container *ngIf="job?.stipendMin || job?.stipendMax; else noStipend">
                      ฿{{ (job?.stipendMin || 0) | number }} - ฿{{ (job?.stipendMax || 0) | number }} / เดือน
                    </ng-container>
                    <ng-template #noStipend>ตามโครงสร้างบริษัท / ตกลงร่วมกัน</ng-template>
                  </div>
                </div>
                <div class="text-right">
                  <div class="text-[11px] font-semibold text-gray-400">วันปิดรับสมัคร</div>
                  <div class="text-xs font-bold text-gray-800 mt-0.5">
                    {{ job?.closedAt ? (job?.closedAt | date:'dd MMM yyyy') : 'จนกว่าจะได้รับคน' }}
                  </div>
                </div>
              </div>
            </div>

            <!-- การ์ดเนื้อหารายละเอียดงานและคุณสมบัติ -->
            <div class="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm space-y-8">
              
              <!-- รายละเอียดงาน -->
              <div class="space-y-3">
                <div class="flex items-center gap-2.5">
                  <span class="w-1.5 h-5 bg-[#ea580c] rounded-full"></span>
                  <h2 class="text-base font-bold text-gray-900 tracking-tight">รายละเอียดงาน (Job Description)</h2>
                </div>
                <p class="text-sm text-gray-600 leading-relaxed whitespace-pre-line pl-4">
                  {{ job?.description }}
                </p>
              </div>

              <!-- คุณสมบัติผู้สมัคร -->
              <div class="space-y-3">
                <div class="flex items-center gap-2.5">
                  <span class="w-1.5 h-5 bg-[#ea580c] rounded-full"></span>
                  <h2 class="text-base font-bold text-gray-900 tracking-tight">คุณสมบัติผู้สมัคร (Requirements)</h2>
                </div>
                <p class="text-sm text-gray-600 leading-relaxed whitespace-pre-line pl-4">
                  {{ job?.requirements }}
                </p>
              </div>

              <!-- สวัสดิการ (ถ้ามี) -->
              <div *ngIf="job?.benefits" class="space-y-3">
                <div class="flex items-center gap-2.5">
                  <span class="w-1.5 h-5 bg-[#ea580c] rounded-full"></span>
                  <h2 class="text-base font-bold text-gray-900 tracking-tight">สวัสดิการและสิ่งที่จะได้รับ (Benefits & Perks)</h2>
                </div>
                <p class="text-sm text-gray-600 leading-relaxed whitespace-pre-line pl-4">
                  {{ job?.benefits }}
                </p>
              </div>

            </div>

          </div>

          <!-- ฝั่งขวา: การ์ดกล่องสมัครงานและข้อมูลบริษัท -->
          <div class="space-y-6">

            <!-- การ์ดสมัครตำแหน่งนี้ (ปุ่มสีส้ม) -->
            <div class="bg-white rounded-3xl border border-gray-100 p-6 sm:p-7 shadow-sm space-y-5">
              <h3 class="text-base font-bold text-gray-900">สมัครตำแหน่งนี้</h3>

              <!-- ปุ่มส่งใบสมัคร (แสดงเฉพาะเมื่อมีลิงก์ URL) -->
              <a 
                *ngIf="job?.applicationUrl" 
                [href]="job?.applicationUrl" 
                target="_blank" 
                rel="noopener noreferrer"
                class="w-full py-3.5 px-4 bg-[#ea580c] hover:bg-[#d94e08] active:bg-[#c2410c] text-white font-bold rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-orange-500/20 transition cursor-pointer">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                ส่งใบสมัคร (Apply Now)
              </a>

              <!-- ปุ่มส่งอีเมล -->
              <a 
                [href]="'mailto:' + job?.contactEmail + '?subject=สมัครงานตำแหน่ง ' + job?.title"
                class="w-full py-3.5 px-4 bg-gray-50 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 border border-gray-200 text-gray-700 font-semibold rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 transition cursor-pointer">
                <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
                ส่งอีเมลหาฝ่ายบุคคลโดยตรง
              </a>

              <hr class="border-gray-100"/>

              <div class="space-y-2 text-xs">
                <div class="flex justify-between text-gray-500">
                  <span>อีเมลติดต่อ:</span>
                  <span class="font-bold text-gray-800">{{ job?.contactEmail || '-' }}</span>
                </div>
                <div class="flex justify-between text-gray-500">
                  <span>รหัสประกาศ:</span>
                  <span class="font-bold text-gray-500">#JOB-{{ job?.id }}</span>
                </div>
              </div>
            </div>

            <!-- การ์ดข้อมูลบริษัท -->
            <div class="bg-white rounded-3xl border border-gray-100 p-6 sm:p-7 shadow-sm space-y-4">
              <div class="flex items-center gap-3.5">
                <div class="w-12 h-12 rounded-2xl bg-orange-100/70 border border-orange-200/60 flex items-center justify-center text-xl text-orange-600 font-black shadow-inner">
                  🏢
                </div>
                <div>
                  <h4 class="text-sm font-bold text-gray-900">{{ job?.company?.name || 'SCG' }}</h4>
                  <p class="text-xs text-orange-600 font-medium">{{ job?.category || 'Industrial & Technology' }}</p>
                </div>
              </div>

              <p class="text-xs text-gray-500 leading-relaxed">
                {{ job?.company?.description || 'พัฒนาระบบซอฟต์แวร์ที่มีคุณภาพ ร่วมกับทีมงานมากประสบการณ์' }}
              </p>

              <div class="space-y-2 pt-2 border-t border-gray-100 text-xs text-gray-500">
                <div class="flex items-center gap-2">
                  <span>📍</span>
                  <span>{{ job?.location || 'กรุงเทพมหานคร' }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <span>✉️</span>
                  <span>{{ job?.contactEmail || 'hr@scg.com' }}</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  `
})
export class JobDetailComponent implements OnInit {
  job: any = null;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private jobService: JobService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadJob(id);
    }
  }

  loadJob(id: string): void {
    const serviceAny = this.jobService as any;
    const fetch$ = typeof serviceAny.getJobById === 'function'
      ? serviceAny.getJobById(id)
      : serviceAny.getJob(id);

    if (fetch$) {
      fetch$.subscribe({
        next: (data: any) => {
          this.job = data;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          alert('ไม่พบข้อมูลตำแหน่งงาน');
          this.router.navigate(['/']);
        }
      });
    }
  }

  deleteJob(): void {
    if (!this.job?.id) return;
    if (confirm('คุณแน่ใจหรือไม่ว่าต้องการลบประกาศงานนี้?')) {
      const serviceAny = this.jobService as any;
      if (typeof serviceAny.deleteJob === 'function') {
        serviceAny.deleteJob(String(this.job.id)).subscribe({
          next: () => {
            alert('ลบประกาศงานเรียบร้อยแล้ว');
            this.router.navigate(['/']);
          },
          error: () => alert('เกิดข้อผิดพลาดในการลบประกาศงาน')
        });
      }
    }
  }
}