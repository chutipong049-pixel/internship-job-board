import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="bg-white border-t border-slate-200 mt-auto">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="flex flex-col md:flex-row items-center justify-between gap-4">
          <div class="flex items-center gap-2">
            <div class="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">
              JM
            </div>
            <p class="text-sm text-slate-500">
              © 2026 <strong>Internship & Job Board</strong> — Full-Stack Web Application (Group 1)
            </p>
          </div>
          <div class="flex items-center gap-6 text-xs text-slate-500">
            <span>Angular • Tailwind CSS • NestJS • PostgreSQL • Prisma</span>
          </div>
        </div>
      </div>
    </footer>
  `,
})
export class FooterComponent { }
