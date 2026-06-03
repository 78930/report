import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { adminAPI } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

const STATUS_COLORS = {
  open: { bg: '#FEE2E2', color: '#DC2626' },
  assigned: { bg: '#FEF3C7', color: '#D97706' },
  in_progress: { bg: '#DBEAFE', color: '#2563EB' },
  resolved: { bg: '#D1FAE5', color: '#059669' },
  closed: { bg: '#F3F4F6', color: '#6B7280' },
  rejected: { bg: '#FEE2E2', color: '#7F1D1D' },
};

const PRIORITY_COLORS = {
  low: '#10B981', medium: '#F59E0B', high: '#EF4444', critical: '#7F1D1D',
};

const CATEGORY_ICONS = {
  road: '🛣️', water: '💧', drainage: '🌊', electricity: '⚡', garbage: '🗑️', streetlight: '💡', other: '📌',
};

export default function IssuesPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const [issues, setIssues] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    status: searchParams.get('status') || '',
    category: '',
    priority: '',
    escalated: searchParams.get('escalated') || '',
    search: '',
  });
  const [updatingId, setUpdatingId] = useState(null);
  const limit = 20;

  useEffect(() => { fetchIssues(); }, [page, filters]);

  const fetchIssues = async () => {
    setLoading(true);
    try {
      const res = await adminAPI.getIssues({ ...filters, page, limit });
      setIssues(res.data.issues);
      setTotal(res.data.total);
    } catch { toast.error(t('issues_fetch_error')); }
    setLoading(false);
  };

  const updateStatus = async (id, status, note = '') => {
    setUpdatingId(id);
    try {
      await adminAPI.updateStatus(id, { status, note });
      toast.success(t('issues_status_updated', { status }));
      fetchIssues();
    } catch { toast.error(t('issues_update_error')); }
    setUpdatingId(null);
  };

  const filterBar = (
    <div style={s.filterBar}>
      <input
        style={s.searchInput}
        placeholder={t('issues_search')}
        value={filters.search}
        onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
        onKeyDown={(e) => e.key === 'Enter' && fetchIssues()}
      />
      <select style={s.select} value={filters.status} onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}>
        <option value="">{t('issues_all_status')}</option>
        {['open', 'assigned', 'in_progress', 'resolved', 'closed', 'rejected'].map((v) => (
          <option key={v} value={v}>{t(`status_${v}`)}</option>
        ))}
      </select>
      <select style={s.select} value={filters.category} onChange={(e) => setFilters((f) => ({ ...f, category: e.target.value }))}>
        <option value="">{t('issues_all_category')}</option>
        {['road', 'water', 'drainage', 'electricity', 'garbage', 'streetlight', 'other'].map((v) => (
          <option key={v} value={v}>{t(`category_${v}`)}</option>
        ))}
      </select>
      <select style={s.select} value={filters.priority} onChange={(e) => setFilters((f) => ({ ...f, priority: e.target.value }))}>
        <option value="">{t('issues_all_priority')}</option>
        {['low', 'medium', 'high', 'critical'].map((v) => (
          <option key={v} value={v}>{t(`priority_${v}`)}</option>
        ))}
      </select>
      <button style={s.filterBtn} onClick={fetchIssues}>{t('issues_apply')}</button>
    </div>
  );

  const HEADERS = [
    t('issues_col_ticket'), t('issues_col_issue'), t('issues_col_category'),
    t('issues_col_priority'), t('issues_col_status'), t('issues_col_ward'),
    t('issues_col_reported'), t('issues_col_actions'),
  ];

  return (
    <div style={s.page}>
      <div style={s.header}>
        <div>
          <h1 style={s.pageTitle}>{t('issues_title')}</h1>
          <p style={{ color: '#6B7280', fontSize: 14 }}>{t('issues_total', { total })}</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {filters.escalated && <span style={{ background: '#FEE2E2', color: '#DC2626', padding: '6px 12px', borderRadius: 8, fontSize: 13, fontWeight: 600 }}>{t('issues_escalated_badge')}</span>}
        </div>
      </div>

      {filterBar}

      {loading ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#6B7280' }}>{t('issues_loading')}</div>
      ) : (
        <div style={s.tableWrap}>
          <table style={s.table}>
            <thead>
              <tr style={s.thead}>
                {HEADERS.map((h) => (
                  <th key={h} style={s.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {issues.map((issue) => (
                <tr key={issue._id} style={s.tr}>
                  <td style={s.td}>
                    <span style={{ fontFamily: 'monospace', fontSize: 12, color: '#1B4332', fontWeight: 700 }}>{issue.ticketId}</span>
                  </td>
                  <td style={s.td}>
                    <div
                      style={{ cursor: 'pointer', color: '#1B4332', fontWeight: 600, fontSize: 14, maxWidth: 220 }}
                      onClick={() => navigate(`/issues/${issue._id}`)}
                    >
                      {issue.title}
                    </div>
                    <div style={{ fontSize: 12, color: '#9CA3AF', marginTop: 2 }}>{issue.reportedBy?.name}</div>
                  </td>
                  <td style={s.td}>
                    <span>{CATEGORY_ICONS[issue.category]} {t(`category_${issue.category}`)}</span>
                  </td>
                  <td style={s.td}>
                    <span style={{ color: PRIORITY_COLORS[issue.priority], fontWeight: 700, fontSize: 13, textTransform: 'uppercase' }}>
                      {t(`priority_${issue.priority}`)}
                    </span>
                  </td>
                  <td style={s.td}>
                    <select
                      style={{ ...s.statusSelect, background: STATUS_COLORS[issue.status]?.bg, color: STATUS_COLORS[issue.status]?.color }}
                      value={issue.status}
                      onChange={(e) => updateStatus(issue._id, e.target.value)}
                      disabled={updatingId === issue._id}
                    >
                      {['open', 'assigned', 'in_progress', 'resolved', 'closed', 'rejected'].map((v) => (
                        <option key={v} value={v}>{t(`status_${v}`)}</option>
                      ))}
                    </select>
                  </td>
                  <td style={s.td}>
                    <span style={{ fontSize: 13, color: '#6B7280' }}>{issue.location?.ward || '—'}</span>
                  </td>
                  <td style={s.td}>
                    <span style={{ fontSize: 12, color: '#9CA3AF' }}>
                      {format(new Date(issue.createdAt), 'dd MMM yy')}
                    </span>
                  </td>
                  <td style={s.td}>
                    <button style={s.viewBtn} onClick={() => navigate(`/issues/${issue._id}`)}>{t('issues_view_btn')}</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      <div style={s.pagination}>
        <button style={s.pageBtn} onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>{t('issues_prev')}</button>
        <span style={{ fontSize: 14, color: '#6B7280' }}>{t('issues_page_of', { page, total: Math.ceil(total / limit) })}</span>
        <button style={s.pageBtn} onClick={() => setPage((p) => p + 1)} disabled={page >= Math.ceil(total / limit)}>{t('issues_next')}</button>
      </div>
    </div>
  );
}

const s = {
  page: { padding: 24 },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  pageTitle: { fontSize: 24, fontWeight: 800, color: '#111827' },
  filterBar: { display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' },
  searchInput: { flex: '1 1 250px', padding: '10px 14px', borderRadius: 10, border: '1.5px solid #E5E7EB', fontSize: 14, fontFamily: 'Inter', outline: 'none' },
  select: { padding: '10px 12px', borderRadius: 10, border: '1.5px solid #E5E7EB', fontSize: 13, fontFamily: 'Inter', background: '#fff', cursor: 'pointer', outline: 'none' },
  filterBtn: { padding: '10px 18px', background: '#1B4332', color: '#fff', borderRadius: 10, border: 'none', fontSize: 14, fontWeight: 600, cursor: 'pointer' },
  tableWrap: { background: '#fff', borderRadius: 16, overflow: 'auto', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' },
  table: { width: '100%', borderCollapse: 'collapse' },
  thead: { background: '#F9FAFB', borderBottom: '1px solid #E5E7EB' },
  th: { padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: 0.5, whiteSpace: 'nowrap' },
  tr: { borderBottom: '1px solid #F3F4F6', transition: 'background 0.1s' },
  td: { padding: '12px 16px', fontSize: 14, color: '#374151', verticalAlign: 'middle' },
  statusSelect: { padding: '5px 10px', borderRadius: 8, border: 'none', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter' },
  viewBtn: { padding: '6px 12px', background: '#F3F4F6', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', color: '#374151' },
  pagination: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16, marginTop: 20 },
  pageBtn: { padding: '8px 16px', background: '#fff', border: '1.5px solid #E5E7EB', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', color: '#374151' },
};
