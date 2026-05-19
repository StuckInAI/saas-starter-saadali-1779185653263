import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Field, Input, Textarea, Select } from '@/components/ui/Input';
import { useJobs } from '@/hooks/useJobs';
import { useAuth } from '@/hooks/useAuth';

export default function HrPostJobPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createJob } = useJobs();

  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState('');
  const [location, setLocation] = useState('');
  const [employmentType, setEmploymentType] = useState('Full-time');
  const [salaryMin, setSalaryMin] = useState('60000');
  const [salaryMax, setSalaryMax] = useState('90000');
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
      salaryMin: Number(salaryMin),
      salaryMax: Number(salaryMax),
      description,
      requirements,
      postedBy: user.id,
    });

    navigate('/hr/jobs');
  };

  return (
    <div>
      <h1 style={{ fontSize: 24, marginBottom: 6 }}>Post a new job</h1>
      <p style={{ color: 'var(--color-text-muted)', fontSize: 14, marginBottom: 24 }}>
        Fill out the details below. Your posting will be sent for approval before going live.
      </p>

      <Card>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 16 }}>
          <Field label="Job title">
            <Input value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="e.g. Senior Frontend Engineer" />
          </Field>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
            <Field label="Department">
              <Input value={department} onChange={(e) => setDepartment(e.target.value)} required placeholder="Engineering" />
            </Field>
            <Field label="Location">
              <Input value={location} onChange={(e) => setLocation(e.target.value)} required placeholder="Remote · NYC" />
            </Field>
            <Field label="Employment type">
              <Select value={employmentType} onChange={(e) => setEmploymentType(e.target.value)}>
                <option>Full-time</option>
                <option>Part-time</option>
                <option>Contract</option>
                <option>Internship</option>
              </Select>
            </Field>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
            <Field label="Salary min (USD)">
              <Input type="number" value={salaryMin} onChange={(e) => setSalaryMin(e.target.value)} required />
            </Field>
            <Field label="Salary max (USD)">
              <Input type="number" value={salaryMax} onChange={(e) => setSalaryMax(e.target.value)} required />
            </Field>
          </div>

          <Field label="Description">
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} required placeholder="Describe the role, team, and impact." />
          </Field>

          <Field label="Requirements" hint="One requirement per line">
            <Textarea value={requirements} onChange={(e) => setRequirements(e.target.value)} required placeholder={'5+ years of React experience\nStrong TypeScript skills'} />
          </Field>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <Button type="button" variant="ghost" onClick={() => navigate(-1)}>Cancel</Button>
            <Button type="submit">Submit for approval</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
