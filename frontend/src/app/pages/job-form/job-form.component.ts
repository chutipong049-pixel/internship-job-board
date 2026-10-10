import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { JobService } from '../../services/job.service';
import { Company } from '../../models/company.model';

@Component({
  selector: 'app-job-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-slate-50/60 py-10">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Top breadcrumb & back button -->
        <div class="mb-6 flex items-center justify-between">
          <a
            [routerLink]="isEditMode && jobId ? ['/jobs', jobId] : ['/jobs']"
            class="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            <span>{{ isEditMode ? 'ยกเลิกและกลับไปหน้ารายละเอียด' : 'ยกเลิกและกลับไปหน้ารวมงาน' }}</span>
          </a>
          <span class="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
            {{ isEditMode ? 'โหมดแก้ไขข้อมูล (Edit Mode)' : 'โหมดลงประกาศใหม่ (Create Mode)' }}
          </span>
        </div>

        <!-- Form Card Container -->
        <div class="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200/80 overflow-hidden">
          <!-- Card Header Banner -->
          <div class="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white p-6 sm:p-8">
            <h1 class="text-2xl font-bold mb-1">
              {{ isEditMode ? 'แก้ไขข้อมูลตำแหน่งงาน' : 'ลงประกาศรับสมัครงาน / ที่ฝึกงาน' }}
            </h1>
            <p class="text-xs sm:text-sm text-indigo-200">
              {{ isEditMode ? 'ปรับปรุงข้อมูลตำแหน่งงาน เบี้ยเลี้ยง และสถานะการเปิดรับสมัคร' : 'กรอกข้อมูลรายละเอียดตำแหน่งงานเพื่อให้นักศึกษาและผู้สนใจสามารถค้นหาและสมัครได้' }}
            </p>
          </div>

          <!-- Form Element -->
          <form [formGroup]="jobForm" (ngSubmit)="onSubmit()" class="p-6 sm:p-8 space-y-6">
            <!-- Business Rule Alert Banner -->
            <div class="p-4 rounded-xl bg-indigo-50/80 border border-indigo-200/70 text-xs text-indigo-900">
              <strong>💡 กฎทางธุรกิจของระบบ (Business Rule Reminder):</strong>
              <ul class="list-disc list-inside mt-1 space-y-0.5 text-indigo-800">
                <li>เบี้ยเลี้ยงสูงสุด (Stipend Max) ต้องมากกว่าหรือเท่ากับเบี้ยเลี้ยงขั้นต่ำ (Stipend Min) เสมอ</li>
                <li>วันปิดรับสมัครงานต้องเป็นวันในอนาคตสำหรับงานที่เปิดรับสมัคร</li>
              </ul>
            </div>

            <!-- Error message if backend rejected -->
            @if (serverErrorMessage) {
              <div class="p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-medium">
                ⚠️ {{ serverErrorMessage }}
              </div>
            }

            <!-- SECTION 1: Basic Information -->
            <div>
              <h2 class="text-sm font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 uppercase tracking-wider">
                1. ข้อมูลพื้นฐานของตำแหน่งงาน
              </h2>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <!-- Job Title (Full width) -->
                <div class="sm:col-span-2">
                  <label class="block text-xs font-semibold text-slate-700 mb-1">
                    ชื่อตำแหน่งงาน (Job Title) <span class="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    formControlName="title"
                    placeholder="เช่น Frontend Developer Intern (Angular)"
                    [class.border-red-500]="isFieldInvalid('title')"
                    class="w-full text-sm py-2.5 px-3.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                  />
                  @if (isFieldInvalid('title')) {
                    <p class="text-[11px] text-red-600 mt-1">กรุณาระบุชื่อตำแหน่งงาน (อย่างน้อย 3 ตัวอักษร)</p>
                  }
                </div>

                <!-- Company Selector -->
                <div>
                  <label class="block text-xs font-semibold text-slate-700 mb-1">
                    บริษัทผู้ว่าจ้าง (Company) <span class="text-red-500">*</span>
                  </label>
                  <select
                    formControlName="companyId"
                    [class.border-red-500]="isFieldInvalid('companyId')"
                    class="w-full text-sm py-2.5 px-3.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all">
                    <option value="" disabled>-- เลือกบริษัท --</option>
                    @for (comp of companies; track comp.id) {
                      <option [value]="comp.id">{{ comp.name }} ({{ comp.industry }})</option>
                    }
                  </select>
                  @if (isFieldInvalid('companyId')) {
                    <p class="text-[11px] text-red-600 mt-1">กรุณาเลือกบริษัทผู้ลงประกาศ</p>
                  }
                </div>

                <!-- Category -->
                <div>
                  <label class="block text-xs font-semibold text-slate-700 mb-1">
                    สายงาน (Category) <span class="text-red-500">*</span>
                  </label>
                  <select
                    formControlName="category"
                    [class.border-red-500]="isFieldInvalid('category')"
                    class="w-full text-sm py-2.5 px-3.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all">
                    <option value="Software Engineering">Software Engineering</option>
                    <option value="Data & AI">Data & AI</option>
                    <option value="Design">UI/UX & Design</option>
                    <option value="Marketing">Marketing & Media</option>
                    <option value="Business">Business & Management</option>
                  </select>
                </div>

                <!-- Job Type -->
                <div>
                  <label class="block text-xs font-semibold text-slate-700 mb-1">
                    ประเภทงาน (Job Type) <span class="text-red-500">*</span>
                  </label>
                  <select
                    formControlName="jobType"
                    class="w-full text-sm py-2.5 px-3.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all">
                    <option value="INTERNSHIP">ฝึกงาน (Internship)</option>
                    <option value="FULL_TIME">งานประจำ (Full-Time)</option>
                    <option value="PART_TIME">พาร์ทไทม์ (Part-Time)</option>
                  </select>
                </div>

                <!-- Workplace Type -->
                <div>
                  <label class="block text-xs font-semibold text-slate-700 mb-1">
                    สถานที่ทำงาน (Workplace) <span class="text-red-500">*</span>
                  </label>
                  <select
                    formControlName="workplaceType"
                    class="w-full text-sm py-2.5 px-3.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all">
                    <option value="HYBRID">ไฮบริด (Hybrid)</option>
                    <option value="REMOTE">ทำงานทางไกล (Remote 100%)</option>
                    <option value="ON_SITE">เข้าออฟฟิศ (On-Site)</option>
                  </select>
                </div>

                <!-- Location String -->
                <div class="sm:col-span-2">
                  <label class="block text-xs font-semibold text-slate-700 mb-1">
                    สถานที่ปฏิบัติงาน (Location Address) <span class="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    formControlName="location"
                    placeholder="เช่น Bangkok (BTS สยาม) หรือ เมืองทองธานี นนทบุรี"
                    [class.border-red-500]="isFieldInvalid('location')"
                    class="w-full text-sm py-2.5 px-3.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                  />
                  @if (isFieldInvalid('location')) {
                    <p class="text-[11px] text-red-600 mt-1">กรุณาระบุสถานที่ปฏิบัติงาน</p>
                  }
                </div>
              </div>
            </div>

            <!-- SECTION 2: Compensation & Schedule -->
            <div class="pt-2">
              <h2 class="text-sm font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 uppercase tracking-wider">
                2. ค่าตอบแทนและกำหนดการ (Business Rules)
              </h2>

              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <!-- Stipend Min -->
                <div>
                  <label class="block text-xs font-semibold text-slate-700 mb-1">
                    เบี้ยเลี้ยงขั้นต่ำ (฿/เดือน) <span class="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    formControlName="stipendMin"
                    [class.border-red-500]="isFieldInvalid('stipendMin') || hasStipendConflict()"
                    class="w-full text-sm py-2.5 px-3.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                  />
                  @if (isFieldInvalid('stipendMin')) {
                    <p class="text-[11px] text-red-600 mt-1">ค่าต้องไม่ติดลบ (>= 0)</p>
                  }
                </div>

                <!-- Stipend Max -->
                <div>
                  <label class="block text-xs font-semibold text-slate-700 mb-1">
                    เบี้ยเลี้ยงสูงสุด (฿/เดือน) <span class="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    formControlName="stipendMax"
                    [class.border-red-500]="isFieldInvalid('stipendMax') || hasStipendConflict()"
                    class="w-full text-sm py-2.5 px-3.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                  />
                  @if (isFieldInvalid('stipendMax')) {
                    <p class="text-[11px] text-red-600 mt-1">ค่าต้องไม่ติดลบ (>= 0)</p>
                  }
                </div>

                <!-- Deadline Date -->
                <div>
                  <label class="block text-xs font-semibold text-slate-700 mb-1">
                    วันปิดรับสมัคร (Deadline) <span class="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    formControlName="applicationDeadline"
                    [class.border-red-500]="isFieldInvalid('applicationDeadline')"
                    class="w-full text-sm py-2.5 px-3.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                  />
                  @if (isFieldInvalid('applicationDeadline')) {
                    <p class="text-[11px] text-red-600 mt-1">กรุณาระบุวันปิดรับสมัคร</p>
                  }
                </div>
              </div>

              <!-- Stipend Conflict Warning (Business Rule Violation Indicator) -->
              @if (hasStipendConflict()) {
                <div class="mt-2 text-xs text-red-600 font-semibold flex items-center gap-1.5">
                  <svg class="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                  </svg>
                  <span>Business Rule Violation: เบี้ยเลี้ยงสูงสุดต้องไม่น้อยกว่าเบี้ยเลี้ยงขั้นต่ำ!</span>
                </div>
              }
            </div>

            <!-- SECTION 3: Detailed Descriptions -->
            <div class="pt-2">
              <h2 class="text-sm font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 uppercase tracking-wider">
                3. รายละเอียดและคุณสมบัติ
              </h2>

              <div class="space-y-4">
                <!-- Description -->
                <div>
                  <label class="block text-xs font-semibold text-slate-700 mb-1">
                    รายละเอียดงานและหน้าที่ความรับผิดชอบ <span class="text-red-500">*</span>
                  </label>
                  <textarea
                    rows="4"
                    formControlName="description"
                    placeholder="อธิบายลักษณะงานที่ต้องปฏิบัติในแต่ละวัน..."
                    [class.border-red-500]="isFieldInvalid('description')"
                    class="w-full text-sm p-3.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"></textarea>
                  @if (isFieldInvalid('description')) {
                    <p class="text-[11px] text-red-600 mt-1">กรุณากรอกรายละเอียดงานอย่างน้อย 10 ตัวอักษร</p>
                  }
                </div>

                <!-- Requirements -->
                <div>
                  <label class="block text-xs font-semibold text-slate-700 mb-1">
                    คุณสมบัติผู้สมัคร (Requirements) <span class="text-red-500">*</span>
                  </label>
                  <textarea
                    rows="4"
                    formControlName="requirements"
                    placeholder="- นักศึกษาชั้นปีที่ 3-4 สาขาคอมพิวเตอร์&#10;- สามารถใช้งาน HTML, CSS, JavaScript / TypeScript ได้"
                    [class.border-red-500]="isFieldInvalid('requirements')"
                    class="w-full text-sm p-3.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"></textarea>
                  @if (isFieldInvalid('requirements')) {
                    <p class="text-[11px] text-red-600 mt-1">กรุณากรอกคุณสมบัติผู้สมัคร</p>
                  }
                </div>

                <!-- Benefits -->
                <div>
                  <label class="block text-xs font-semibold text-slate-700 mb-1">
                    สวัสดิการและสิ่งที่นักศึกษาจะได้รับ (Benefits & Perks)
                  </label>
                  <textarea
                    rows="3"
                    formControlName="benefits"
                    placeholder="- ฟรีอาหารกลางวัน และเครื่องดื่ม&#10;- โควตาบรรจุงานประจำหลังเรียนจบ"
                    class="w-full text-sm p-3.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"></textarea>
                </div>
              </div>
            </div>

            <!-- SECTION 4: Contact & Status -->
            <div class="pt-2">
              <h2 class="text-sm font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 uppercase tracking-wider">
                4. ข้อมูลการสมัครและสถานะ
              </h2>

              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <!-- Contact Email -->
                <div>
                  <label class="block text-xs font-semibold text-slate-700 mb-1">
                    อีเมลติดต่อรับสมัคร <span class="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    formControlName="contactEmail"
                    placeholder="hr@example.com"
                    [class.border-red-500]="isFieldInvalid('contactEmail')"
                    class="w-full text-sm py-2.5 px-3.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                  />
                  @if (isFieldInvalid('contactEmail')) {
                    <p class="text-[11px] text-red-600 mt-1">อีเมลต้องอยู่ในรูปแบบที่ถูกต้อง</p>
                  }
                </div>

                <!-- Apply URL -->
                <div>
                  <label class="block text-xs font-semibold text-slate-700 mb-1">
                    ลิงก์ระบบรับสมัคร (ถ้ามี)
                  </label>
                  <input
                    type="url"
                    formControlName="applyUrl"
                    placeholder="https://company.com/apply"
                    class="w-full text-sm py-2.5 px-3.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                  />
                </div>

                <!-- Status (Only in Edit mode, or default OPEN) -->
                <div>
                  <label class="block text-xs font-semibold text-slate-700 mb-1">
                    สถานะการรับสมัคร (Status)
                  </label>
                  <select
                    formControlName="status"
                    class="w-full text-sm py-2.5 px-3.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all">
                    <option value="OPEN">เปิดรับสมัคร (OPEN)</option>
                    <option value="CLOSED">ปิดรับสมัครแล้ว (CLOSED)</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Submit Buttons -->
            <div class="pt-6 border-t border-slate-200 flex items-center justify-end gap-3">
              <a
                [routerLink]="isEditMode && jobId ? ['/jobs', jobId] : ['/jobs']"
                class="px-5 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors">
                ยกเลิก
              </a>
              <button
                type="submit"
                [disabled]="isSubmitting || hasStipendConflict()"
                class="px-6 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed rounded-xl shadow-md shadow-indigo-500/20 transition-all flex items-center gap-2">
                @if (isSubmitting) {
                  <svg class="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                  </svg>
                }
                <span>{{ isEditMode ? 'บันทึกการแก้ไข (Save Changes)' : 'บันทึกประกาศงาน (Post Job)' }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
})
export class JobFormComponent implements OnInit {
  jobForm!: FormGroup;
  isEditMode = false;
  jobId: number | null = null;
  companies: Company[] = [];
  isSubmitting = false;
  serverErrorMessage = '';

  constructor(
    private readonly fb: FormBuilder,
    private readonly jobService: JobService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadCompanies();

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode = true;
      this.jobId = +idParam;
      this.loadJobForEdit(this.jobId);
    }
  }

  initForm(): void {
    // Default deadline 30 days ahead
    const defaultDeadline = new Date();
    defaultDeadline.setDate(defaultDeadline.getDate() + 30);
    const deadlineString = defaultDeadline.toISOString().split('T')[0];

    this.jobForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      companyId: ['', [Validators.required]],
      category: ['Software Engineering', [Validators.required]],
      jobType: ['INTERNSHIP', [Validators.required]],
      workplaceType: ['HYBRID', [Validators.required]],
      location: ['', [Validators.required]],
      stipendMin: [12000, [Validators.required, Validators.min(0)]],
      stipendMax: [15000, [Validators.required, Validators.min(0)]],
      applicationDeadline: [deadlineString, [Validators.required]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      requirements: ['', [Validators.required]],
      benefits: [''],
      contactEmail: ['', [Validators.required, Validators.email]],
      applyUrl: [''],
      status: ['OPEN'],
    });
  }

  loadCompanies(): void {
    this.jobService.getCompanies().subscribe({
      next: (data) => {
        this.companies = data;
        if (this.companies.length > 0 && !this.jobForm.get('companyId')?.value) {
          this.jobForm.patchValue({ companyId: this.companies[0].id });
        }
      },
      error: (err) => console.error('Error loading companies', err),
    });
  }

  loadJobForEdit(id: number): void {
    this.jobService.getJobById(id).subscribe({
      next: (job) => {
        let deadlineFormatted = '';
        if (job.applicationDeadline) {
          deadlineFormatted = new Date(job.applicationDeadline).toISOString().split('T')[0];
        }

        this.jobForm.patchValue({
          title: job.title,
          companyId: job.companyId,
          category: job.category,
          jobType: job.jobType,
          workplaceType: job.workplaceType,
          location: job.location,
          stipendMin: job.stipendMin,
          stipendMax: job.stipendMax,
          applicationDeadline: deadlineFormatted,
          description: job.description,
          requirements: job.requirements,
          benefits: job.benefits || '',
          contactEmail: job.contactEmail,
          applyUrl: job.applyUrl || '',
          status: job.status,
        });
      },
      error: (err) => {
        console.error('Failed to load job for editing', err);
        alert('ไม่สามารถโหลดข้อมูลตำแหน่งงานนี้ได้');
        this.router.navigate(['/jobs']);
      },
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.jobForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  hasStipendConflict(): boolean {
    const min = this.jobForm.get('stipendMin')?.value;
    const max = this.jobForm.get('stipendMax')?.value;
    if (min !== null && max !== null && typeof min === 'number' && typeof max === 'number') {
      return max < min;
    }
    return false;
  }

  onSubmit(): void {
    if (this.jobForm.invalid || this.hasStipendConflict()) {
      this.jobForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.serverErrorMessage = '';

    const formValue = { ...this.jobForm.value };
    formValue.companyId = +formValue.companyId;
    formValue.stipendMin = +formValue.stipendMin;
    formValue.stipendMax = +formValue.stipendMax;

    if (this.isEditMode && this.jobId) {
      this.jobService.updateJob(this.jobId, formValue).subscribe({
        next: (updated) => {
          this.isSubmitting = false;
          alert('แก้ไขข้อมูลตำแหน่งงานสำเร็จ!');
          this.router.navigate(['/jobs', updated.id]);
        },
        error: (err) => {
          this.isSubmitting = false;
          console.error('Update failed', err);
          this.serverErrorMessage = err.error?.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล';
        },
      });
    } else {
      this.jobService.createJob(formValue).subscribe({
        next: (created) => {
          this.isSubmitting = false;
          alert('ลงประกาศงานใหม่สำเร็จเรียบร้อย!');
          this.router.navigate(['/jobs', created.id]);
        },
        error: (err) => {
          this.isSubmitting = false;
          console.error('Create failed', err);
          this.serverErrorMessage = err.error?.message || 'เกิดข้อผิดพลาดในการสร้างตำแหน่งงาน';
        },
      });
    }
  }
}
