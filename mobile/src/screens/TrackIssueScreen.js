import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  ActivityIndicator, SafeAreaView, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { issueAPI } from '../services/api';
import { COLORS, CATEGORY_CONFIG, STATUS_CONFIG } from '../utils/constants';
import { format } from 'date-fns';

const STATUS_STEPS = ['open', 'assigned', 'in_progress', 'resolved'];

export default function TrackIssueScreen({ navigation }) {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const [ticketId, setTicketId] = useState('');
  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(false);
  const s = styles(theme);

  const handleSearch = async () => {
    if (!ticketId.trim()) return;
    setLoading(true);
    setIssue(null);
    try {
      const res = await issueAPI.getByTicket(ticketId.trim().toUpperCase());
      setIssue(res.data.issue);
    } catch {
      Alert.alert(t('track_not_found'), t('track_not_found_msg', { ticketId: ticketId.toUpperCase() }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={s.container}>
      <View style={s.navBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={s.navTitle}>{t('track_nav_title')}</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={s.content}>
        <Text style={s.helperText}>{t('track_helper_text')}</Text>
        <View style={s.searchRow}>
          <TextInput
            style={s.input}
            placeholder={t('track_input_placeholder')}
            placeholderTextColor={theme.colors.textSecondary}
            value={ticketId}
            onChangeText={setTicketId}
            autoCapitalize="characters"
            onSubmitEditing={handleSearch}
          />
          <TouchableOpacity style={s.searchBtn} onPress={handleSearch} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" size="small" /> : <Ionicons name="search" size={22} color="#fff" />}
          </TouchableOpacity>
        </View>

        {issue && (
          <View style={s.resultCard}>
            <View style={s.ticketRow}>
              <Text style={s.ticketId}>{issue.ticketId}</Text>
              <View style={[s.statusBadge, { backgroundColor: STATUS_CONFIG[issue.status]?.bg }]}>
                <Text style={[s.statusText, { color: STATUS_CONFIG[issue.status]?.color }]}>
                  {t(`status_${issue.status}`)}
                </Text>
              </View>
            </View>

            <Text style={s.title}>{issue.title}</Text>
            <Text style={s.meta}>
              📂 {t(`category_${issue.category}`)} · 📅 {format(new Date(issue.createdAt), 'dd MMM yyyy')}
            </Text>
            {issue.location?.address && <Text style={s.meta}>📍 {issue.location.address}</Text>}
            {issue.department && <Text style={s.meta}>🏢 {issue.department.name}</Text>}
            {issue.assignedTo && <Text style={s.meta}>👷 {t('track_assigned_to', { name: issue.assignedTo.name })}</Text>}
            {issue.resolvedAt && <Text style={s.meta}>{t('track_resolved_on', { date: format(new Date(issue.resolvedAt), 'dd MMM yyyy') })}</Text>}

            {/* Progress Steps */}
            <View style={s.stepsRow}>
              {STATUS_STEPS.map((st, i) => {
                const currentIdx = STATUS_STEPS.indexOf(issue.status);
                const done = i <= currentIdx;
                return (
                  <React.Fragment key={st}>
                    <View style={s.step}>
                      <View style={[s.stepDot, done && { backgroundColor: COLORS.primary }]}>
                        {done && <Ionicons name="checkmark" size={12} color="#fff" />}
                      </View>
                      <Text style={[s.stepLabel, done && { color: COLORS.primary, fontWeight: '600' }]}>{t(`status_${st}`)}</Text>
                    </View>
                    {i < STATUS_STEPS.length - 1 && (
                      <View style={[s.stepLine, { backgroundColor: done && i < currentIdx ? COLORS.primary : theme.colors.border }]} />
                    )}
                  </React.Fragment>
                );
              })}
            </View>

            <TouchableOpacity
              style={s.viewFullBtn}
              onPress={() => navigation.navigate('IssueDetail', { issueId: issue._id })}
            >
              <Text style={s.viewFullText}>{t('track_view_full')}</Text>
              <Ionicons name="chevron-forward" size={16} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = (theme) => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  navBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 14, backgroundColor: theme.colors.card, borderBottomWidth: 1, borderBottomColor: theme.colors.border },
  navTitle: { fontSize: 17, fontWeight: '700', color: theme.colors.text },
  content: { padding: 20 },
  helperText: { fontSize: 14, color: theme.colors.textSecondary, marginBottom: 16, lineHeight: 20 },
  searchRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  input: { flex: 1, backgroundColor: theme.colors.card, borderWidth: 1, borderColor: theme.colors.border, borderRadius: 12, padding: 14, fontSize: 16, fontWeight: '600', color: theme.colors.text, letterSpacing: 1 },
  searchBtn: { backgroundColor: COLORS.primary, width: 52, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  resultCard: { backgroundColor: theme.colors.card, borderRadius: 18, padding: 20, elevation: 3 },
  ticketRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  ticketId: { fontSize: 16, fontWeight: '800', color: COLORS.primary, letterSpacing: 1 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
  statusText: { fontSize: 12, fontWeight: '700' },
  title: { fontSize: 17, fontWeight: '700', color: theme.colors.text, marginBottom: 10 },
  meta: { fontSize: 13, color: theme.colors.textSecondary, marginBottom: 4, lineHeight: 20 },
  stepsRow: { flexDirection: 'row', alignItems: 'center', marginTop: 20, marginBottom: 16 },
  step: { alignItems: 'center', flex: 1 },
  stepDot: { width: 26, height: 26, borderRadius: 13, backgroundColor: theme.colors.border, justifyContent: 'center', alignItems: 'center', marginBottom: 4 },
  stepLabel: { fontSize: 9, color: theme.colors.textSecondary, textAlign: 'center' },
  stepLine: { height: 2, flex: 1, marginBottom: 16 },
  viewFullBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, paddingTop: 12, borderTopWidth: 1, borderTopColor: theme.colors.border, marginTop: 4 },
  viewFullText: { color: COLORS.primary, fontSize: 14, fontWeight: '600' },
});
