import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  TextInput, ActivityIndicator, RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { issueAPI } from '../services/api';
import { COLORS, CATEGORY_CONFIG, STATUS_CONFIG } from '../utils/constants';

const IssueCard = ({ issue, onPress, theme, t }) => {
  const catCfg = CATEGORY_CONFIG[issue.category] || CATEGORY_CONFIG.other;
  const statusCfg = STATUS_CONFIG[issue.status] || STATUS_CONFIG.open;
  const s = cardStyles(theme);
  return (
    <TouchableOpacity style={s.card} onPress={onPress}>
      <View style={s.top}>
        <View style={[s.catBadge, { backgroundColor: catCfg.bg }]}>
          <Ionicons name={catCfg.icon} size={14} color={catCfg.color} />
          <Text style={[s.catText, { color: catCfg.color }]}>{t(`category_${issue.category}`)}</Text>
        </View>
        <View style={[s.statusBadge, { backgroundColor: statusCfg.bg }]}>
          <Text style={[s.statusText, { color: statusCfg.color }]}>{t(`status_${issue.status}`)}</Text>
        </View>
      </View>
      <Text style={s.title} numberOfLines={2}>{issue.title}</Text>
      <Text style={s.desc} numberOfLines={2}>{issue.description}</Text>
      <View style={s.footer}>
        <View style={s.metaItem}>
          <Ionicons name="location-outline" size={13} color={theme.colors.textSecondary} />
          <Text style={s.metaText}>{issue.location?.ward || issue.location?.address?.split(',')[0] || 'N/A'}</Text>
        </View>
        <View style={s.metaItem}>
          <Ionicons name="arrow-up" size={13} color={theme.colors.textSecondary} />
          <Text style={s.metaText}>{issue.upvoteCount}</Text>
        </View>
        <Text style={s.dateText}>{format(new Date(issue.createdAt), 'dd MMM')}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default function PublicFeedScreen({ route, navigation }) {
  const { category: initCat } = route.params || {};
  const { theme } = useTheme();
  const { t } = useLanguage();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState(initCat || '');
  const [filterStatus, setFilterStatus] = useState('');
  const s = feedStyles(theme);

  const fetchIssues = useCallback(async (pg = 1, refresh = false) => {
    try {
      const res = await issueAPI.getAll({
        page: pg, limit: 15,
        ...(filterCat && { category: filterCat }),
        ...(filterStatus && { status: filterStatus }),
      });
      const newIssues = res.data.issues;
      setIssues(refresh ? newIssues : (prev) => [...prev, ...newIssues]);
      setHasMore(pg < res.data.pages);
      setPage(pg);
    } catch {}
    setLoading(false);
    setRefreshing(false);
  }, [filterCat, filterStatus]);

  useEffect(() => { setLoading(true); fetchIssues(1, true); }, [filterCat, filterStatus]);

  const onRefresh = () => { setRefreshing(true); fetchIssues(1, true); };
  const onLoadMore = () => { if (hasMore && !loading) fetchIssues(page + 1); };

  const categoryFilters = [
    { value: '', label: t('feed_all') },
    ...Object.keys(CATEGORY_CONFIG).map((k) => ({ value: k, label: t(`category_${k}`) })),
  ];

  return (
    <View style={s.container}>
      {/* Search */}
      <View style={s.searchBox}>
        <Ionicons name="search" size={18} color={theme.colors.textSecondary} />
        <TextInput
          style={s.searchInput}
          placeholder={t('feed_search_placeholder')}
          placeholderTextColor={theme.colors.textSecondary}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Category Filter */}
      <FlatList
        horizontal
        data={categoryFilters}
        keyExtractor={(i) => i.value}
        contentContainerStyle={s.filterRow}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[s.filterChip, filterCat === item.value && s.filterChipActive]}
            onPress={() => setFilterCat(item.value)}
          >
            <Text style={[s.filterChipText, filterCat === item.value && s.filterChipTextActive]}>{item.label}</Text>
          </TouchableOpacity>
        )}
      />

      {/* Issues List */}
      <FlatList
        data={issues.filter((i) => !search || i.title.toLowerCase().includes(search.toLowerCase()))}
        keyExtractor={(i) => i._id}
        contentContainerStyle={s.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}
        onEndReached={onLoadMore}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={!loading && <View style={s.empty}><Ionicons name="document-text-outline" size={48} color={theme.colors.textSecondary} /><Text style={s.emptyText}>{t('feed_no_issues')}</Text></View>}
        ListFooterComponent={loading && <ActivityIndicator color={COLORS.primary} style={{ margin: 20 }} />}
        renderItem={({ item }) => (
          <IssueCard
            issue={item}
            theme={theme}
            t={t}
            onPress={() => navigation.navigate('IssueDetail', { issueId: item._id })}
          />
        )}
      />
    </View>
  );
}

const cardStyles = (theme) => StyleSheet.create({
  card: { backgroundColor: theme.colors.card, borderRadius: 14, padding: 16, marginBottom: 10, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, shadowOffset: { width: 0, height: 2 } },
  top: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  catBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  catText: { fontSize: 11, fontWeight: '600' },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  statusText: { fontSize: 11, fontWeight: '600' },
  title: { fontSize: 15, fontWeight: '700', color: theme.colors.text, marginBottom: 4 },
  desc: { fontSize: 13, color: theme.colors.textSecondary, lineHeight: 18, marginBottom: 10 },
  footer: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  metaText: { fontSize: 12, color: theme.colors.textSecondary },
  dateText: { fontSize: 12, color: theme.colors.textSecondary, marginLeft: 'auto' },
});

const feedStyles = (theme) => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  searchBox: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: theme.colors.card, marginHorizontal: 16, marginTop: 12, marginBottom: 8, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, borderWidth: 1, borderColor: theme.colors.border },
  searchInput: { flex: 1, color: theme.colors.text, fontSize: 15 },
  filterRow: { paddingHorizontal: 16, paddingBottom: 8, gap: 8 },
  filterChip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, backgroundColor: theme.colors.card, borderWidth: 1, borderColor: theme.colors.border },
  filterChipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  filterChipText: { fontSize: 13, color: theme.colors.textSecondary, fontWeight: '500' },
  filterChipTextActive: { color: '#fff', fontWeight: '600' },
  list: { paddingHorizontal: 16, paddingBottom: 24 },
  empty: { alignItems: 'center', paddingTop: 60, gap: 12 },
  emptyText: { color: theme.colors.textSecondary, fontSize: 15 },
});
