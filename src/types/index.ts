export type UserRole = 'public' | 'hr';
export type UserStatus = 'pending' | 'approved' | 'rejected';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
}

export interface StoredUser extends User {
  password: string;
}

export type JobStatus = 'open' | 'closed';
export type EmploymentType = 'Full-time' | 'Part-time' | 'Contract' | 'Internship';

export interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  employmentType: EmploymentType;
  salaryMin: number;
  salaryMax: number;
  description: string;
  requirements: string[];
  responsibilities: string[];
  status: JobStatus;
  postedAt: string;
  postedBy: string;
}

export type ApplicationStatus =
  | 'new'
  | 'submitted'
  | 'reviewing'
  | 'interview'
  | 'offer'
  | 'hired'
  | 'rejected';

export interface Application {
  id: string;
  jobId: string;
  userId: string;
  applicantName: string;
  applicantEmail: string;
  coverLetter: string;
  resumeText: string;
  status: ApplicationStatus;
  appliedAt: string;
}
