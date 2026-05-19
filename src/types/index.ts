export type UserRole = 'public' | 'hr';

export interface User {
  id: string;
  email: string;
  password: string;
  fullName: string;
  role: UserRole;
  createdAt: string;
}

export type EmploymentType = 'Full-time' | 'Part-time' | 'Contract' | 'Internship';

export type JobStatus = 'open' | 'closed' | 'pending';

export interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  employmentType: EmploymentType;
  salaryMin: number;
  salaryMax: number;
  description: string;
  requirements: string;
  status: JobStatus;
  postedById: string;
  postedBy: string;
  postedAt: string;
}

export type ApplicationStatus =
  | 'applied'
  | 'submitted'
  | 'reviewing'
  | 'interviewed'
  | 'hired'
  | 'rejected';

export interface Application {
  id: string;
  jobId: string;
  applicantId: string;
  userId: string;
  applicantName: string;
  applicantEmail: string;
  resume: string;
  coverLetter: string;
  status: ApplicationStatus;
  appliedAt: string;
}
