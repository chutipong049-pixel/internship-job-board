import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JobService {
  // ชี้ตรงไปยัง Backend บน Render
  private readonly baseUrl = 'https://internship-job-board.onrender.com/api';

  constructor(private http: HttpClient) {}

  // ดึงรายการงานทั้งหมด พร้อมรองรับฟิลเตอร์
  getJobs(filters?: any): Observable<any[]> {
    let params = new HttpParams();
    if (filters) {
      Object.keys(filters).forEach(key => {
        if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '') {
          params = params.set(key, filters[key]);
        }
      });
    }
    return this.http.get<any[]>(`${this.baseUrl}/jobs`, { params });
  }

  // ดึงงานรายตำแหน่งด้วย ID
  getJobById(id: string | number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/jobs/${id}`);
  }

  // ดึงรายชื่อบริษัทสำหรับ Dropdown ในฟอร์ม
  getCompanies(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/companies`);
  }

  // สร้างประกาศงานใหม่
  createJob(jobData: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/jobs`, jobData);
  }

  // แก้ไขประกาศงาน
  updateJob(id: string | number, jobData: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/jobs/${id}`, jobData);
  }

  // ลบประกาศงาน
  deleteJob(id: string | number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/jobs/${id}`);
  }
}