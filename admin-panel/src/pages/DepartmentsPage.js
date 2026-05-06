// DepartmentsPage.js
import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { adminAPI } from '../services/api';

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', code: '', categories: [], slaHours: 72, contactEmail: '', contactPhone: '' });

  const CATEGORIES = ['road', 'water', 'drainage', 'electricity', 'garbage', 'streetlight', 'other'];

  useEffect(() => { loadDepts(); }, []);

  const loadDepts = async () => {
    try {
      const res = await adminAPI.getDepartments();
      setDepartments(res.data.departments);
    } catch { toast.error('Failed to load departments'); }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await adminAPI.createDepartment(form);
      toast.success('Department created!');
      setShowForm(false);
      loadDepts();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const toggleCategory = (cat) => {
    setForm((f) => ({
      ...f,
      categories: f.categories.includes(cat) ? f.categories.filter((c) => c !== cat) : [...f.categories, cat],
    }));
  };

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: '#111827' }}>Departments</h1>
        <button onClick={() => setShowForm(true)} style={{ padding: '10px 18px', background: '#1B4332', color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
          + Add Department
        </button>
      </div>

      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: '#fff', borderRadius: 20, padding: 32, width: 480, maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 style={{ fontWeight: 800, marginBottom: 20 }}>Create Department</h3>
            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[['Department Name', 'name', 'text'], ['Code (e.g. PWD)', 'code', 'text'], ['Contact Email', 'contactEmail', 'email'], ['Contact Phone', 'contactPhone', 'tel']].map(([label, key, type]) => (
                <div key={key}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 4, display: 'block' }}>{label}</label>
                  <input type={type} value={form[key]} onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))} style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1.5px solid #E5E7EB', fontSize: 14, fontFamily: 'Inter', boxSizing: 'border-box' }} required={['name', 'code'].includes(key)} />
                </div>
              ))}
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 8, display: 'block' }}>Handles Categories</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {CATEGORIES.map((cat) => (
                    <button key={cat} type="button" onClick={() => toggleCategory(cat)} style={{ padding: '6px 12px', borderRadius: 8, border: '1.5px solid', borderColor: form.categories.includes(cat) ? '#1B4332' : '#E5E7EB', background: form.categories.includes(cat) ? '#1B4332' : '#fff', color: form.categories.includes(cat) ? '#fff' : '#374151', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 4, display: 'block' }}>SLA Hours (resolution target)</label>
                <input type="number" value={form.slaHours} onChange={(e) => setForm((f) => ({ ...f, slaHours: e.target.value }))} style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1.5px solid #E5E7EB', fontSize: 14, fontFamily: 'Inter', boxSizing: 'border-box' }} />
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                <button type="submit" style={{ flex: 1, padding: '11px', background: '#1B4332', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, cursor: 'pointer' }}>Create</button>
                <button type="button" onClick={() => setShowForm(false)} style={{ flex: 1, padding: '11px', background: '#F3F4F6', border: 'none', borderRadius: 10, fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
        {departments.map((dept) => (
          <div key={dept._id} style={{ background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', borderTop: '4px solid #1B4332' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: '#111827' }}>{dept.name}</h3>
              <span style={{ background: '#E8F5E9', color: '#1B4332', padding: '3px 10px', borderRadius: 6, fontSize: 12, fontWeight: 800, fontFamily: 'monospace' }}>{dept.code}</span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
              {dept.categories.map((cat) => (
                <span key={cat} style={{ background: '#F3F4F6', color: '#6B7280', padding: '3px 8px', borderRadius: 6, fontSize: 12, fontWeight: 600 }}>{cat}</span>
              ))}
            </div>
            <div style={{ fontSize: 13, color: '#6B7280', display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span>📧 {dept.contactEmail || 'N/A'}</span>
              <span>📞 {dept.contactPhone || 'N/A'}</span>
              <span>⏱️ SLA: {dept.slaHours}h</span>
              <span>👷 Officers: {dept.officers?.length || 0}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
