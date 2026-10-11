import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { JobService } from '../../services/job.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-job-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="min-h-screen bg-[#faf7f2] font-['Kanit'] text-gray-800 antialiased">
      
      <!-- 1. Navbar ด้านบนสุด -->
      <header class="bg-white/95 backdrop-blur-sm border-b border-orange-100/70 sticky top-0 z-40">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          
          <div class="flex items-center gap-6 sm:gap-10">
            <!-- โลโก้ JobBoard เดี่ยว -->
            <a routerLink="/" class="flex items-center cursor-pointer select-none">
              <img 
                src="assets/logo.png" 
                alt="JobBoard" 
                class="h-8 w-auto object-contain"
                onerror="this.src='/assets/logo.png';"
              />
            </a>

            <!-- เมนูนำทาง -->
            <nav class="hidden md:flex items-center gap-4">
              <a routerLink="/jobs" class="relative py-2 text-sm font-bold text-[#ea580c] transition">
                หางานทั้งหมด
                <span class="absolute bottom-0 left-0 right-0 h-0.5 bg-[#ea580c] rounded-full"></span>
              </a>
              <a routerLink="/jobs/new" class="px-5 py-2 rounded-full text-xs font-bold bg-[#ea580c] hover:bg-[#d94e08] text-white shadow-sm shadow-orange-500/25 flex items-center gap-1.5 transition">
                <span>+</span> ลงประกาศงาน
              </a>
            </nav>
          </div>

          <!-- ฝั่งขวา: Username / ล็อกอิน -->
          <div>
            <div *ngIf="!currentUser" class="flex items-center gap-4">
              <a routerLink="/login" class="text-xs font-bold text-gray-700 hover:text-[#ea580c] transition cursor-pointer">
                เข้าสู่ระบบ
              </a>
              <a routerLink="/register" class="px-6 py-2.5 rounded-full text-xs font-bold bg-[#ea580c] hover:bg-[#d94e08] text-white shadow-sm shadow-orange-500/20 transition cursor-pointer">
                สมัครสมาชิก
              </a>
            </div>

            <div *ngIf="currentUser" class="flex items-center gap-3">
              <div class="flex items-center gap-2.5 px-3.5 py-1.5 bg-orange-50 border border-orange-200/80 rounded-full shadow-xs">
                <div class="w-7 h-7 rounded-full bg-[#ea580c] text-white flex items-center justify-center text-xs font-extrabold uppercase shadow-sm">
                  {{ (currentUser.name || currentUser.email || 'U').charAt(0) }}
                </div>
                <span class="text-xs font-extrabold text-gray-800">
                  {{ currentUser.name || currentUser.email }}
                </span>
              </div>

              <button 
                (click)="logout()" 
                class="px-3 py-1.5 text-xs font-bold text-gray-400 hover:text-red-600 transition cursor-pointer">
                ออกจากระบบ
              </button>
            </div>
          </div>

        </div>
      </header>

      <!-- 2. ส่วนเนื้อหาหลัก -->
      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        <!-- แบนเนอร์หัวเว็บ -->
        <div class="relative w-full rounded-[2rem] border border-orange-100/80 overflow-hidden shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between p-8 sm:p-10 min-h-[175px] bg-[#fbf9f5]">
          <img 
            src="assets/banner-bg.png" 
            alt="Banner Background"
            class="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
            onerror="this.src='/assets/banner-bg.png';"
          />

          <div class="relative z-10 max-w-xl space-y-2">
            <h1 class="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
              <svg class="w-9 h-9 flex-shrink-0 drop-shadow-sm" viewBox="0 0 24 24" fill="none">
                <path d="M3 7.5C3 6.39543 3.89543 5.5 5 5.5H9.17157C9.70201 5.5 10.2107 5.71071 10.5858 6.08579L12.4142 7.91421C12.7893 8.28929 13.298 8.5 13.8284 8.5H19C20.1046 8.5 21 9.39543 21 10.5V17.5C21 18.6046 20.1046 19.5 19 19.5H5C3.89543 19.5 3 18.6046 3 17.5V7.5Z" 
                      fill="#F6C543" stroke="#1E1E1E" stroke-width="2.2" stroke-linejoin="round"/>
                <path d="M3 10.5H21" stroke="#1E1E1E" stroke-width="2.2"/>
              </svg>
              <span>ตำแหน่งงานทั้งหมด</span>
            </h1>
            <p class="text-xs sm:text-sm text-gray-600 font-medium">
              ค้นหางานที่ใช่สำหรับคุณ พร้อมก้าวสู่อนาคตที่ดีกว่าและเติบโตในสายงานที่คุณรัก
            </p>
          </div>

          <div class="relative z-10 mt-4 md:mt-0 bg-white/95 backdrop-blur-md border border-orange-100/90 rounded-2xl px-5 py-3.5 shadow-sm flex items-center gap-3.5">
            <svg class="w-7 h-7 flex-shrink-0" viewBox="0 0 24 24" fill="none">
              <path d="M9 21H15M10 18H14M12 2C8.13401 2 5 5.13401 5 9C5 11.3867 6.19687 13.4939 8.02052 14.7397C8.63665 15.1614 9 15.8569 9 16.6015V17C9 17.5523 9.44772 18 10 18H14C14.5523 18 15 17.5523 15 17V16.6015C15 15.8569 15.3633 15.1614 15.9795 14.7397C17.8031 13.4939 19 11.3867 19 9C19 5.13401 15.866 2 12 2Z" 
                    fill="#FEE685" stroke="#1E1E1E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <div class="text-xs">
              <div class="font-bold text-[#ea580c] flex items-center gap-1">
                <span>งานดีๆ รอคุณอยู่</span>
                <svg class="w-3.5 h-3.5 text-amber-500 inline-block" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L14.2 9.8L22 12L14.2 14.2L12 22L9.8 14.2L2 12L9.8 9.8L12 2Z"/>
                </svg>
              </div>
              <div class="text-gray-400 font-medium text-[11px] flex items-center gap-1 mt-0.5">
                <span>Good Job & Better You</span>
                <svg class="w-3 h-3 text-amber-400 inline-block" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
              </div>
            </div>
          </div>

        </div>

        <!-- 3. Layout ตัวกรอง และ รายการงาน -->
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">

          <!-- กล่องตัวกรองด้านซ้าย -->
          <div class="lg:col-span-1 bg-white rounded-3xl border border-orange-100/70 p-6 shadow-sm space-y-5">
            <h2 class="text-sm font-black text-gray-900 flex items-center gap-2">
              <svg class="w-4 h-4 text-[#ea580c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              ค้นหางานตามเงื่อนไข
            </h2>

            <div class="space-y-4 text-xs">
              <div>
                <label class="block font-bold text-gray-700 mb-1.5">ค้นหาตำแหน่งงาน, บริษัท..</label>
                <input 
                  type="text" 
                  [(ngModel)]="searchQuery" 
                  (input)="filterJobs()"
                  placeholder="ชื่อตำแหน่ง, บริษัท.."
                  class="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#ea580c] focus:ring-1 focus:ring-[#ea580c] transition placeholder:text-gray-400">
              </div>

              <div>
                <label class="block font-bold text-gray-700 mb-1.5 flex items-center gap-1.5">
                  <svg class="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                  </svg>
                  ประเภทงาน
                </label>
                <select 
                  [(ngModel)]="selectedJobType" 
                  (change)="filterJobs()"
                  class="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-xs focus:outline-none focus:border-[#ea580c] transition">
                  <option value="">ทั้งหมด</option>
                  <option value="INTERNSHIP">ฝึกงาน (Internship)</option>
                  <option value="FULL_TIME">งานประจำ (Full-Time)</option>
                  <option value="PART_TIME">งานพาร์ทไทม์ (Part-Time)</option>
                </select>
              </div>

              <div>
                <label class="block font-bold text-gray-700 mb-1.5 flex items-center gap-1.5">
                  <svg class="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                  </svg>
                  รูปแบบการทำงาน
                </label>
                <select 
                  [(ngModel)]="selectedWorkplace" 
                  (change)="filterJobs()"
                  class="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-xs focus:outline-none focus:border-[#ea580c] transition">
                  <option value="">ทั้งหมด</option>
                  <option value="HYBRID">Hybrid</option>
                  <option value="ON_SITE">On-Site</option>
                  <option value="REMOTE">Remote</option>
                </select>
              </div>

              <!-- ภาค / จังหวัด ที่เพิ่มภาคอื่นๆ เข้ามา -->
              <div>
                <label class="block font-bold text-gray-700 mb-1.5 flex items-center gap-1.5">
                  <svg class="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                  ภาค / จังหวัด
                </label>
                <select 
                  [(ngModel)]="selectedLocation" 
                  (change)="filterJobs()"
                  class="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-xs focus:outline-none focus:border-[#ea580c] transition">
                  <option value="">ทุกภูมิภาค</option>
                  
                  <optgroup label="ภาคกลาง & ปริมณฑล">
                    <option value="กรุงเทพ">กรุงเทพมหานคร</option>
                    <option value="นนทบุรี">นนทบุรี</option>
                    <option value="ปทุมธานี">ปทุมธานี</option>
                    <option value="สมุทรปราการ">สมุทรปราการ</option>
                  </optgroup>

                  <optgroup label="ภาคเหนือ">
                    <option value="เชียงใหม่">เชียงใหม่</option>
                    <option value="เชียงราย">เชียงราย</option>
                    <option value="พิษณุโลก">พิษณุโลก</option>
                  </optgroup>

                  <optgroup label="ภาคตะวันออกเฉียงเหนือ">
                    <option value="ขอนแก่น">ขอนแก่น</option>
                    <option value="นครราชสีมา">นครราชสีมา (โคราช)</option>
                    <option value="อุบลราชธานี">อุบลราชธานี</option>
                  </optgroup>

                  <optgroup label="ภาคตะวันออก">
                    <option value="ชลบุรี">ชลบุรี / พัทยา</option>
                    <option value="ระยอง">ระยอง</option>
                  </optgroup>

                  <optgroup label="ภาคใต้">
                    <option value="ภูเก็ต">ภูเก็ต</option>
                    <option value="สงขลา">สงขลา / หาดใหญ่</option>
                    <option value="นครศรีธรรมราช">นครศรีธรรมราช</option>
                    <option value="สุราษฎร์ธานี">สุราษฎร์ธานี</option>
                  </optgroup>
                </select>
              </div>

              <button 
                (click)="resetFilters()"
                class="w-full pt-2 text-xs text-gray-400 hover:text-[#ea580c] transition flex items-center justify-center gap-1 cursor-pointer">
                ล้างตัวกรองทั้งหมด
              </button>
            </div>
          </div>

          <!-- แถบแสดงรายการงานขวา -->
          <div class="lg:col-span-3 space-y-4">
            <div class="bg-white rounded-2xl border border-orange-100/60 px-6 py-3 shadow-sm flex items-center justify-between text-xs font-semibold text-gray-600">
              <span>
                พบตำแหน่งงานที่เปิดรับสมัครทั้งหมด <span class="font-extrabold text-[#ea580c]">{{ filteredJobs.length }}</span> ตำแหน่ง
              </span>
              <button (click)="loadJobs()" class="text-gray-400 hover:text-[#ea580c] transition text-[11px] flex items-center gap-1 cursor-pointer">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                </svg>
                รีเฟรช
              </button>
            </div>

            <!-- การ์ดงาน -->
            <div *ngIf="!loading && filteredJobs.length > 0" class="space-y-4">
              <div 
                *ngFor="let job of filteredJobs"
                class="bg-white rounded-3xl border border-orange-100/70 p-6 sm:p-7 shadow-sm hover:border-orange-200 transition duration-150 flex flex-col md:flex-row md:items-center justify-between gap-6">
                
                <div class="flex items-start gap-4">
                  <div class="w-16 h-16 rounded-2xl bg-white border border-gray-100 p-2.5 flex items-center justify-center flex-shrink-0 shadow-xs">
                    <img 
                      [src]="getCompanyLogo(job)" 
                      [alt]="job.company?.name || 'Company Logo'"
                      class="w-full h-full object-contain"
                      onerror="this.src='assets/logo.png';"
                    />
                  </div>

                  <div class="space-y-2">
                    <div class="flex flex-wrap items-center gap-2">
                      <a [routerLink]="['/jobs', job.id]" class="text-base sm:text-lg font-black text-[#ea580c] hover:text-[#c2410c] transition cursor-pointer">
                        {{ job.title }}
                      </a>
                      
                      <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-orange-50 border border-orange-200/60 text-[#ea580c]">
                        {{ job.jobType || job.type || 'FULL_TIME' }}
                      </span>

                      <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 border border-amber-200/60 text-amber-700">
                        แนะนำ
                      </span>
                    </div>

                    <div class="flex flex-wrap items-center gap-3 text-xs text-gray-500 font-semibold">
                      <span class="font-bold text-gray-800">{{ job.company?.name || job.companyName || 'SCG' }}</span>
                      <span class="flex items-center gap-1">
                        <svg class="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                        </svg>
                        {{ job.location || 'กรุงเทพมหานคร' }}
                      </span>
                      <span class="flex items-center gap-1">
                        <svg class="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                        </svg>
                        {{ job.workplaceType || job.workplace || 'ON_SITE' }}
                      </span>
                    </div>

                    <p class="text-xs text-gray-500 line-clamp-1 max-w-xl">
                      {{ job.description }}
                    </p>

                    <div class="text-xs font-bold text-emerald-700 flex items-center gap-1 pt-1">
                      <span>ค่าตอบแทน: </span>
                      <span class="font-extrabold">
                        <ng-container *ngIf="job.stipendMin || job.stipendMax; else noStipend">
                          ฿{{ (job.stipendMin || 0) | number }} - ฿{{ (job.stipendMax || 0) | number }}
                        </ng-container>
                        <ng-template #noStipend>ตามโครงสร้างบริษัท</ng-template>
                      </span>
                    </div>
                  </div>
                </div>

                <div class="flex md:flex-col items-center md:items-end justify-between md:justify-center gap-3 flex-shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-gray-100">
                  <div class="text-[11px] text-gray-400 font-medium">
                    โพสต์เมื่อ: {{ job.createdAt ? (job.createdAt | date:'dd/MM/yyyy') : '10/10/2026' }}
                  </div>
                  <a 
                    [routerLink]="['/jobs', job.id]"
                    class="px-6 py-2.5 rounded-full bg-[#ea580c] hover:bg-[#d94e08] text-white text-xs font-bold shadow-sm shadow-orange-500/25 transition cursor-pointer">
                    รายละเอียดงาน
                  </a>
                </div>

              </div>
            </div>

            <!-- กล่องแสดงผลเมื่อไม่พบข้อมูล -->
            <div *ngIf="!loading && filteredJobs.length === 0" class="bg-white rounded-3xl border border-dashed border-gray-200 p-12 text-center shadow-sm space-y-3">
              <h3 class="text-sm font-bold text-gray-700">ไม่พบตำแหน่งงานที่ตรงตามเงื่อนไข</h3>
              <p class="text-xs text-gray-400">ลองล้างตัวกรองเพื่อดูงานทั้งหมด</p>
            </div>

          </div>

        </div>

      </main>

    </div>
  `
})
export class JobListComponent implements OnInit, OnDestroy {
  jobs: any[] = [];
  filteredJobs: any[] = [];
  loading = true;
  currentUser: any = null;
  private authSub?: Subscription;

  searchQuery = '';
  selectedJobType = '';
  selectedWorkplace = '';
  selectedLocation = '';

  constructor(
    private jobService: JobService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authSub = this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user;
    });
    this.loadJobs();
  }

  ngOnDestroy(): void {
    this.authSub?.unsubscribe();
  }

  logout(): void {
    this.authService.logout();
  }

  loadJobs(): void {
    this.loading = true;
    this.jobService.getJobs().subscribe({
      next: (data) => {
        this.jobs = data || [];
        this.filterJobs();
        this.loading = false;
      },
      error: () => {
        this.jobs = [];
        this.filteredJobs = [];
        this.loading = false;
      }
    });
  }

  getCompanyLogo(job: any): string {
    const raw = (
      (job?.company?.name || '') + ' ' + 
      (job?.companyName || '') + ' ' + 
      (job?.title || '')
    ).toLowerCase();

    if (raw.includes('intel')) return 'assets/intel.png';
    if (raw.includes('microsoft')) return 'assets/microsoft.png';
    if (raw.includes('google')) return 'assets/google.png';
    if (raw.includes('scg')) return 'assets/scg.png';
    if (raw.includes('shopee')) return 'assets/shopee.png';

    return 'assets/logo.png';
  }

  filterJobs(): void {
    this.filteredJobs = this.jobs.filter(job => {
      const matchSearch = !this.searchQuery || 
        job.title?.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        job.company?.name?.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        job.location?.toLowerCase().includes(this.searchQuery.toLowerCase());

      const matchJobType = !this.selectedJobType || (job.jobType || job.type) === this.selectedJobType;
      const matchWorkplace = !this.selectedWorkplace || (job.workplaceType || job.workplace) === this.selectedWorkplace;
      const matchLocation = !this.selectedLocation || (job.location || '').includes(this.selectedLocation);

      return matchSearch && matchJobType && matchWorkplace && matchLocation;
    });
  }

  resetFilters(): void {
    this.searchQuery = '';
    this.selectedJobType = '';
    this.selectedWorkplace = '';
    this.selectedLocation = '';
    this.filteredJobs = [...this.jobs];
  }
}