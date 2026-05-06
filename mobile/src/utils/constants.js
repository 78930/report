export const COLORS = {
  primary: '#1B4332',
  primaryLight: '#2D6A4F',
  primaryDark: '#081C15',
  accent: '#40916C',
  accentLight: '#52B788',
  success: '#16A34A',
  warning: '#F59E0B',
  error: '#DC2626',
  info: '#3B82F6',

  // Status colors
  statusOpen: '#EF4444',
  statusAssigned: '#F59E0B',
  statusInProgress: '#3B82F6',
  statusResolved: '#10B981',
  statusClosed: '#6B7280',
  statusRejected: '#7F1D1D',

  // Neutral
  white: '#FFFFFF',
  black: '#000000',
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  gray800: '#1F2937',
  gray900: '#111827',

  // Dark mode
  darkBg: '#0D1117',
  darkCard: '#161B22',
  darkBorder: '#30363D',
  darkText: '#E6EDF3',
  darkTextSecondary: '#8B949E',
};

export const CATEGORY_CONFIG = {
  road: { label: 'Road & Potholes', icon: 'road', color: '#7C3AED', bg: '#EDE9FE' },
  water: { label: 'Water Supply', icon: 'water', color: '#2563EB', bg: '#DBEAFE' },
  drainage: { label: 'Drainage', icon: 'pipe', color: '#0891B2', bg: '#CFFAFE' },
  electricity: { label: 'Electricity', icon: 'flash', color: '#D97706', bg: '#FEF3C7' },
  garbage: { label: 'Garbage', icon: 'trash', color: '#16A34A', bg: '#DCFCE7' },
  streetlight: { label: 'Street Light', icon: 'sunny', color: '#CA8A04', bg: '#FEF9C3' },
  other: { label: 'Other', icon: 'ellipsis-horizontal', color: '#4B5563', bg: '#F3F4F6' },
};

export const PRIORITY_CONFIG = {
  low: { label: 'Low', color: '#10B981', bg: '#D1FAE5' },
  medium: { label: 'Medium', color: '#F59E0B', bg: '#FEF3C7' },
  high: { label: 'High', color: '#EF4444', bg: '#FEE2E2' },
  critical: { label: 'Critical', color: '#7F1D1D', bg: '#FCA5A5' },
};

export const STATUS_CONFIG = {
  open: { label: 'Open', color: '#EF4444', bg: '#FEE2E2', icon: 'alert-circle' },
  assigned: { label: 'Assigned', color: '#F59E0B', bg: '#FEF3C7', icon: 'person' },
  in_progress: { label: 'In Progress', color: '#3B82F6', bg: '#DBEAFE', icon: 'construct' },
  resolved: { label: 'Resolved', color: '#10B981', bg: '#D1FAE5', icon: 'checkmark-circle' },
  closed: { label: 'Closed', color: '#6B7280', bg: '#F3F4F6', icon: 'archive' },
  rejected: { label: 'Rejected', color: '#DC2626', bg: '#FEE2E2', icon: 'close-circle' },
};

export const WARDS = Array.from({ length: 100 }, (_, i) => ({
  value: `Ward ${i + 1}`,
  label: `Ward ${i + 1}`,
}));

export const SORT_OPTIONS = [
  { value: 'createdAt', label: 'Newest First' },
  { value: 'upvoteCount', label: 'Most Upvoted' },
  { value: 'priority', label: 'Priority' },
];
