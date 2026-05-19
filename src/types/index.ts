export type UserRole = 'hr' | 'public';

export type EmploymentType = 'Full-time' | 'Part-time' | 'Contract' | 'Internship';

export type JobStatus = 'open' | 'closed' | 'pending_approval';

export type ApplicationStatus =
  | 'submitted'
  | 'reviewing'
  | 'interview'
  | 'hired'
  | 'rejected';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  approved: boolean;
  createdAt: string;
}

export interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  description: string;
  employmentType: EmploymentType;
  salaryMin: number;
  salaryMax: number;
  requirements: string[];
  postedBy: string;
  postedAt: string;
  status: JobStatus;
}

export interface Application {
  id: string;
  jobId: string;
  applicantId: string;
  applicantName: string;
  applicantEmail: string;
  coverLetter: string;
  resumeFileName: string;
  status: ApplicationStatus;
  appliedAt: string;
}
