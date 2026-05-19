export type Role = 'public' | 'hr';

export type HrStatus = 'pending' | 'approved' | 'rejected';

export type EmploymentType = 'Full-time' | 'Part-time' | 'Contract' | 'Internship';

export type JobStatus = 'open' | 'closed';

export type ApplicationStatus = 'new' | 'reviewing' | 'shortlisted' | 'rejected' | 'hired';

export interface User {
  id: string;
  email: string;
  password: string;
  fullName: string;
  role: Role;
  hrStatus?: HrStatus;
  createdAt: string;
}

export interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  employmentType: EmploymentType;
  salaryMin: number;
  salaryMax: number;
  description: string;
  requirements?: string;
  deadline?: string;
  status: JobStatus;
  postedAt: string;
  postedBy?: string;
}

export interface Application {
  id: string;
  jobId: string;
  userId?: string;
  fullName: string;
  email: string;
  phone?: string;
  resumeUrl?: string;
  coverLetter?: string;
  status: ApplicationStatus;
  appliedAt: string;
}
