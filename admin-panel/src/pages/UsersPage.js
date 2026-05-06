// UsersPage.js
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { adminAPI } from '../services/api';

export function UsersPage() {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [roleFilter, setRoleFilter] = useState('');
  const [search, setSearch] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [newOfficer, setNewOfficer] = useState({ name: '', phone: '', email: '', password: '', department: '' });

  const fetchUsers = async () => {
    try {
      const [usersRes, deptRes] = await Promise.all([
        adminAPI.getUsers({ role: roleFilter, search }),
        adminAPI.getDepartments(),
      ]);
      setUsers(usersRes.data.users);
      setTotal(usersRes.data.total);
      setDepartments(deptRes.data.departments);
    } catch { toast.error('Failed to load users'); }
  };

  useEffect(() => { fetchUsers(); }, [roleFilter]);

  const handleToggle = async (id) => {
    try {
      const res = await adminAPI.toggleUser(id);
      toast.success(`User ${res.data.isActive ? 'activated' : 'deactivated'}`);
      fetchUsers();
    } catch { toast.error('Toggle failed'); }
  };

  const handleCreateOfficer = async (e) => {
    e.preventDefault();
    try {
      await adminAPI.createOfficer(newOfficer);
      toast.success('Officer created successfully!');
      setShowCreateForm(false);
      setNewOfficer({ name: '', phone: '', email: '', password: '', department: '' });
      fetchUsers();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to create officer'); }
  };

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#111827' }}>User Management</h1>
          <p style={{ color: '#6B7280', fontSize: 14 }}>{total} total users</p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          style={{ padding: '10px 18px', background: '#1B4332', color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}
        >
          + Add Officer
        </button>
      </div>

      {/* Create Officer Modal */}
      {showCreateForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: '#fff', borderRadius: 20, padding: 32, width: 440 }}>
            <h3 style={{ fontWeight: 800, marginBottom: 20 }}>Create Department Officer</h3>
            <form onSubmit={handleCreateOfficer} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[['Name', 'name', 'text'], ['Phone (10-digit)', 'phone', 'tel'], ['Email', 'email', 'email'], ['Password', 'password', 'password']].map(([label, key, type]) => (
                <div key={key}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 4, display: 'block' }}>{label}</label>
                  <input
                    type={type}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1.5px solid #E5E7EB', fontSize: 14, fontFamily: 'Inter', boxSizing: 'border-box' }}
                    value={newOfficer[key]}
                    onChange={(e) => setNewOfficer((f) => ({ ...f, [key]: e.target.value }))}
                    required
                  />
                </div>
              ))}
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 4, display: 'block' }}>Department</label>
                <select
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1.5px solid #E5E7EB', fontSize: 14, fontFamily: 'Inter' }}
                  value={newOfficer.department}
                  onChange={(e) => setNewOfficer((f) => ({ ...f, department: e.target.value }))}
                  required
                >
                  <option value="">Select Department</option>
                  {departments.map((d) => <option key={d._id} value={d._id}>{d.name}</option>)}
                </select>
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                <button type="submit" style={{ flex: 1, padding: '11px', background: '#1B4332', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, cursor: 'pointer' }}>Create Officer</button>
                <button type="button" onClick={() => setShowCreateForm(false)} style={{ flex: 1, padding: '11px', background: '#F3F4F6', border: 'none', borderRadius: 10, fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
        {['', 'citizen', 'department_officer', 'admin'].map((r) => (
          <button
            key={r}
            onClick={() => setRoleFilter(r)}
            style={{ padding: '8px 14px', borderRadius: 20, border: '1.5px solid', borderColor: roleFilter === r ? '#1B4332' : '#E5E7EB', background: roleFilter === r ? '#1B4332' : '#fff', color: roleFilter === r ? '#fff' : '#374151', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
          >
            {r || 'All'} {r === 'citizen' ? '👤' : r === 'department_officer' ? '👷' : r === 'admin' ? '🛡️' : ''}
          </button>
        ))}
      </div>

      <div style={{ background: '#fff', borderRadius: 16, overflow: 'auto', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
            <tr>
              {['Name', 'Phone', 'Role', 'Department', 'Ward', 'Joined', 'Status', 'Actions'].map((h) => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: '#6B7280', textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 34, height: 34, borderRadius: 17, background: '#E8F5E9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: '#1B4332' }}>
                      {user.name?.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>{user.name}</div>
                      <div style={{ fontSize: 12, color: '#9CA3AF' }}>{user.email || '—'}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '12px 16px', fontSize: 14, color: '#6B7280' }}>{user.phone}</td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{ padding: '3px 10px', borderRadius: 6, fontSize: 12, fontWeight: 600, background: user.role === 'admin' ? '#FEF3C7' : user.role === 'department_officer' ? '#DBEAFE' : '#F3F4F6', color: user.role === 'admin' ? '#D97706' : user.role === 'department_officer' ? '#2563EB' : '#6B7280' }}>
                    {user.role}
                  </span>
                </td>
                <td style={{ padding: '12px 16px', fontSize: 13, color: '#6B7280' }}>{user.department?.name || '—'}</td>
                <td style={{ padding: '12px 16px', fontSize: 13, color: '#6B7280' }}>{user.ward || '—'}</td>
                <td style={{ padding: '12px 16px', fontSize: 12, color: '#9CA3AF' }}>{format(new Date(user.createdAt), 'dd MMM yy')}</td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{ padding: '3px 10px', borderRadius: 6, fontSize: 12, fontWeight: 600, background: user.isActive ? '#D1FAE5' : '#FEE2E2', color: user.isActive ? '#059669' : '#DC2626' }}>
                    {user.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <button onClick={() => handleToggle(user._id)} style={{ padding: '5px 12px', borderRadius: 7, border: '1px solid #E5E7EB', background: '#fff', fontSize: 12, cursor: 'pointer', fontWeight: 600 }}>
                    {user.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UsersPage;
