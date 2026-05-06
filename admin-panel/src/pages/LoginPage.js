import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { adminAPI } from '../services/api';

export default function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('admin@civicreport.in');
  const [password, setPassword] = useState('Admin@123');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await adminAPI.login(email, password);
      onLogin(res.data.token, res.data.user);
      toast.success('Welcome back, Admin!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.logo}>
          <span style={{ fontSize: 40 }}>🛡️</span>
          <h1 style={s.title}>CivicReport</h1>
          <p style={s.sub}>Admin & Officer Portal</p>
        </div>
        <form onSubmit={handleSubmit} style={s.form}>
          <div style={s.field}>
            <label style={s.label}>Email Address</label>
            <input style={s.input} type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div style={s.field}>
            <label style={s.label}>Password</label>
            <input style={s.input} type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" style={s.btn} disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In →'}
          </button>
        </form>
        <p style={s.hint}>Default: admin@civicreport.in / Admin@123</p>
      </div>
    </div>
  );
}

const s = {
  page: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #1B4332 0%, #2D6A4F 100%)' },
  card: { background: '#fff', borderRadius: 20, padding: 40, width: '100%', maxWidth: 400, boxShadow: '0 20px 60px rgba(0,0,0,0.2)' },
  logo: { textAlign: 'center', marginBottom: 32 },
  title: { fontSize: 28, fontWeight: 800, color: '#1B4332', margin: '8px 0 4px' },
  sub: { color: '#6B7280', fontSize: 14 },
  form: { display: 'flex', flexDirection: 'column', gap: 20 },
  field: { display: 'flex', flexDirection: 'column', gap: 6 },
  label: { fontSize: 13, fontWeight: 600, color: '#374151' },
  input: { padding: '12px 14px', borderRadius: 10, border: '1.5px solid #E5E7EB', fontSize: 15, outline: 'none', fontFamily: 'Inter' },
  btn: { padding: '14px', borderRadius: 12, background: '#1B4332', color: '#fff', fontSize: 16, fontWeight: 700, border: 'none', cursor: 'pointer', marginTop: 4 },
  hint: { textAlign: 'center', fontSize: 12, color: '#9CA3AF', marginTop: 16 },
};
