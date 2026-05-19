import { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/hooks/useAuth';
import { seedIfEmpty } from '@/lib/seed';
import AppLayout from '@/components/layout/AppLayout';
import HomePage from '@/pages/HomePage';
import JobsPage from '@/pages/JobsPage';
import JobDetailPage from '@/pages/JobDetailPage';
import LoginPage from '@/pages/LoginPage';
import SignupPage from '@/pages/SignupPage';
import HrDashboardPage from '@/pages/HrDashboardPage';
import HrJobsPage from '@/pages/HrJobsPage';
import HrJobApplicationsPage from '@/pages/HrJobApplicationsPage';
import HrPostJobPage from '@/pages/HrPostJobPage';
import HrApprovalsPage from '@/pages/HrApprovalsPage';
import MyApplicationsPage from '@/pages/MyApplicationsPage';
import NotFoundPage from '@/pages/NotFoundPage';

function ProtectedRoute({ children, role }: { children: React.ReactNode; role?: 'hr' | 'public' }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/jobs" element={<JobsPage />} />
        <Route path="/jobs/:id" element={<JobDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route
          path="/my-applications"
          element={
            <ProtectedRoute role="public">
              <MyApplicationsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hr"
          element={
            <ProtectedRoute role="hr">
              <HrDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hr/jobs"
          element={
            <ProtectedRoute role="hr">
              <HrJobsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hr/jobs/new"
          element={
            <ProtectedRoute role="hr">
              <HrPostJobPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hr/jobs/:id/applications"
          element={
            <ProtectedRoute role="hr">
              <HrJobApplicationsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hr/approvals"
          element={
            <ProtectedRoute role="hr">
              <HrApprovalsPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  useEffect(() => {
    seedIfEmpty();
  }, []);

  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
