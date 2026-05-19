import { Link } from 'react-router-dom';
import Button from '@/components/ui/Button';

export default function NotFoundPage() {
  return (
    <div style={{ textAlign: 'center', padding: '80px 20px' }}>
      <h1 style={{ fontSize: 48, marginBottom: 8 }}>404</h1>
      <p style={{ color: 'var(--color-text-muted)', marginBottom: 24 }}>The page you're looking for doesn't exist.</p>
      <Link to="/"><Button>Go home</Button></Link>
    </div>
  );
}
