import { Company } from './company.model';

export type JobType = 'INTERNSHIP' | 'FULL_TIME' | 'PART_TIME';
export type WorkplaceType = 'ON_SITE' | 'HYBRID' | 'REMOTE';
export type JobStatus = 'OPEN' | 'CLOSED';

export interface Job {
  id: number;
  title: string;
  companyId: number;
  company?: Company;
  category: string;
  jobType: JobType;
  workplaceType: WorkplaceType;
  description: string;
  requirements: string;
  benefits?: string;
  stipendMin: number;
  stipendMax: number;
  location: string;
  applicationDeadline: string;
  status: JobStatus;
  contactEmail: string;
  applyUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface JobFilterParams {
  search?: string;
  category?: string;
  jobType?: string;
  workplaceType?: string;
  status?: string;
  companyId?: string;
}

export interface DashboardStats {
  totalJobs: number;
  openJobs: number;
  totalCompanies: number;
  internshipCount: number;
}
