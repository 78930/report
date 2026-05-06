// IssueDetailPage.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { adminAPI } from '../services/api';
import API from '../services/api';

export default function IssueDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [issue, setIssue] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [officers, setOfficers] = useState([]);
  const [statusForm, setStatusForm] = useState({ status: '', note: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      API.get(`/issues/${id}`),
      adminAPI.getDepartments(),
      adminAPI.getUsers({ role: 'department_officer' }),
    ]).then(([issueRes, deptRes, usersRes]) => {
      setIssue(issueRes.data.issue);
      setStatusForm({ status: issueRes.data.issue.status, note: '' });
      setDepartments(deptRes.data.departments);
      setOfficers(usersRes.data.users);
    }).finally(() => setLoading(false));
  }, [id]);

  const handleStatusUpdate = async () => {
    try {
      await adminAPI.updateStatus(id, statusForm);
      toast.success('Status updated!');
      const res = await API.get(`/issues/${id}`);
      setIssue(res.data.issue);
    } catch { toast.error('Update failed'); }
  };

  if (loading) return <div style={{ padding: 40, color: '#6B7280' }}>Loading...</div>;
  if (!issue) return <div style={{ padding: 40 }}>Issue not found</div>;

  return (
    <div style={{ padding: 24, maxWidth: 900 }}>
      <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280', fontSize: 14, marginBottom: 16 }}>← Back to Issues</button>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20 }}>
        {/* Main Info */}
        <div>
          <div style={{ background: '#fff', borderRadius: 16, padding: 24, marginBottom: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <span style={{ fontFamily: 'monospace', fontSize: 14, fontWeight: 800, color: '#1B4332', background: '#E8F5E9', padding: '4px 10px', borderRadius: 6 }}>{issue.ticketId}</span>
              <span style={{ fontSize: 13, color: '#9CA3AF' }}>{format(new Date(issue.createdAt), 'dd MMM yyyy, hh:mm a')}</span>
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: '#111827', marginBottom: 8 }}>{issue.title}</h2>
            <p style={{ color: '#6B7280', lineHeight: 1.6, marginBottom: 16 }}>{issue.description}</p>

            {issue.images?.length > 0 && (
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 16 }}>
                {issue.images.map((img, i) => (
                  <img key={i} src={img.url} alt="issue" style={{ width: 120, height: 90, borderRadius: 8, objectFit: 'cover' }} />
                ))}
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {[
                ['Category', issue.category],
                ['Priority', issue.priority],
                ['Ward', issue.location?.ward || '—'],
                ['Location', issue.location?.address || '—'],
                ['Reported by', issue.reportedBy?.name || '—'],
                ['Department', issue.department?.name || 'Unassigned'],
                ['Assigned to', issue.assignedTo?.name || 'Unassigned'],
                ['Upvotes', issue.upvoteCount],
              ].map(([label, value]) => (
                <div key={label} style={{ background: '#F9FAFB', borderRadius: 10, padding: '10px 14px' }}>
                  <div style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 600, textTransform: 'uppercase' }}>{label}</div>
                  <div style={{ fontSize: 14, color: '#374151', fontWeight: 600, marginTop: 2, textTransform: 'capitalize' }}>{String(value)}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Status History */}
          <div style={{ background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Status History</h3>
            {issue.statusHistory?.map((h, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                <div style={{ width: 10, height: 10, borderRadius: 5, background: '#1B4332', marginTop: 4, flexShrink: 0 }} />
                <div>
                  <span style={{ fontWeight: 700, textTransform: 'capitalize' }}>{h.status.replace('_', ' ')}</span>
                  {h.note && <span style={{ color: '#6B7280', marginLeft: 8 }}>— {h.note}</span>}
                  <div style={{ fontSize: 12, color: '#9CA3AF' }}>{format(new Date(h.changedAt), 'dd MMM yyyy, hh:mm a')}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar Actions */}
        <div>
          <div style={{ background: '#fff', borderRadius: 16, padding: 20, marginBottom: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <h3 style={{ fontWeight: 700, marginBottom: 14 }}>Update Status</h3>
            <select
              style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1.5px solid #E5E7EB', fontSize: 14, marginBottom: 10, fontFamily: 'Inter' }}
              value={statusForm.status}
              onChange={(e) => setStatusForm((f) => ({ ...f, status: e.target.value }))}
            >
              {['open', 'assigned', 'in_progress', 'resolved', 'closed', 'rejected'].map((v) => (
                <option key={v} value={v}>{v.replace('_', ' ')}</option>
              ))}
            </select>
            <textarea
              style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1.5px solid #E5E7EB', fontSize: 13, fontFamily: 'Inter', resize: 'vertical', minHeight: 80 }}
              placeholder="Add a note (optional)..."
              value={statusForm.note}
              onChange={(e) => setStatusForm((f) => ({ ...f, note: e.target.value }))}
            />
            <button
              onClick={handleStatusUpdate}
              style={{ width: '100%', padding: '11px', background: '#1B4332', color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer', marginTop: 8 }}
            >
              Update Status
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
