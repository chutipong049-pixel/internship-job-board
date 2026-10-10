import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { JobService } from '../../services/job.service';

@Component({
  selector: 'app-job-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="min-h-screen bg-[#FFFBF7] font-sans text-gray-800">
      
      <!-- Navbar ด้านบนสุด พร้อมย้ายปุ่มลงประกาศงานมาไว้ตรงกลาง -->
      <nav class="bg-white border-b border-orange-100 sticky top-0 z-50 shadow-xs">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-16 items-center">
            <div class="flex items-center space-x-8">
              <!-- โลโก้เว็บไซต์จาก assets/logo.png -->
              <div class="flex items-center gap-2 cursor-pointer" routerLink="/jobs">
                <img src="assets/logo.png" alt="JobBoard Logo" class="h-10 object-contain" onError="this.src='https://images.unsplash.com/photo-1549923746-c502d4883ea?w=128&auto=format&fit=crop&q=80'">
              </div>
              <div class="hidden md:flex space-x-6 text-sm font-medium text-gray-600 items-center">
                <a routerLink="/jobs" class="text-orange-600 font-semibold border-b-2 border-orange-600 pb-1">หางานทั้งหมด</a>
                <!-- ปุ่มลงประกาศงานบน Navbar ตามตำแหน่งที่ต้องการ -->
                <a routerLink="/jobs/new" class="bg-orange-500 hover:bg-orange-600 text-white px-3.5 py-1.5 rounded-xl text-xs font-semibold shadow-xs transition flex items-center gap-1.5 cursor-pointer">
                  <span>➕</span> ลงประกาศงาน
                </a>
              </div>
            </div>

            <!-- เมนูด้านขวา & ข้อมูลผู้ใช้ / ปุ่มสมัครสมาชิก -->
            <div class="flex items-center space-x-4">
              <ng-container *ngIf="currentUser; else loginTemplate">
                <div class="flex items-center gap-3 pl-2 border-l border-gray-200">
                  <span class="text-xs text-gray-700 hidden sm:inline">ยินดีต้อนรับ, <strong class="text-gray-900">{{ currentUser.name || currentUser.email || currentUser }}</strong></span>
                  <button (click)="logout()" class="border border-red-400 text-red-500 hover:bg-red-50 px-3 py-1 rounded-lg text-xs transition font-medium cursor-pointer">ออกจากระบบ</button>
                </div>
              </ng-container>
              <ng-template #loginTemplate>
                <div class="flex items-center gap-2">
                  <a routerLink="/login" class="text-orange-600 hover:bg-orange-50 px-3 py-2 rounded-xl text-xs font-semibold transition">เข้าสู่ระบบ</a>
                  <a routerLink="/register" class="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-xs transition cursor-pointer">สมัครสมาชิก</a>
                </div>
              </ng-template>
            </div>
          </div>
        </div>
      </nav>

      <!-- ส่วนหัวข้อหลัก & แบนเนอร์ -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
        <div class="relative rounded-3xl overflow-hidden border border-orange-100/60 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center p-8 bg-cover bg-center"
             style="background-image: linear-gradient(to right, rgba(255, 255, 255, 0.92), rgba(255, 245, 235, 0.85)), url('assets/banner-bg.png');">
          <div class="z-10 max-w-lg">
            <h1 class="text-3xl font-extrabold text-gray-900 mb-2 flex items-center gap-2">
              <span>📂</span> ตำแหน่งงานทั้งหมด
            </h1>
            <p class="text-sm text-gray-600">ค้นหางานที่ใช่สำหรับคุณ พร้อมก้าวสู่อนาคตที่ดีกว่าและเติบโตในสายงานที่คุณรัก</p>
          </div>
          <div class="mt-4 md:mt-0 bg-white/90 backdrop-blur-xs px-5 py-3 rounded-2xl border border-orange-100 shadow-xs flex items-center gap-3 z-10">
            <span class="text-2xl">💡</span>
            <div>
              <p class="text-xs font-bold text-orange-600">งานดีๆ รอคุณอยู่ ✨</p>
              <p class="text-[11px] text-gray-400">Good Job & Better You 💛</p>
            </div>
          </div>
        </div>
      </div>

      <!-- เนื้อหาหลัก (Grid 2 คอลัมน์) -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          <!-- คอลัมน์ซ้าย: ตัวกรองข้อมูลตามเงื่อนไขเดิม -->
          <div class="lg:col-span-1 bg-white p-6 rounded-3xl shadow-xs border border-orange-100/80 h-fit space-y-5">
            <div class="flex items-center justify-between pb-3 border-b border-gray-100">
              <h2 class="font-bold text-gray-800 text-sm flex items-center gap-2">
                <span class="text-orange-500">🔍</span> ค้นหางานตามเงื่อนไข
              </h2>
            </div>
            
            <div>
              <label class="block text-xs font-semibold text-gray-600 mb-1.5">คำค้นหาตำแหน่งงาน, บริษัท...</label>
              <input type="text" [(ngModel)]="searchKeyword" (input)="filterJobs()" placeholder="ชื่อตำแหน่ง, บริษัท..." 
                     class="w-full text-xs border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-gray-50/50">
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-600 mb-1.5">💼 ประเภทงาน</label>
              <select [(ngModel)]="selectedJobType" (change)="filterJobs()" class="w-full text-xs border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-gray-50/50 text-gray-700">
                <option value="ALL">ทั้งหมด</option>
                <option value="FULL_TIME">Full-time</option>
                <option value="INTERNSHIP">Internship</option>
                <option value="PART_TIME">Part-time</option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-600 mb-1.5">💻 รูปแบบการทำงาน</label>
              <select [(ngModel)]="selectedWorkplacetype" (change)="filterJobs()" class="w-full text-xs border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-gray-50/50 text-gray-700">
                <option value="ALL">ทั้งหมด</option>
                <option value="HYBRID">Hybrid Work</option>
                <option value="ON_SITE">On-site</option>
                <option value="REMOTE">Remote</option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-600 mb-1.5">📍 ภาค / จังหวัด</label>
              <select [(ngModel)]="selectedRegion" (change)="filterJobs()" class="w-full text-xs border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-gray-50/50 text-gray-700">
                <option value="ALL">ทุกภูมิภาค</option>
                <option value="CENTRAL">ภาคกลาง</option>
                <option value="NORTH">ภาคเหนือ</option>
                <option value="SOUTH">ภาคใต้</option>
              </select>
            </div>

            <div class="text-center pt-2">
              <button (click)="resetFilters()" class="text-xs text-gray-400 hover:text-gray-600 underline transition cursor-pointer">
                ↺ ล้างตัวกรองทั้งหมด
              </button>
            </div>
          </div>

          <!-- คอลัมน์ขวา: รายการงาน -->
          <div class="lg:col-span-3 space-y-4">
            
            <div class="bg-white p-4 rounded-2xl shadow-xs border border-orange-100/80 flex items-center justify-between">
              <span class="text-xs font-semibold text-gray-600">พบตำแหน่งงานที่เปิดรับสมัครทั้งหมด {{ filteredJobs.length }} ตำแหน่ง</span>
            </div>

            <!-- วนลูปแสดงรายการงาน -->
            <div *ngFor="let job of filteredJobs" class="bg-white p-6 rounded-3xl shadow-xs border border-orange-100/70 hover:shadow-md transition flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              
              <div class="flex items-start gap-4 flex-1">
                <!-- โลโก้บริษัทจาก assets ที่คุณเตรียมไว้ -->
                <img [src]="job.companyLogo" 
                     alt="Company Logo" 
                     class="w-14 h-14 rounded-2xl object-contain border border-gray-100 shadow-xs flex-shrink-0 bg-gray-50 p-1"
                     onError="this.src='https://images.unsplash.com/photo-1549923746-c502d4883ea?w=128&auto=format&fit=crop&q=80'">
                
                <div class="space-y-1.5">
                  <div class="flex flex-wrap items-center gap-2">
                    <h3 class="text-base font-bold text-orange-600 hover:underline cursor-pointer" (click)="viewDetail(job.id)">{{ job.title }}</h3>
                    <span class="px-2.5 py-0.5 text-[11px] font-semibold bg-orange-50 text-orange-600 rounded-full border border-orange-200">
                      {{ job.jobType }}
                    </span>
                    <span class="px-2 py-0.5 text-[10px] font-bold bg-amber-50 text-amber-600 rounded-md border border-amber-200">
                      🔥 แนะนำ
                    </span>
                  </div>

                  <div class="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                    <span class="font-bold text-gray-800">{{ job.company?.name || 'บริษัทชั้นนำ' }}</span>
                    <span>•</span>
                    <span class="flex items-center gap-1">📍 {{ job.location || 'กรุงเทพมหานคร' }}</span>
                    <span>•</span>
                    <span class="flex items-center gap-1">💻 {{ job.workplaceType }}</span>
                  </div>

                  <p class="text-xs text-gray-500 line-clamp-1 pt-0.5">{{ job.description }}</p>
                  
                  <div class="text-xs text-emerald-600 font-bold pt-1 flex items-center gap-1.5">
                    <span>💰</span> ค่าตอบแทน: ฿{{ job.stipendMin | number }} - ฿{{ job.stipendMax | number }}
                  </div>
                </div>
              </div>

              <!-- ปุ่มรายละเอียดงาน -->
              <div class="w-full md:w-auto flex md:flex-col items-center md:items-end justify-between h-full pt-3 md:pt-0 border-t md:border-t-0 border-gray-100 gap-3">
                <span class="text-[11px] text-gray-400">โพสต์เมื่อ: {{ job.createdAt | date:'dd/MM/yyyy' }}</span>
                
                <div class="flex items-center gap-2">
                  <button (click)="viewDetail(job.id)" class="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl font-semibold text-xs shadow-sm shadow-orange-500/20 transition flex items-center gap-1.5 cursor-pointer">
                    <span>🔥</span> รายละเอียดงาน
                  </button>
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>
    </div>
  `,
  styleUrls: []
})
export class JobListComponent implements OnInit {
  currentUser: any = null;
  jobs: any[] = [];
  filteredJobs: any[] = [];

  // Filter States
  searchKeyword: string = '';
  selectedJobType: string = 'ALL';
  selectedWorkplacetype: string = 'ALL';
  selectedRegion: string = 'ALL';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private jobService: JobService
  ) {}

  ngOnInit(): void {
    const userStr = localStorage.getItem('currentUser') || localStorage.getItem('user');
    if (userStr) {
      try {
        this.currentUser = JSON.parse(userStr);
      } catch (e) {
        this.currentUser = userStr;
      }
    }

    this.jobService.getJobs().subscribe({
      next: (data: any) => {
        // แมตช์โลโก้บริษัทตามชื่อ
        this.jobs = data.map((job: any) => {
          const compName = (job.company?.name || '').toUpperCase();
          let logoFile = 'logo.png'; // ค่าเริ่มต้น

          if (compName.includes('SCG')) {
            logoFile = 'scg.png';
          } else if (compName.includes('INTEL')) {
            logoFile = 'intel.png';
          } else if (compName.includes('MICROSOFT')) {
            logoFile = 'microsoft.png';
          } else if (compName.includes('SHOPEE')) {
            logoFile = 'shopee.png';
          } else if (compName.includes('GOOGLE')) {
            logoFile = 'google.png';
          }

          return {
            ...job,
            companyLogo: `assets/${logoFile}`
          };
        });
        this.filteredJobs = this.jobs;
      },
      error: (err) => {
        console.error('Error fetching jobs:', err);
      }
    });
  }

  filterJobs(): void {
    this.filteredJobs = this.jobs.filter(job => {
      const matchKeyword = !this.searchKeyword || 
        job.title.toLowerCase().includes(this.searchKeyword.toLowerCase()) ||
        (job.company?.name && job.company.name.toLowerCase().includes(this.searchKeyword.toLowerCase()));
      
      const matchJobType = this.selectedJobType === 'ALL' || job.jobType === this.selectedJobType;
      const matchWorkplace = this.selectedWorkplacetype === 'ALL' || job.workplaceType === this.selectedWorkplacetype;
      const matchRegion = this.selectedRegion === 'ALL' || job.region === this.selectedRegion;

      return matchKeyword && matchJobType && matchWorkplace && matchRegion;
    });
  }

  resetFilters(): void {
    this.searchKeyword = '';
    this.selectedJobType = 'ALL';
    this.selectedWorkplacetype = 'ALL';
    this.selectedRegion = 'ALL';
    this.filteredJobs = this.jobs;
  }

  viewDetail(id: number): void {
    this.router.navigate(['/jobs', id]);
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('user');
    this.currentUser = null;
    this.router.navigate(['/login']);
  }
}