import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useJobs } from '@/hooks/useJobs';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Field, Input, Select, Textarea } from '@/components/ui/Input';
import type { EmploymentType } from '@/types';

const employmentTypes: EmploymentType[] = ['Full-time', 'Part-time', 'Contract', 'Internship'];

export default function HrPostJobPage() {
  const { user } = useAuth();
  const { addJob } = useJobs();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState('');
  const [location, setLocation] = useState('');
  const [employmentType, setEmploymentType] = useState<EmploymentType>('Full-time');
  const [salaryMin, setSalaryMin] = useState(80000);
  const [salaryMax, setSalaryMax] = useState(120000);
  const [description, setDescription] = useState('');
  const [requirements, setRequirements] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;
    addJob({
      title,
      department,
      location,
      employmentType,
      salaryMin,
      salaryMax,
      description,
      requirements: requirements.split('\n').map((r) => r.trim()).filter(Boolean),
      postedBy: user.id,
    });
    navigate('/hr/jobs');
  };

  return (
    <div style={{ maxWidth: 720, margin: '0 auto' }}>
      <h1 style={{ fontSize: 22, marginBottom: 4 }}>Post a new job</h1>
      <p style={{ color: 'var(--color-text-muted)', fontSize: 14, marginBottom: 20 }}>
        New postings are submitted for approval before going live.
      </p>
      <Card>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 14 }}>
          <Field label="Job title">
            <Input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Senior Product Designer" />
          </Field>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Field label="Department">
              <Input required value={department} onChange={(e) => setDepartment(e.target.value)} placeholder="Design" />
            </Field>
            <Field label="Location">
              <Input required value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Remote · US" />
            </Field>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            <Field label="Employment type">
              <Select value={employmentType} onChange={(e) => setEmploymentType(e.target.value as EmploymentType)}>
                {employmentTypes.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </Select>
            </Field>
            <Field label="Salary min">
              <Input type="number" required value={salaryMin} onChange={(e) => setSalaryMin(Number(e.target.value))} />
            </Field>
            <Field label="Salary max">
              <Input type="number" required value={salaryMax} onChange={(e) => setSalaryMax(Number(e.target.value))} />
            </Field>
          </div>
          <Field label="Description">
            <Textarea required value={description} onChange={(e) => setDescription(e.target.value)} />
          </Field>
          <Field label="Requirements" hint="One per line">
            <Textarea value={requirements} onChange={(e) => setRequirements(e.target.value)} placeholder={'3+ years experience\nStrong communication'} />
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
