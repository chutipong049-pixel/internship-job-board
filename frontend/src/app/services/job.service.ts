import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JobService {
  private readonly apiUrl = window.location.hostname === 'localhost'
    ? 'http://localhost:3000/api'
    : 'https://internship-job-board.onrender.com/api';

  constructor(private http: HttpClient) {}

  getJobs(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/jobs`);
  }

  getJobById(id: string | number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/jobs/${id}`);
  }

  createJob(jobData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/jobs`, jobData);
  }
}