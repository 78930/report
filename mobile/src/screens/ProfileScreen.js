// ProfileScreen.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { COLORS } from '../utils/constants';

export default function ProfileScreen({ navigation }) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme, themeMode } = useTheme();
  const s = styles(theme);

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: logout },
    ]);
  };

  if (!user) return (
    <SafeAreaView style={s.container}>
      <View style={s.center}>
        <Ionicons name="person-circle-outline" size={80} color={theme.colors.textSecondary} />
        <Text style={s.guestText}>You're not logged in</Text>
        <TouchableOpacity style={s.loginBtn} onPress={() => navigation.navigate('Auth')}>
          <Text style={s.loginBtnText}>Login / Sign Up</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );

  const menuItems = [
    { icon: 'person-outline', label: 'Edit Profile', onPress: () => {} },
    { icon: 'notifications-outline', label: 'Notifications', onPress: () => {} },
    { icon: 'shield-checkmark-outline', label: 'Privacy & Security', onPress: () => {} },
    { icon: 'help-circle-outline', label: 'Help & Support', onPress: () => {} },
    { icon: 'information-circle-outline', label: 'About CivicReport', onPress: () => {} },
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
            { label: 'Issues Filed', value: '12', icon: 'document-text' },
            { label: 'Resolved', value: '8', icon: 'checkmark-circle' },
            { label: 'Upvotes Given', value: '34', icon: 'arrow-up-circle' },
          ].map((stat) => (
            <View key={stat.label} style={s.statCard}>
              <Ionicons name={stat.icon} size={22} color={COLORS.primary} />
              <Text style={s.statValue}>{stat.value}</Text>
              <Text style={s.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Dark Mode Toggle */}
        <View style={s.section}>
          <TouchableOpacity style={s.menuItem} onPress={toggleTheme}>
            <Ionicons name={theme.isDark ? 'sunny-outline' : 'moon-outline'} size={22} color={theme.colors.text} />
            <Text style={s.menuLabel}>{theme.isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}</Text>
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
          <Text style={s.logoutText}>Logout</Text>
        </TouchableOpacity>
        <Text style={s.version}>CivicReport v1.0.0</Text>
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
  loginBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  avatarSection: { alignItems: 'center', paddingVertical: 28 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  avatarText: { color: '#fff', fontSize: 32, fontWeight: '800' },
  name: { fontSize: 22, fontWeight: '800', color: theme.colors.text },
  phone: { fontSize: 14, color: theme.colors.textSecondary, marginTop: 4 },
  wardBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 8, backgroundColor: '#E8F5E9', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  wardText: { color: COLORS.accent, fontSize: 13, fontWeight: '600' },
  statsRow: { flexDirection: 'row', marginHorizontal: 20, gap: 10, marginBottom: 20 },
  statCard: { flex: 1, backgroundColor: theme.colors.card, borderRadius: 14, padding: 14, alignItems: 'center', gap: 4, elevation: 1 },
  statValue: { fontSize: 20, fontWeight: '800', color: theme.colors.text },
  statLabel: { fontSize: 11, color: theme.colors.textSecondary, textAlign: 'center' },
  section: { marginHorizontal: 20, backgroundColor: theme.colors.card, borderRadius: 16, overflow: 'hidden', marginBottom: 16 },
  menuItem: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16, borderBottomWidth: 1, borderBottomColor: theme.colors.border },
  menuLabel: { flex: 1, fontSize: 15, color: theme.colors.text },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginHorizontal: 20, backgroundColor: '#FEE2E2', borderRadius: 14, padding: 14 },
  logoutText: { color: COLORS.error, fontSize: 16, fontWeight: '700' },
  version: { textAlign: 'center', color: theme.colors.textSecondary, fontSize: 12, marginTop: 16 },
});
