import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JobService {
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

    return this.http.get<any>(`${this.baseUrl}/jobs`, { params }).pipe(
      map(res => this.extractArray(res)),
      catchError(() => {
        const fallbackUrl = this.baseUrl.replace('/api', '');
        return this.http.get<any>(`${fallbackUrl}/jobs`, { params }).pipe(
          map(res => this.extractArray(res)),
          catchError(() => of([]))
        );
      })
    );
  }

  private extractArray(res: any): any[] {
    if (Array.isArray(res)) return res;
    if (res && Array.isArray(res.data)) return res.data;
    if (res && Array.isArray(res.jobs)) return res.jobs;
    return [];
  }

  getJobById(id: string | number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/jobs/${id}`).pipe(
      catchError(() => {
        const fallbackUrl = this.baseUrl.replace('/api', '');
        return this.http.get<any>(`${fallbackUrl}/jobs/${id}`);
      })
    );
  }

  getCompanies(): Observable<any[]> {
    return this.http.get<any>(`${this.baseUrl}/companies`).pipe(
      map(res => this.extractArray(res)),
      catchError(() => {
        const fallbackUrl = this.baseUrl.replace('/api', '');
        return this.http.get<any>(`${fallbackUrl}/companies`).pipe(
          map(res => this.extractArray(res)),
          catchError(() => of([]))
        );
      })
    );
  }

  createJob(jobData: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/jobs`, jobData).pipe(
      catchError((err) => {
        if (err.status === 404) {
          const fallbackUrl = this.baseUrl.replace('/api', '');
          return this.http.post<any>(`${fallbackUrl}/jobs`, jobData);
        }
        throw err;
      })
    );
  }

  updateJob(id: string | number, jobData: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/jobs/${id}`, jobData).pipe(
      catchError((err) => {
        if (err.status === 404) {
          const fallbackUrl = this.baseUrl.replace('/api', '');
          return this.http.put<any>(`${fallbackUrl}/jobs/${id}`, jobData);
        }
        throw err;
      })
    );
  }

  deleteJob(id: string | number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/jobs/${id}`).pipe(
      catchError(() => {
        const fallbackUrl = this.baseUrl.replace('/api', '');
        return this.http.delete<any>(`${fallbackUrl}/jobs/${id}`);
      })
    );
  }
}