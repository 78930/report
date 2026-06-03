import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { issueAPI } from '../services/api';
import { COLORS, CATEGORY_CONFIG, STATUS_CONFIG } from '../utils/constants';

export default function MyIssuesScreen({ navigation }) {
  const { user } = useAuth();
  const { theme } = useTheme();
  const { t } = useLanguage();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filterStatus, setFilterStatus] = useState('');
  const s = styles(theme);

  const fetchMyIssues = useCallback(async () => {
    try {
      const res = await issueAPI.getMine({ ...(filterStatus && { status: filterStatus }) });
      setIssues(res.data.issues);
    } catch {} finally { setLoading(false); setRefreshing(false); }
  }, [filterStatus]);

  useEffect(() => { fetchMyIssues(); }, [filterStatus]);

  const STATUS_FILTERS = ['', 'open', 'in_progress', 'resolved'];

  if (!user) return (
    <View style={[s.center, { backgroundColor: theme.colors.background }]}>
      <Ionicons name="person-circle-outline" size={64} color={theme.colors.textSecondary} />
      <Text style={{ color: theme.colors.text, fontSize: 16, marginTop: 12 }}>{t('my_login_prompt')}</Text>
      <TouchableOpacity style={s.loginBtn} onPress={() => navigation.navigate('Auth')}>
        <Text style={s.loginBtnText}>{t('my_login_btn')}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[s.container, { backgroundColor: theme.colors.background }]}>
      <View style={s.filterRow}>
        {STATUS_FILTERS.map((st) => {
          const label = st ? t(`status_${st}`) : t('my_all');
          return (
            <TouchableOpacity key={st} style={[s.chip, filterStatus === st && s.chipActive]} onPress={() => setFilterStatus(st)}>
              <Text style={[s.chipText, filterStatus === st && s.chipTextActive]}>{label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {loading ? <ActivityIndicator color={COLORS.primary} style={{ marginTop: 40 }} /> : (
        <FlatList
          data={issues}
          keyExtractor={(i) => i._id}
          contentContainerStyle={s.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchMyIssues(); }} tintColor={COLORS.primary} />}
          ListEmptyComponent={
            <View style={s.empty}>
              <Ionicons name="clipboard-outline" size={48} color={theme.colors.textSecondary} />
              <Text style={{ color: theme.colors.textSecondary, marginTop: 12, fontSize: 15 }}>{t('my_no_issues')}</Text>
              <TouchableOpacity style={s.reportNewBtn} onPress={() => navigation.navigate('ReportIssue')}>
                <Text style={s.reportNewText}>{t('my_report_new')}</Text>
              </TouchableOpacity>
            </View>
          }
          renderItem={({ item }) => {
            const catCfg = CATEGORY_CONFIG[item.category] || CATEGORY_CONFIG.other;
            const statusCfg = STATUS_CONFIG[item.status] || STATUS_CONFIG.open;
            return (
              <TouchableOpacity style={s.card} onPress={() => navigation.navigate('IssueDetail', { issueId: item._id })}>
                <View style={s.cardLeft}>
                  <View style={[s.catDot, { backgroundColor: catCfg.color }]} />
                </View>
                <View style={s.cardBody}>
                  <Text style={s.title} numberOfLines={1}>{item.title}</Text>
                  <Text style={s.ticket}>{item.ticketId}</Text>
                  <View style={s.row}>
                    <View style={[s.statusBadge, { backgroundColor: statusCfg.bg }]}>
                      <Text style={[s.statusText, { color: statusCfg.color }]}>{t(`status_${item.status}`)}</Text>
                    </View>
                    <Text style={s.date}>{format(new Date(item.createdAt), 'dd MMM yyyy')}</Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={18} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            );
          }}
        />
      )}
    </View>
  );
}

const styles = (theme) => StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  filterRow: { flexDirection: 'row', gap: 8, padding: 16, paddingBottom: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, backgroundColor: theme.colors.card, borderWidth: 1, borderColor: theme.colors.border },
  chipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  chipText: { fontSize: 13, color: theme.colors.textSecondary },
  chipTextActive: { color: '#fff', fontWeight: '600' },
  list: { paddingHorizontal: 16, paddingBottom: 24 },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.card, borderRadius: 14, padding: 14, marginBottom: 10, elevation: 1 },
  cardLeft: { marginRight: 12 },
  catDot: { width: 10, height: 10, borderRadius: 5 },
  cardBody: { flex: 1, gap: 3 },
  title: { fontSize: 14, fontWeight: '700', color: theme.colors.text },
  ticket: { fontSize: 12, color: COLORS.accent, fontWeight: '600' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 2 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  statusText: { fontSize: 11, fontWeight: '600' },
  date: { fontSize: 12, color: theme.colors.textSecondary },
  empty: { alignItems: 'center', paddingTop: 60, gap: 8 },
  reportNewBtn: { marginTop: 12, backgroundColor: COLORS.primary, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10 },
  reportNewText: { color: '#fff', fontWeight: '700' },
  loginBtn: { marginTop: 16, backgroundColor: COLORS.primary, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 },
  loginBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});
