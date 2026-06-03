import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  RefreshControl, SafeAreaView, StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { issueAPI } from '../services/api';
import { COLORS, CATEGORY_CONFIG, STATUS_CONFIG } from '../utils/constants';

const MetricCard = ({ label, value, color, icon, theme }) => (
  <View style={[homeStyles(theme).metricCard, { borderLeftColor: color }]}>
    <Ionicons name={icon} size={22} color={color} />
    <Text style={[homeStyles(theme).metricValue, { color }]}>{value}</Text>
    <Text style={homeStyles(theme).metricLabel}>{label}</Text>
  </View>
);

const CategoryChip = ({ cat, count, label, onPress, theme }) => {
  const cfg = CATEGORY_CONFIG[cat];
  return (
    <TouchableOpacity style={[homeStyles(theme).catChip, { backgroundColor: cfg.bg }]} onPress={onPress}>
      <Ionicons name={cfg.icon} size={18} color={cfg.color} />
      <Text style={[homeStyles(theme).catLabel, { color: cfg.color }]}>{label}</Text>
      {count ? <View style={[homeStyles(theme).catBadge, { backgroundColor: cfg.color }]}><Text style={homeStyles(theme).catBadgeText}>{count}</Text></View> : null}
    </TouchableOpacity>
  );
};

