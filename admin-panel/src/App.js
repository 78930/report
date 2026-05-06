import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import IssuesPage from './pages/IssuesPage';
import IssueDetailPage from './pages/IssueDetailPage';
import UsersPage from './pages/UsersPage';
import DepartmentsPage from './pages/DepartmentsPage';

const NAV_ITEMS = [
  { path: '/dashboard', label: 'Dashboard', icon: '📊' },
  { path: '/issues', label: 'Issues', icon: '📋' },
  { path: '/users', label: 'Users', icon: '👥' },
  { path: '/departments', label: 'Departments', icon: '🏢' },
];

function Sidebar({ onLogout }) {
  const location = useLocation();
  return (
    <aside style={sidebarStyle}>
      <div style={logoStyle}>
        <span style={{ fontSize: 24 }}>🛡️</span>
        <div>
          <div style={{ fontWeight: 800, fontSize: 16, color: '#fff' }}>CivicReport</div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>Admin Panel</div>
        </div>
      </div>
      <nav style={{ flex: 1, padding: '8px 12px' }}>
        {NAV_ITEMS.map((item) => (
          <Link key={item.path} to={item.path} style={navLinkStyle(location.pathname.startsWith(item.path))}>
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
      <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <button onClick={onLogout} style={logoutBtnStyle}>
          🚪 Logout
        </button>
      </div>
    </aside>
  );
}

function Layout({ children, onLogout }) {
  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Sidebar onLogout={onLogout} />
      <main style={{ flex: 1, overflow: 'auto', background: '#F0F4F8' }}>
        {children}
      </main>
    </div>
  );
}

function ProtectedRoute({ children, isAuthenticated }) {
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('admin_token'));
  const [admin, setAdmin] = useState(null);

  const handleLogin = (token, user) => {
    localStorage.setItem('admin_token', token);
    setIsAuthenticated(true);
    setAdmin(user);
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setIsAuthenticated(false);
    setAdmin(null);
  };

  return (
    <Router>
      <Toaster position="top-right" toastOptions={{ style: { fontFamily: 'Inter', fontSize: 14 } }} />
      <Routes>
        <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <LoginPage onLogin={handleLogin} />} />
        <Route path="/*" element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <Layout onLogout={handleLogout}>
              <Routes>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/issues" element={<IssuesPage />} />
                <Route path="/issues/:id" element={<IssueDetailPage />} />
                <Route path="/users" element={<UsersPage />} />
                <Route path="/departments" element={<DepartmentsPage />} />
                <Route path="/" element={<Navigate to="/dashboard" />} />
              </Routes>
            </Layout>
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

// Styles
const sidebarStyle = {
  width: 240, background: '#1B4332', display: 'flex', flexDirection: 'column',
  height: '100vh', flexShrink: 0,
};
const logoStyle = {
  display: 'flex', alignItems: 'center', gap: 10, padding: '20px 16px',
  borderBottom: '1px solid rgba(255,255,255,0.1)',
};
const navLinkStyle = (active) => ({
  display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
  borderRadius: 8, textDecoration: 'none', marginBottom: 2, fontSize: 14,
  color: active ? '#fff' : 'rgba(255,255,255,0.65)',
  background: active ? 'rgba(255,255,255,0.15)' : 'transparent',
  fontWeight: active ? 600 : 400,
  transition: 'all 0.15s',
});
const logoutBtnStyle = {
  width: '100%', padding: '8px 12px', background: 'rgba(255,255,255,0.1)',
  border: 'none', borderRadius: 8, color: 'rgba(255,255,255,0.8)',
  fontSize: 14, cursor: 'pointer', textAlign: 'left',
};
