export interface Company {
  id: number;
  name: string;
  logo?: string;
  website?: string;
  email: string;
  phone?: string;
  location: string;
  industry: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
  _count?: {
    jobs: number;
  };
}
