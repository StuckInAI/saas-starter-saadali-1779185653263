import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Field, Input, Textarea, Select } from '@/components/ui/Input';
import { useJobs } from '@/hooks/useJobs';
import { useAuth } from '@/hooks/useAuth';
import type { EmploymentType } from '@/types';

export default function HrPostJobPage() {
  const { user } = useAuth();
  const { createJob } = useJobs();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState('');
  const [location, setLocation] = useState('');
  const [employmentType, setEmploymentType] = useState<EmploymentType>('Full-time');
  const [salaryMin, setSalaryMin] = useState('');
  const [salaryMax, setSalaryMax] = useState('');
  const [description, setDescription] = useState('');
  const [requirements, setRequirements] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;
    createJob({
      title,
      department,
      location,
      employmentType,
      salaryMin: Number(salaryMin) || 0,
      salaryMax: Number(salaryMax) || 0,
      description,
      requirements: requirements.split('\n').map((r) => r.trim()).filter(Boolean),
      postedById: user.id,
      postedByName: user.fullName,
    });
    navigate('/hr/jobs');
  };

  return (
    <div style={{ maxWidth: 720, margin: '0 auto' }}>
      <h1 style={{ fontSize: 24, marginBottom: 4 }}>Post a new job</h1>
      <p style={{ color: 'var(--color-text-muted)', marginBottom: 20 }}>
        New postings are submitted for approval before going live.
      </p>
      <Card>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Field label="Job title">
            <Input value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="e.g. Senior Frontend Engineer" />
          </Field>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Field label="Department">
              <Input value={department} onChange={(e) => setDepartment(e.target.value)} required placeholder="Engineering" />
            </Field>
            <Field label="Location">
              <Input value={location} onChange={(e) => setLocation(e.target.value)} required placeholder="Remote / NYC" />
            </Field>
          </div>
          <Field label="Employment type">
            <Select value={employmentType} onChange={(e) => setEmploymentType(e.target.value as EmploymentType)}>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Internship">Internship</option>
            </Select>
          </Field>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Field label="Salary minimum (USD)">
              <Input type="number" value={salaryMin} onChange={(e) => setSalaryMin(e.target.value)} required />
            </Field>
            <Field label="Salary maximum (USD)">
              <Input type="number" value={salaryMax} onChange={(e) => setSalaryMax(e.target.value)} required />
            </Field>
          </div>
          <Field label="Description">
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} required placeholder="Describe the role, team, and impact." />
          </Field>
          <Field label="Requirements" hint="One per line">
            <Textarea value={requirements} onChange={(e) => setRequirements(e.target.value)} placeholder={'5+ years of experience\nProficient in React'} />
          </Field>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <Button type="button" variant="secondary" onClick={() => navigate('/hr/jobs')}>Cancel</Button>
            <Button type="submit">Submit for approval</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
