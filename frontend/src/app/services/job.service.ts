import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DashboardStats, Job, JobFilterParams } from '../models/job.model';
import { Company } from '../models/company.model';

@Injectable({
  providedIn: 'root',
})
export class JobService {
  private readonly apiUrl = 'http://localhost:3000/api';

  constructor(private readonly http: HttpClient) {}

  /**
   * Fetch all jobs with optional search and filters
   */
  getJobs(filters?: JobFilterParams): Observable<Job[]> {
    let params = new HttpParams();

    if (filters) {
      if (filters.search && filters.search.trim()) {
        params = params.set('search', filters.search.trim());
      }
      if (filters.category && filters.category !== 'ALL') {
        params = params.set('category', filters.category);
      }
      if (filters.jobType && filters.jobType !== 'ALL') {
        params = params.set('jobType', filters.jobType);
      }
      if (filters.workplaceType && filters.workplaceType !== 'ALL') {
        params = params.set('workplaceType', filters.workplaceType);
      }
      if (filters.status && filters.status !== 'ALL') {
        params = params.set('status', filters.status);
      }
      if (filters.companyId) {
        params = params.set('companyId', filters.companyId);
      }
    }

    return this.http.get<Job[]>(`${this.apiUrl}/jobs`, { params });
  }

  /**
   * Fetch a single job by its ID
   */
  getJobById(id: number): Observable<Job> {
    return this.http.get<Job>(`${this.apiUrl}/jobs/${id}`);
  }

  /**
   * Create a new job listing
   */
  createJob(jobData: any): Observable<Job> {
    return this.http.post<Job>(`${this.apiUrl}/jobs`, jobData);
  }

  /**
   * Update an existing job listing
   */
  updateJob(id: number, jobData: any): Observable<Job> {
    return this.http.put<Job>(`${this.apiUrl}/jobs/${id}`, jobData);
  }

  /**
   * Delete a job listing
   */
  deleteJob(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/jobs/${id}`);
  }

  /**
   * Fetch overall platform statistics
   */
  getStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.apiUrl}/jobs/stats`);
  }

  /**
   * Fetch all companies (for select dropdown)
   */
  getCompanies(): Observable<Company[]> {
    return this.http.get<Company[]>(`${this.apiUrl}/companies`);
  }
}
