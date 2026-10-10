import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <header class="bg-white/90 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-50 transition-all">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <!-- Logo & Brand -->
          <a routerLink="/jobs" class="flex items-center gap-3 group">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
            </div>
            <div>
              <span class="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">JobMatch</span>
              <span class="text-xs font-semibold px-2 py-0.5 ml-2 bg-indigo-50 text-indigo-700 rounded-full border border-indigo-200/60">Internship & Job Board</span>
            </div>
          </a>

          <!-- Navigation Links -->
          <nav class="hidden md:flex items-center gap-1">
            <a
              routerLink="/jobs"
              routerLinkActive="bg-indigo-50 text-indigo-700 font-semibold"
              [routerLinkActiveOptions]="{ exact: true }"
              class="px-4 py-2 text-sm font-medium text-slate-600 hover:text-indigo-600 rounded-lg transition-colors">
              ค้นหางาน (Find Jobs)
            </a>
            <a
              routerLink="/jobs"
              [queryParams]="{ jobType: 'INTERNSHIP' }"
              class="px-4 py-2 text-sm font-medium text-slate-600 hover:text-indigo-600 rounded-lg transition-colors">
              ที่ฝึกงาน (Internships)
            </a>
          </nav>

          <!-- Post Job Action Button -->
          <div class="flex items-center gap-3">
            <a
              routerLink="/jobs/new"
              class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 rounded-xl shadow-sm hover:shadow-indigo-500/25 transition-all">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
              </svg>
              <span>ลงประกาศงาน (Post Job)</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  `,
})
export class NavbarComponent {}
