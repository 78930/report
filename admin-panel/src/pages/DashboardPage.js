import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { adminAPI } from '../services/api';

const STAT_COLORS = {
  open: '#EF4444', in_progress: '#3B82F6', resolved: '#10B981',
  assigned: '#F59E0B', closed: '#6B7280',
};
const CAT_COLORS = ['#7C3AED', '#2563EB', '#0891B2', '#D97706', '#16A34A', '#CA8A04', '#4B5563'];

function StatCard({ label, value, icon, color, sub }) {
  return (
    <div style={{ ...s.statCard, borderLeftColor: color }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p style={{ color: '#6B7280', fontSize: 13, fontWeight: 500 }}>{label}</p>
          <h2 style={{ fontSize: 32, fontWeight: 800, color: '#111827', marginTop: 4 }}>{value ?? '—'}</h2>
          {sub && <p style={{ fontSize: 12, color: '#9CA3AF', marginTop: 2 }}>{sub}</p>}
        </div>
        <span style={{ fontSize: 28 }}>{icon}</span>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getDashboard().then((res) => {
      setData(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div style={s.loading}>Loading dashboard...</div>;

  const { stats, categoryTrend } = data || {};

  // Pie chart data from status
  const pieData = stats ? [
    { name: 'Open', value: stats.openIssues, color: STAT_COLORS.open },
    { name: 'In Progress', value: stats.inProgressIssues, color: STAT_COLORS.in_progress },
    { name: 'Resolved', value: stats.resolvedIssues, color: STAT_COLORS.resolved },
  ] : [];

  // Bar chart: group categoryTrend by date
  const barMap = {};
  (categoryTrend || []).forEach(({ _id, count }) => {
    if (!barMap[_id.date]) barMap[_id.date] = { date: _id.date };
    barMap[_id.date][_id.category] = count;
  });
  const barData = Object.values(barMap).slice(-7);
  const categories = ['road', 'water', 'drainage', 'electricity', 'garbage', 'streetlight'];

  return (
    <div style={s.page}>
      <div style={s.header}>
        <h1 style={s.pageTitle}>Dashboard</h1>
        <p style={s.pageDate}>{new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      {/* Stat Cards */}
      <div style={s.statsGrid}>
        <StatCard label="Total Issues" value={stats?.totalIssues} icon="📋" color="#6B7280" />
        <StatCard label="Open" value={stats?.openIssues} icon="🔴" color="#EF4444" sub="Needs attention" />
        <StatCard label="In Progress" value={stats?.inProgressIssues} icon="🔵" color="#3B82F6" sub="Being worked on" />
        <StatCard label="Resolved" value={stats?.resolvedIssues} icon="✅" color="#10B981" sub={`${stats?.resolutionRate}% rate`} />
        <StatCard label="Citizens" value={stats?.totalUsers} icon="👥" color="#8B5CF6" />
        <StatCard label="Today" value={stats?.todayIssues} icon="📅" color="#F59E0B" sub="New reports today" />
        <StatCard label="Avg Resolution" value={stats?.avgResolutionHours ? `${stats.avgResolutionHours}h` : 'N/A'} icon="⏱️" color="#06B6D4" />
        <StatCard label="Escalations" value={stats?.escalations} icon="⚠️" color="#DC2626" sub="Need immediate action" />
      </div>

      {/* Charts */}
      <div style={s.chartsGrid}>
        {/* Bar Chart */}
        <div style={s.chartCard}>
          <h3 style={s.chartTitle}>Issues by Category (Last 7 Days)</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={barData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              {categories.map((cat, i) => (
                <Bar key={cat} dataKey={cat} stackId="a" fill={CAT_COLORS[i]} name={cat} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div style={s.chartCard}>
          <h3 style={s.chartTitle}>Status Distribution</h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={3} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {pieData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={s.actionsRow}>
        <h3 style={{ ...s.chartTitle, margin: 0 }}>Quick Actions</h3>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 12 }}>
          {[
            { label: '📋 View Open Issues', path: '/issues?status=open' },
            { label: '⚠️ View Escalations', path: '/issues?escalated=true' },
            { label: '👥 Manage Officers', path: '/users?role=department_officer' },
            { label: '🏢 Departments', path: '/departments' },
          ].map((action) => (
            <a key={action.path} href={action.path} style={s.actionBtn}>{action.label}</a>
          ))}
        </div>
      </div>
    </div>
  );
}

const s = {
  page: { padding: 24, maxWidth: 1400 },
  loading: { display: 'flex', alignItems: 'center', justifyContent: 'center', height: 400, fontSize: 16, color: '#6B7280' },
  header: { marginBottom: 24 },
  pageTitle: { fontSize: 28, fontWeight: 800, color: '#111827' },
  pageDate: { color: '#6B7280', fontSize: 14, marginTop: 4 },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, marginBottom: 24 },
  statCard: { background: '#fff', borderRadius: 16, padding: 20, borderLeft: '4px solid #ccc', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' },
  chartsGrid: { display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16, marginBottom: 24 },
  chartCard: { background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' },
  chartTitle: { fontSize: 15, fontWeight: 700, color: '#374151', marginBottom: 16 },
  actionsRow: { background: '#fff', borderRadius: 16, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' },
  actionBtn: { display: 'inline-block', padding: '10px 16px', background: '#F3F4F6', borderRadius: 10, textDecoration: 'none', fontSize: 14, fontWeight: 600, color: '#374151', transition: 'background 0.15s' },
};
