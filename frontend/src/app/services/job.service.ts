import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JobService {
  // สลับ URL อัตโนมัติ: ถ้าเปิดบนเครื่องตัวเองใช้ localhost ถ้าอยู่บนเว็บจริงใช้ Render
  private readonly baseUrl = window.location.hostname === 'localhost'
    ? 'http://localhost:3000/api'
    : 'https://internship-job-board.onrender.com/api';

  constructor(private http: HttpClient) {}

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

  getJobById(id: string | number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/jobs/${id}`);
  }

  getCompanies(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/companies`);
  }

  createJob(jobData: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/jobs`, jobData);
  }

  updateJob(id: string | number, jobData: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/jobs/${id}`, jobData);
  }

  deleteJob(id: string | number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/jobs/${id}`);
  }
}