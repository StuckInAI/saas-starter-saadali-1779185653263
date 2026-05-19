export type Role = 'public' | 'hr';

export type JobStatus = 'open' | 'closed' | 'pending_approval';

export type ApplicationStatus =
  | 'submitted'
  | 'under_review'
  | 'interview'
  | 'rejected'
  | 'offer';

export interface User {
  id: string;
  fullName: string;
  email: string;
  password: string;
  role: Role;
  approved?: boolean;
  createdAt: string;
}

// StoredUser is the shape persisted to localStorage. It matches User.
export type StoredUser = User;

export interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  description: string;
  employmentType: 'Full-time' | 'Part-time' | 'Contract' | 'Internship';
  responsibilities: string[];
  requirements: string[];
  salaryMin: number;
  salaryMax: number;
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

export interface AuthResultOk {
  ok: true;
  needsApproval?: boolean;
}
export interface AuthResultErr {
  ok: false;
  error: string;
}
export type AuthResult = AuthResultOk | AuthResultErr;
