import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useJobs } from '@/hooks/useJobs';
import Button from '@/components/ui/Button';
import { Field, Input, Select, Textarea } from '@/components/ui/Input';
import type { Job } from '@/types';

export default function HrPostJobPage() {
  const { user } = useAuth();
  const { createJob } = useJobs();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState('');
  const [location, setLocation] = useState('');
  const [employmentType, setEmploymentType] = useState<Job['employmentType']>('Full-time');
  const [salaryMin, setSalaryMin] = useState(60000);
  const [salaryMax, setSalaryMax] = useState(90000);
  const [description, setDescription] = useState('');
  const [responsibilities, setResponsibilities] = useState('');
  const [requirements, setRequirements] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;
    createJob({
      title,
      department,
      location,
      employmentType,
      salaryMin,
      salaryMax,
      description,
      responsibilities: responsibilities
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
      requirements: requirements
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
      postedBy: user.id,
      status: 'pending_approval',
    });
    navigate('/hr/jobs');
  };

  return (
    <div>
      <h1 style={{ marginBottom: 'var(--space-5)' }}>Post a new job</h1>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 'var(--space-4)', maxWidth: 720 }}>
        <Field label="Job title">
          <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
        </Field>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
          <Field label="Department">
            <Input value={department} onChange={(e) => setDepartment(e.target.value)} required />
          </Field>
          <Field label="Location">
            <Input value={location} onChange={(e) => setLocation(e.target.value)} required />
          </Field>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--space-3)' }}>
          <Field label="Employment type">
            <Select value={employmentType} onChange={(e) => setEmploymentType(e.target.value as Job['employmentType'])}>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Internship">Internship</option>
            </Select>
          </Field>
          <Field label="Salary min (USD)">
            <Input type="number" value={salaryMin} onChange={(e) => setSalaryMin(Number(e.target.value))} required min={0} />
          </Field>
          <Field label="Salary max (USD)">
            <Input type="number" value={salaryMax} onChange={(e) => setSalaryMax(Number(e.target.value))} required min={0} />
          </Field>
        </div>
        <Field label="Description">
          <Textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
        </Field>
        <Field label="Responsibilities" hint="One per line">
          <Textarea value={responsibilities} onChange={(e) => setResponsibilities(e.target.value)} />
        </Field>
        <Field label="Requirements" hint="One per line">
          <Textarea value={requirements} onChange={(e) => setRequirements(e.target.value)} />
        </Field>
        <div>
          <Button type="submit">Submit for approval</Button>
        </div>
      </form>
    </div>
  );
}
