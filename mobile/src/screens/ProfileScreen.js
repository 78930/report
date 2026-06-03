import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Alert, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { COLORS } from '../utils/constants';

export default function ProfileScreen({ navigation }) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme, themeMode } = useTheme();
  const { t, language, changeLanguage, languages } = useLanguage();
  const s = styles(theme);

  const handleLogout = () => {
    Alert.alert(t('profile_logout'), t('profile_logout_confirm'), [
      { text: t('profile_cancel'), style: 'cancel' },
      { text: t('profile_logout'), style: 'destructive', onPress: logout },
    ]);
  };

  if (!user) return (
    <SafeAreaView style={s.container}>
      <View style={s.center}>
        <Ionicons name="person-circle-outline" size={80} color={theme.colors.textSecondary} />
        <Text style={s.guestText}>{t('profile_not_logged_in')}</Text>
        <TouchableOpacity style={s.loginBtn} onPress={() => navigation.navigate('Auth')}>
          <Text style={s.loginBtnText}>{t('profile_login_signup')}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );

  const menuItems = [
    { icon: 'person-outline', label: t('profile_edit'), onPress: () => {} },
    { icon: 'notifications-outline', label: t('profile_notifications'), onPress: () => {} },
    { icon: 'shield-checkmark-outline', label: t('profile_privacy'), onPress: () => {} },
    { icon: 'help-circle-outline', label: t('profile_help'), onPress: () => {} },
    { icon: 'information-circle-outline', label: t('profile_about'), onPress: () => {} },
  ];

  return (
    <SafeAreaView style={s.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Avatar */}
        <View style={s.avatarSection}>
          <View style={s.avatar}>
            <Text style={s.avatarText}>{user.name?.charAt(0).toUpperCase()}</Text>
          </View>
          <Text style={s.name}>{user.name}</Text>
          <Text style={s.phone}>+91 {user.phone}</Text>
          {user.ward && <View style={s.wardBadge}><Ionicons name="map-outline" size={13} color={COLORS.accent} /><Text style={s.wardText}>{user.ward}</Text></View>}
        </View>

        {/* Stats */}
        <View style={s.statsRow}>
          {[
            { label: t('profile_issues_filed'), value: '12', icon: 'document-text' },
            { label: t('profile_resolved'), value: '8', icon: 'checkmark-circle' },
            { label: t('profile_upvotes'), value: '34', icon: 'arrow-up-circle' },
          ].map((stat) => (
            <View key={stat.label} style={s.statCard}>
              <Ionicons name={stat.icon} size={22} color={COLORS.primary} />
              <Text style={s.statValue}>{stat.value}</Text>
              <Text style={s.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Language Selector */}
        <View style={s.section}>
          <Text style={s.sectionLabel}>{t('profile_language')}</Text>
          <View style={s.langRow}>
            {languages.map((lang) => (
              <TouchableOpacity
                key={lang.code}
                style={[s.langBtn, language === lang.code && s.langBtnActive]}
                onPress={() => changeLanguage(lang.code)}
              >
                <Text style={[s.langBtnText, language === lang.code && s.langBtnTextActive]}>
                  {lang.nativeLabel}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Dark Mode Toggle + Menu */}
        <View style={s.section}>
          <TouchableOpacity style={s.menuItem} onPress={toggleTheme}>
            <Ionicons name={theme.isDark ? 'sunny-outline' : 'moon-outline'} size={22} color={theme.colors.text} />
            <Text style={s.menuLabel}>{theme.isDark ? t('profile_light_mode') : t('profile_dark_mode')}</Text>
            <Ionicons name="chevron-forward" size={18} color={theme.colors.textSecondary} />
          </TouchableOpacity>
          {menuItems.map((item) => (
            <TouchableOpacity key={item.label} style={s.menuItem} onPress={item.onPress}>
              <Ionicons name={item.icon} size={22} color={theme.colors.text} />
              <Text style={s.menuLabel}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={18} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={s.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color={COLORS.error} />
          <Text style={s.logoutText}>{t('profile_logout')}</Text>
        </TouchableOpacity>
        <Text style={s.version}>{t('profile_version')}</Text>
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = (theme) => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  guestText: { color: theme.colors.text, fontSize: 17, marginTop: 16, fontWeight: '600' },
  loginBtn: { marginTop: 20, backgroundColor: COLORS.primary, paddingHorizontal: 28, paddingVertical: 14, borderRadius: 14 },
  loginBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  avatarSection: { alignItems: 'center', paddingTop: 32, paddingBottom: 20 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  avatarText: { fontSize: 32, fontWeight: '800', color: '#fff' },
  name: { fontSize: 20, fontWeight: '700', color: theme.colors.text },
  phone: { fontSize: 14, color: theme.colors.textSecondary, marginTop: 4 },
  wardBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 8, backgroundColor: '#E8F5E9', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  wardText: { fontSize: 12, color: COLORS.accent, fontWeight: '600' },
  statsRow: { flexDirection: 'row', marginHorizontal: 20, marginBottom: 16, gap: 10 },
  statCard: { flex: 1, backgroundColor: theme.colors.card, borderRadius: 14, padding: 14, alignItems: 'center', gap: 4, elevation: 1 },
  statValue: { fontSize: 20, fontWeight: '800', color: theme.colors.text },
  statLabel: { fontSize: 11, color: theme.colors.textSecondary, textAlign: 'center' },
  section: { backgroundColor: theme.colors.card, marginHorizontal: 20, borderRadius: 16, marginBottom: 12, overflow: 'hidden' },
  sectionLabel: { fontSize: 13, fontWeight: '700', color: theme.colors.textSecondary, paddingHorizontal: 16, paddingTop: 14, paddingBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
  langRow: { flexDirection: 'row', gap: 8, paddingHorizontal: 16, paddingBottom: 14 },
  langBtn: { flex: 1, paddingVertical: 9, borderRadius: 10, borderWidth: 1.5, borderColor: theme.colors.border, alignItems: 'center', backgroundColor: theme.colors.background },
  langBtnActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  langBtnText: { fontSize: 13, fontWeight: '600', color: theme.colors.textSecondary },
  langBtnTextActive: { color: '#fff' },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, gap: 14, borderTopWidth: 1, borderTopColor: theme.colors.border },
  menuLabel: { flex: 1, fontSize: 15, color: theme.colors.text },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginHorizontal: 20, marginTop: 8, marginBottom: 4, padding: 14, borderRadius: 14, backgroundColor: theme.colors.card, borderWidth: 1, borderColor: COLORS.error + '30' },
  logoutText: { color: COLORS.error, fontSize: 15, fontWeight: '600' },
  version: { textAlign: 'center', color: theme.colors.textSecondary, fontSize: 12, marginTop: 8 },
});
