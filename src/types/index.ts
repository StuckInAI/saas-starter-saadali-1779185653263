export type Role = 'public' | 'hr';

export type EmploymentType = 'full-time' | 'part-time' | 'contract' | 'internship';

export type JobStatus = 'open' | 'closed' | 'draft';

export type ApprovalStatus = 'pending' | 'approved' | 'rejected';

export type ApplicationStatus = 'submitted' | 'reviewing' | 'interview' | 'offer' | 'rejected';

export interface User {
  id: string;
  fullName: string;
  email: string;
  password: string;
  role: Role;
  createdAt: string;
}

/**
 * A session User has the same shape as User but without the password.
 * Used for the current logged-in user kept in memory / localStorage.
 */
export type SessionUser = Omit<User, 'password'>;

export interface PendingHrRequest {
  id: string;
  fullName: string;
  email: string;
  password: string;
  status: ApprovalStatus;
  requestedAt: string;
  reviewedAt?: string;
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
  requirements: string[];
  status: JobStatus;
  postedAt: string;
  postedBy: string;
}

export interface Application {
  id: string;
  jobId: string;
  applicantId: string;
  applicantName: string;
  applicantEmail: string;
  coverLetter: string;
  resumeSummary: string;
  status: ApplicationStatus;
  appliedAt: string;
}

export type AuthResult =
  | { ok: true; user: SessionUser; needsApproval?: boolean }
  | { ok: false; error: string };
