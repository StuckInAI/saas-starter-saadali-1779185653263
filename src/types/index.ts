export type UserRole = 'hr' | 'public';
export type HrStatus = 'pending' | 'approved' | 'rejected';

export type User = {
  id: string;
  email: string;
  password: string;
  fullName: string;
  role: UserRole;
  hrStatus?: HrStatus;
  createdAt: string;
};

export type EmploymentType = 'Full-time' | 'Part-time' | 'Contract' | 'Internship' | 'Temporary';

export type Job = {
  id: string;
  title: string;
  department: string;
  location: string;
  employmentType: EmploymentType;
  salaryMin: number;
  salaryMax: number;
  description: string;
  requirements: string;
  deadline: string;
  postedById: string;
  postedAt: string;
  status: 'open' | 'closed';
};

export type ApplicationStatus = 'new' | 'reviewing' | 'interviewed' | 'rejected' | 'hired';

export type Application = {
  id: string;
  jobId: string;
  fullName: string;
  email: string;
  phone: string;
  coverLetter: string;
  resumeName: string;
  resumeDataUrl: string;
  status: ApplicationStatus;
  appliedAt: string;
};

export type AuthSession = {
  userId: string;
  role: UserRole;
} | null;