export default function HomeScreen({ navigation }) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { t } = useLanguage();
  const [metrics, setMetrics] = useState(null);
  const [recentIssues, setRecentIssues] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const s = homeStyles(theme);

  const load = useCallback(async () => {
    try {
      const [mRes, iRes] = await Promise.all([
        issueAPI.getMetrics(),
        issueAPI.getAll({ limit: 5, sortBy: 'createdAt' }),
      ]);
      setMetrics(mRes.data.metrics);
      setRecentIssues(iRes.data.issues);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const m = metrics?.byStatus || {};

  return (
    <SafeAreaView style={s.container}>
      <StatusBar barStyle={theme.isDark ? 'light-content' : 'dark-content'} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}
      >
        {/* Header */}
        <View style={s.header}>
          <View>
            <Text style={s.greeting}>{t('home_greeting', { name: user?.name?.split(' ')[0] || '' })}</Text>
            <Text style={s.subGreeting}>{user?.ward || t('home_your_city')}</Text>
          </View>
          <View style={s.headerActions}>
            <TouchableOpacity onPress={toggleTheme} style={s.iconBtn}>
              <Ionicons name={theme.isDark ? 'sunny' : 'moon'} size={22} color={theme.colors.text} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Notifications')} style={s.iconBtn}>
              <Ionicons name="notifications-outline" size={22} color={theme.colors.text} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Report CTA */}
        <TouchableOpacity style={s.reportBtn} onPress={() => navigation.navigate('ReportIssue')}>
          <View style={s.reportBtnLeft}>
            <Ionicons name="add-circle" size={28} color={COLORS.white} />
            <View style={{ marginLeft: 12 }}>
              <Text style={s.reportBtnTitle}>{t('home_report_btn')}</Text>
              <Text style={s.reportBtnSub}>{t('home_report_sub')}</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={22} color={COLORS.white} />
        </TouchableOpacity>

        {/* Track Ticket */}
        <TouchableOpacity style={s.trackBtn} onPress={() => navigation.navigate('TrackIssue')}>
          <Ionicons name="search" size={18} color={COLORS.primary} />
          <Text style={s.trackText}>{t('home_track_btn')}</Text>
        </TouchableOpacity>

        {/* Metrics */}
        <Text style={s.sectionTitle}>{t('home_city_overview')}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.metricsRow}>
          <MetricCard label={t('home_open')} value={m.open || 0} color={COLORS.statusOpen} icon="alert-circle" theme={theme} />
          <MetricCard label={t('home_in_progress')} value={m.in_progress || 0} color={COLORS.statusInProgress} icon="construct" theme={theme} />
          <MetricCard label={t('home_resolved')} value={m.resolved || 0} color={COLORS.statusResolved} icon="checkmark-circle" theme={theme} />
          <MetricCard label={t('home_total')} value={metrics?.total || 0} color={COLORS.primary} icon="layers" theme={theme} />
        </ScrollView>

        {/* Categories */}
        <Text style={s.sectionTitle}>{t('home_browse_category')}</Text>
        <View style={s.categoriesGrid}>
          {Object.keys(CATEGORY_CONFIG).map((cat) => (
            <CategoryChip
              key={cat}
              cat={cat}
              label={t(`category_${cat}`)}
              count={metrics?.byCategory?.[cat]}
              onPress={() => navigation.navigate('PublicFeed', { category: cat })}
              theme={theme}
            />
          ))}
        </View>

        {/* Recent Issues */}
        <View style={s.sectionHeader}>
          <Text style={s.sectionTitle}>{t('home_recent_reports')}</Text>
          <TouchableOpacity onPress={() => navigation.navigate('PublicFeed')}>
            <Text style={s.seeAll}>{t('home_see_all')}</Text>
          </TouchableOpacity>
        </View>
        {recentIssues.map((issue) => (
          <TouchableOpacity
            key={issue._id}
            style={s.issueCard}
            onPress={() => navigation.navigate('IssueDetail', { issueId: issue._id })}
          >
            <View style={[s.categoryDot, { backgroundColor: CATEGORY_CONFIG[issue.category]?.color || '#888' }]} />
            <View style={s.issueCardContent}>
              <Text style={s.issueTitle} numberOfLines={1}>{issue.title}</Text>
              <View style={s.issueMeta}>
                <Text style={s.issueMetaText}>{t(`category_${issue.category}`)}</Text>
                <Text style={s.issueDot}>·</Text>
                <View style={[s.statusBadge, { backgroundColor: STATUS_CONFIG[issue.status]?.bg }]}>
                  <Text style={[s.statusText, { color: STATUS_CONFIG[issue.status]?.color }]}>
                    {t(`status_${issue.status}`)}
                  </Text>
                </View>
              </View>
            </View>
            <View style={s.upvoteCol}>
              <Ionicons name="arrow-up" size={14} color={theme.colors.textSecondary} />
              <Text style={s.upvoteCount}>{issue.upvoteCount}</Text>
            </View>
          </TouchableOpacity>
        ))}
        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const homeStyles = (theme) => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12 },
  greeting: { fontSize: 24, fontWeight: '800', color: theme.colors.text },
  subGreeting: { fontSize: 13, color: theme.colors.textSecondary, marginTop: 2 },
  headerActions: { flexDirection: 'row', gap: 8 },
  iconBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: theme.colors.card, justifyContent: 'center', alignItems: 'center' },
  reportBtn: { marginHorizontal: 20, backgroundColor: COLORS.primary, borderRadius: 18, padding: 18, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  reportBtnLeft: { flexDirection: 'row', alignItems: 'center' },
  reportBtnTitle: { color: '#fff', fontSize: 17, fontWeight: '700' },
  reportBtnSub: { color: 'rgba(255,255,255,0.7)', fontSize: 12, marginTop: 2 },
  trackBtn: { marginHorizontal: 20, backgroundColor: theme.colors.card, borderRadius: 12, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 20, borderWidth: 1, borderColor: theme.colors.border },
  trackText: { color: theme.colors.textSecondary, fontSize: 14 },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: theme.colors.text, paddingHorizontal: 20, marginBottom: 12 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingRight: 20 },
  seeAll: { color: COLORS.accent, fontSize: 14, fontWeight: '600' },
  metricsRow: { paddingHorizontal: 20, gap: 12, paddingBottom: 4, marginBottom: 20 },
  metricCard: { backgroundColor: theme.colors.card, borderRadius: 16, padding: 16, minWidth: 110, alignItems: 'center', borderLeftWidth: 4, elevation: 2 },
  metricValue: { fontSize: 26, fontWeight: '800', marginVertical: 4 },
  metricLabel: { fontSize: 12, color: theme.colors.textSecondary, fontWeight: '500' },
  categoriesGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16, gap: 8, marginBottom: 24 },
  catChip: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10 },
  catLabel: { fontSize: 13, fontWeight: '600' },
  catBadge: { borderRadius: 8, paddingHorizontal: 5, paddingVertical: 1, marginLeft: 2 },
  catBadgeText: { color: '#fff', fontSize: 10, fontWeight: '700' },
  issueCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.card, marginHorizontal: 20, marginBottom: 8, borderRadius: 14, padding: 14, elevation: 1 },
  categoryDot: { width: 10, height: 10, borderRadius: 5, marginRight: 12 },
  issueCardContent: { flex: 1 },
  issueTitle: { fontSize: 14, fontWeight: '600', color: theme.colors.text, marginBottom: 4 },
  issueMeta: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  issueMetaText: { fontSize: 12, color: theme.colors.textSecondary },
  issueDot: { color: theme.colors.textSecondary },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  statusText: { fontSize: 11, fontWeight: '600' },
  upvoteCol: { alignItems: 'center', marginLeft: 8 },
  upvoteCount: { fontSize: 12, color: theme.colors.textSecondary, marginTop: 2 },
});
