import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Image,
  TextInput, ActivityIndicator, SafeAreaView, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { issueAPI } from '../services/api';
import { COLORS, CATEGORY_CONFIG, STATUS_CONFIG, PRIORITY_CONFIG } from '../utils/constants';

export default function IssueDetailScreen({ route, navigation }) {
  const { issueId } = route.params;
  const { theme } = useTheme();
  const { user } = useAuth();
  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [commenting, setCommenting] = useState(false);
  const [upvoting, setUpvoting] = useState(false);
  const s = styles(theme);

  useEffect(() => { fetchIssue(); }, [issueId]);

  const fetchIssue = async () => {
    try {
      const res = await issueAPI.getById(issueId);
      setIssue(res.data.issue);
    } catch {
      Alert.alert('Error', 'Failed to load issue');
    } finally {
      setLoading(false);
    }
  };

  const handleUpvote = async () => {
    if (!user) return Alert.alert('Login Required', 'Please login to upvote');
    setUpvoting(true);
    try {
      const res = await issueAPI.upvote(issueId);
      setIssue((i) => ({ ...i, upvoteCount: res.data.upvoteCount }));
    } catch {}
    setUpvoting(false);
  };

  const handleComment = async () => {
    if (!comment.trim()) return;
    if (!user) return Alert.alert('Login Required', 'Please login to comment');
    setCommenting(true);
    try {
      const res = await issueAPI.addComment(issueId, comment);
      setIssue((i) => ({ ...i, comments: res.data.comments }));
      setComment('');
    } catch {}
    setCommenting(false);
  };

  if (loading) return <View style={s.center}><ActivityIndicator size="large" color={COLORS.primary} /></View>;
  if (!issue) return <View style={s.center}><Text style={s.errorText}>Issue not found</Text></View>;

  const catCfg = CATEGORY_CONFIG[issue.category] || CATEGORY_CONFIG.other;
  const statusCfg = STATUS_CONFIG[issue.status] || STATUS_CONFIG.open;
  const priorityCfg = PRIORITY_CONFIG[issue.priority] || PRIORITY_CONFIG.medium;

  const STATUS_ORDER = ['open', 'assigned', 'in_progress', 'resolved'];

  return (
    <SafeAreaView style={s.container}>
      <View style={s.navBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={s.navTitle} numberOfLines={1}>{issue.ticketId}</Text>
        <TouchableOpacity onPress={fetchIssue}>
          <Ionicons name="refresh" size={22} color={theme.colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Images */}
        {issue.images?.length > 0 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, padding: 16 }}>
            {issue.images.map((img, i) => (
              <Image key={i} source={{ uri: img.url }} style={s.issueImage} />
            ))}
          </ScrollView>
        )}

        <View style={s.body}>
          {/* Header */}
          <View style={s.titleRow}>
            <View style={[s.catIcon, { backgroundColor: catCfg.bg }]}>
              <Ionicons name={catCfg.icon} size={22} color={catCfg.color} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.issueTitle}>{issue.title}</Text>
              <Text style={s.issueCat}>{catCfg.label}</Text>
            </View>
          </View>

          {/* Badges */}
          <View style={s.badgeRow}>
            <View style={[s.badge, { backgroundColor: statusCfg.bg }]}>
              <Ionicons name={statusCfg.icon} size={13} color={statusCfg.color} />
              <Text style={[s.badgeText, { color: statusCfg.color }]}>{statusCfg.label}</Text>
            </View>
            <View style={[s.badge, { backgroundColor: priorityCfg.bg }]}>
              <Text style={[s.badgeText, { color: priorityCfg.color }]}>{priorityCfg.label} Priority</Text>
            </View>
            <TouchableOpacity style={s.upvoteBtn} onPress={handleUpvote} disabled={upvoting}>
              <Ionicons name="arrow-up" size={14} color={COLORS.primary} />
              <Text style={s.upvoteText}>{issue.upvoteCount}</Text>
            </TouchableOpacity>
          </View>

          {/* Description */}
          <Text style={s.desc}>{issue.description}</Text>

          {/* Meta */}
          <View style={s.metaBox}>
            <View style={s.metaRow}>
              <Ionicons name="location-outline" size={15} color={theme.colors.textSecondary} />
              <Text style={s.metaText}>{issue.location?.address || 'No address provided'}</Text>
            </View>
            {issue.location?.ward && (
              <View style={s.metaRow}>
                <Ionicons name="map-outline" size={15} color={theme.colors.textSecondary} />
                <Text style={s.metaText}>{issue.location.ward}</Text>
              </View>
            )}
            <View style={s.metaRow}>
              <Ionicons name="person-outline" size={15} color={theme.colors.textSecondary} />
              <Text style={s.metaText}>Reported by {issue.reportedBy?.name}</Text>
            </View>
            <View style={s.metaRow}>
              <Ionicons name="time-outline" size={15} color={theme.colors.textSecondary} />
              <Text style={s.metaText}>{format(new Date(issue.createdAt), 'dd MMM yyyy, hh:mm a')}</Text>
            </View>
            {issue.department && (
              <View style={s.metaRow}>
                <Ionicons name="business-outline" size={15} color={theme.colors.textSecondary} />
                <Text style={s.metaText}>{issue.department.name}</Text>
              </View>
            )}
            {issue.assignedTo && (
              <View style={s.metaRow}>
                <Ionicons name="construct-outline" size={15} color={theme.colors.textSecondary} />
                <Text style={s.metaText}>Assigned to: {issue.assignedTo.name}</Text>
              </View>
            )}
          </View>

          {/* Status Timeline */}
          <Text style={s.sectionTitle}>Status Timeline</Text>
          <View style={s.timeline}>
            {STATUS_ORDER.map((st, i) => {
              const stepIndex = STATUS_ORDER.indexOf(issue.status);
              const isCompleted = i <= stepIndex;
              const isCurrent = i === stepIndex;
              const stCfg = STATUS_CONFIG[st];
              return (
                <View key={st} style={s.timelineStep}>
                  <View style={{ alignItems: 'center' }}>
                    <View style={[s.timelineDot, isCompleted ? { backgroundColor: COLORS.primary } : { backgroundColor: theme.colors.border }]}>
                      <Ionicons name={isCompleted ? 'checkmark' : 'ellipse-outline'} size={12} color={isCompleted ? '#fff' : theme.colors.textSecondary} />
                    </View>
                    {i < STATUS_ORDER.length - 1 && <View style={[s.timelineLine, { backgroundColor: isCompleted ? COLORS.primary : theme.colors.border }]} />}
                  </View>
                  <View style={s.timelineContent}>
                    <Text style={[s.timelineLabel, isCurrent && { color: COLORS.primary, fontWeight: '700' }]}>{stCfg?.label}</Text>
                    {isCurrent && issue.updatedAt && (
                      <Text style={s.timelineDate}>{format(new Date(issue.updatedAt), 'dd MMM yyyy')}</Text>
                    )}
                  </View>
                </View>
              );
            })}
          </View>

          {/* Comments */}
          <Text style={s.sectionTitle}>Updates & Comments ({issue.comments?.length || 0})</Text>
          {issue.comments?.map((c, i) => (
            <View key={i} style={[s.comment, c.isOfficialResponse && s.officialComment]}>
              {c.isOfficialResponse && (
                <View style={s.officialBadge}><Text style={s.officialBadgeText}>Official Response</Text></View>
              )}
              <Text style={s.commentAuthor}>{c.user?.name}</Text>
              <Text style={s.commentText}>{c.text}</Text>
              <Text style={s.commentDate}>{format(new Date(c.createdAt), 'dd MMM, hh:mm a')}</Text>
            </View>
          ))}

          {/* Add Comment */}
          {user && (
            <View style={s.commentBox}>
              <TextInput
                style={s.commentInput}
                placeholder="Add a comment..."
                placeholderTextColor={theme.colors.textSecondary}
                value={comment}
                onChangeText={setComment}
                multiline
              />
              <TouchableOpacity style={s.sendBtn} onPress={handleComment} disabled={commenting || !comment.trim()}>
                {commenting ? <ActivityIndicator size="small" color="#fff" /> : <Ionicons name="send" size={18} color="#fff" />}
              </TouchableOpacity>
            </View>
          )}
          <View style={{ height: 40 }} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = (theme) => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { color: theme.colors.text, fontSize: 16 },
  navBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: theme.colors.card, borderBottomWidth: 1, borderBottomColor: theme.colors.border },
  backBtn: { width: 40, height: 40, justifyContent: 'center' },
  navTitle: { flex: 1, textAlign: 'center', fontSize: 16, fontWeight: '700', color: theme.colors.text },
  issueImage: { width: 200, height: 140, borderRadius: 12 },
  body: { paddingHorizontal: 20, paddingBottom: 20 },
  titleRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 12 },
  catIcon: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  issueTitle: { fontSize: 18, fontWeight: '700', color: theme.colors.text, flex: 1 },
  issueCat: { fontSize: 13, color: theme.colors.textSecondary, marginTop: 2 },
  badgeRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap', marginBottom: 16 },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
  badgeText: { fontSize: 12, fontWeight: '600' },
  upvoteBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8, backgroundColor: '#E8F5E9', borderWidth: 1, borderColor: COLORS.accent },
  upvoteText: { color: COLORS.primary, fontSize: 13, fontWeight: '700' },
  desc: { fontSize: 15, color: theme.colors.text, lineHeight: 22, marginBottom: 16 },
  metaBox: { backgroundColor: theme.colors.card, borderRadius: 14, padding: 14, gap: 8, marginBottom: 20 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  metaText: { fontSize: 13, color: theme.colors.textSecondary, flex: 1 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: theme.colors.text, marginBottom: 12 },
  timeline: { marginBottom: 24, paddingLeft: 4 },
  timelineStep: { flexDirection: 'row', gap: 14, marginBottom: 4 },
  timelineDot: { width: 24, height: 24, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  timelineLine: { width: 2, height: 20, marginTop: 2, alignSelf: 'center' },
  timelineContent: { paddingBottom: 16, paddingTop: 4 },
  timelineLabel: { fontSize: 14, color: theme.colors.text },
  timelineDate: { fontSize: 12, color: theme.colors.textSecondary, marginTop: 2 },
  comment: { backgroundColor: theme.colors.card, borderRadius: 12, padding: 12, marginBottom: 8 },
  officialComment: { borderLeftWidth: 3, borderLeftColor: COLORS.primary },
  officialBadge: { backgroundColor: '#E8F5E9', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4, alignSelf: 'flex-start', marginBottom: 6 },
  officialBadgeText: { color: COLORS.primary, fontSize: 11, fontWeight: '700' },
  commentAuthor: { fontSize: 13, fontWeight: '700', color: theme.colors.text, marginBottom: 4 },
  commentText: { fontSize: 14, color: theme.colors.text, lineHeight: 20 },
  commentDate: { fontSize: 11, color: theme.colors.textSecondary, marginTop: 4 },
  commentBox: { flexDirection: 'row', gap: 8, marginTop: 16, alignItems: 'flex-end' },
  commentInput: { flex: 1, backgroundColor: theme.colors.card, borderWidth: 1, borderColor: theme.colors.border, borderRadius: 12, padding: 12, fontSize: 14, color: theme.colors.text, maxHeight: 100 },
  sendBtn: { width: 44, height: 44, backgroundColor: COLORS.primary, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
});
