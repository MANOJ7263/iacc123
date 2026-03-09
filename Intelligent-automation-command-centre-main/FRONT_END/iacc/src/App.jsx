import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import DashboardPage from '@/pages/DashboardPage';
import TaskSubmissionPage from '@/pages/TaskSubmissionPage';
import AutomationPage from '@/pages/AutomationPage';
import DepartmentsPage from '@/pages/DepartmentsPage';
import WelcomePage from '@/pages/WelcomePage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import AdminDepartmentsPage from '@/pages/AdminDepartmentsPage';
import AdminAssignTaskPage from '@/pages/AdminAssignTaskPage';
import AdminTaskStatusPage from '@/pages/AdminTaskStatusPage';
import AdminProfilePage from '@/pages/AdminProfilePage';
import DeptDashboard from '@/pages/DeptDashboard';

// ─── Role Protected Route Wrapper ─────────────────────────────────────────────
const ProtectedRoute = ({ children, requiredRole }) => {
  const userStr = localStorage.getItem('user');
  if (!userStr) {
    return <Navigate to="/login" replace />;
  }

  const user = JSON.parse(userStr);
  const userRoles = user.roles || [];

  if (requiredRole && !userRoles.includes(requiredRole)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// ─── Any Authenticated Route (no specific role required) ─────────────────────
const AuthenticatedRoute = ({ children }) => {
  const userStr = localStorage.getItem('user');
  if (!userStr) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* ── Public / Landing ── */}
        <Route path="/" element={<WelcomePage />} />

        {/* ── Auth Routes ── */}
        <Route path="/admin/auth" element={<LoginPage gateway="ADMIN" title="Admin Command Access" />} />
        <Route path="/dept/auth" element={<LoginPage gateway="DEPT" title="Department Portal" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* ══════════════════════════════════════════════════════════════════
            DISTRICT COLLECTOR (Supreme Admin) Routes
        ══════════════════════════════════════════════════════════════════ */}
        <Route path="/dashboard/admin/central" element={
          <ProtectedRoute requiredRole="ROLE_COLLECTOR">
            <DashboardLayout><DashboardPage /></DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/departments" element={
          <ProtectedRoute requiredRole="ROLE_COLLECTOR">
            <DashboardLayout><AdminDepartmentsPage /></DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/assign-task" element={
          <ProtectedRoute requiredRole="ROLE_COLLECTOR">
            <DashboardLayout><AdminAssignTaskPage /></DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/task-status" element={
          <ProtectedRoute requiredRole="ROLE_COLLECTOR">
            <DashboardLayout><AdminTaskStatusPage /></DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/profile" element={
          <ProtectedRoute requiredRole="ROLE_COLLECTOR">
            <DashboardLayout><AdminProfilePage /></DashboardLayout>
          </ProtectedRoute>
        } />

        {/* ══════════════════════════════════════════════════════════════════
            DEPARTMENT DASHBOARDS — Universal Route: /dashboard/:dept/:subRole
            
            Covers ALL departments × ALL sub-roles:
            
            EDUCATION:
              /dashboard/education/ceo         → CEO Dashboard
              /dashboard/education/deo         → DEO Dashboard
              /dashboard/education/headmaster  → Headmaster Dashboard
              /dashboard/education/student     → Student Dashboard
              /dashboard/education/automation-supervisor → Automation Supervisor

            HEALTH:
              /dashboard/health/cmo            → CMO Dashboard
              /dashboard/health/dho            → DHO Dashboard
              /dashboard/health/hospital-warden → Hospital Warden Dashboard
              /dashboard/health/doctor         → Doctor Dashboard
              /dashboard/health/automation-supervisor

            TRANSPORT:
              /dashboard/transport/cto         → CTO Dashboard
              /dashboard/transport/dto         → DTO Dashboard
              /dashboard/transport/rto-officer → RTO Officer Dashboard
              /dashboard/transport/staff       → Transport Staff Dashboard
              /dashboard/transport/automation-supervisor

            FINANCE:
              /dashboard/finance/cfo           → CFO Dashboard
              /dashboard/finance/dfo           → DFO Dashboard
              /dashboard/finance/accounts-officer → Accounts Officer Dashboard
              /dashboard/finance/staff         → Finance Staff Dashboard
              /dashboard/finance/automation-supervisor

            REVENUE:
              /dashboard/revenue/cro           → CRO Dashboard
              /dashboard/revenue/dro           → DRO Dashboard
              /dashboard/revenue/tahsildar     → Tahsildar Dashboard
              /dashboard/revenue/staff         → Revenue Staff Dashboard
              /dashboard/revenue/automation-supervisor
        ══════════════════════════════════════════════════════════════════ */}
        <Route path="/dashboard/:dept/:subRole" element={
          <AuthenticatedRoute>
            <DeptDashboard />
          </AuthenticatedRoute>
        } />

        {/* ══════════════════════════════════════════════════════════════════
            LEGACY / COMPATIBILITY ROUTES
        ══════════════════════════════════════════════════════════════════ */}

        {/* Staff Portal (generic fallback for ROLE_STAFF without subRole) */}
        <Route path="/staff-portal" element={
          <ProtectedRoute requiredRole="ROLE_STAFF">
            <DashboardLayout>
              <div style={{ padding: '1.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem', color: '#0f172a' }}>
                  Staff Workspace
                </h2>
                <TaskSubmissionPage />
              </div>
            </DashboardLayout>
          </ProtectedRoute>
        } />

        {/* Auto Supervisor (generic fallback) */}
        <Route path="/active-monitoring" element={
          <ProtectedRoute requiredRole="ROLE_AUTO_SUPERVISOR">
            <DashboardLayout><AutomationPage /></DashboardLayout>
          </ProtectedRoute>
        } />

        {/* Old dept head route alias */}
        <Route path="/dashboard/:dept/head" element={
          <ProtectedRoute requiredRole="ROLE_DEPT_HEAD">
            <DashboardLayout><DepartmentsPage /></DashboardLayout>
          </ProtectedRoute>
        } />

        {/* Legacy admin alias */}
        <Route path="/admin-dashboard" element={<Navigate to="/dashboard/admin/central" replace />} />
        <Route path="/dept-dashboard" element={<Navigate to="/login" replace />} />

        {/* Generic dashboard fallback */}
        <Route path="/dashboard" element={
          <AuthenticatedRoute>
            <DashboardLayout><DashboardPage /></DashboardLayout>
          </AuthenticatedRoute>
        } />

        {/* ── Catch All ── */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
