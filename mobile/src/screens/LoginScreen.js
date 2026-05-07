import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  SafeAreaView, KeyboardAvoidingView, Platform, ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { COLORS } from '../utils/constants';

export default function LoginScreen() {
  const { login } = useAuth();
  const { theme } = useTheme();
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDirectLogin = async () => {
    if (!/^[6-9]\d{9}$/.test(phone)) {
      Alert.alert('Invalid Number', 'Enter a valid 10-digit Indian mobile number.');
      return;
    }
    if (!name.trim()) {
      Alert.alert('Name Required', 'Please enter your full name');
      return;
    }
    setLoading(true);
    try {
      const res = await authAPI.login(phone, name.trim());
      await login(res.data.token, res.data.user);
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || String(err) || 'Unable to login';
      Alert.alert('Login Failed', msg);
    } finally {
      setLoading(false);
    }
  };

  const s = styles(theme);

  return (
    <SafeAreaView style={s.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={s.kav}>
        {/* Header */}
        <View style={s.header}>
          <View style={s.logoBox}>
            <Ionicons name="shield-checkmark" size={40} color={COLORS.white} />
          </View>
          <Text style={s.appName}>CivicReport</Text>
          <Text style={s.tagline}>Report. Track. Resolve.</Text>
        </View>

        <View style={s.card}>
          <Text style={s.stepTitle}>Sign in / Register</Text>
          <Text style={s.stepSub}>Enter your name and mobile number to continue</Text>
          <View style={s.phoneRow}>
            <View style={s.countryCode}>
              <Text style={s.countryText}>🇮🇳 +91</Text>
            </View>
            <TextInput
              style={s.phoneInput}
              placeholder="9876543210"
              placeholderTextColor={theme.colors.textSecondary}
              keyboardType="phone-pad"
              maxLength={10}
              value={phone}
              onChangeText={setPhone}
            />
          </View>
          <TextInput
            style={s.input}
            placeholder="Full Name"
            placeholderTextColor={theme.colors.textSecondary}
            value={name}
            onChangeText={setName}
          />
          <TouchableOpacity style={s.btn} onPress={handleDirectLogin} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={s.btnText}>Continue</Text>}
          </TouchableOpacity>
        </View>

        <Text style={s.terms}>By continuing, you agree to our Terms of Service and Privacy Policy</Text>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = (theme) => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  kav: { flex: 1, justifyContent: 'center', paddingHorizontal: 24 },
  header: { alignItems: 'center', marginBottom: 32 },
  logoBox: { width: 80, height: 80, borderRadius: 20, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center', marginBottom: 12, elevation: 8 },
  appName: { fontSize: 32, fontWeight: '800', color: COLORS.primary, letterSpacing: -1 },
  tagline: { fontSize: 14, color: theme.colors.textSecondary, marginTop: 4 },
  card: { backgroundColor: theme.colors.card, borderRadius: 20, padding: 24, elevation: 4, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } },
  stepTitle: { fontSize: 22, fontWeight: '700', color: theme.colors.text, marginBottom: 8 },
  stepSub: { fontSize: 14, color: theme.colors.textSecondary, marginBottom: 24, lineHeight: 20 },
  phoneRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  countryCode: { backgroundColor: theme.colors.inputBg, borderWidth: 1, borderColor: theme.colors.border, borderRadius: 12, paddingHorizontal: 12, justifyContent: 'center' },
  countryText: { fontSize: 15, color: theme.colors.text, fontWeight: '600' },
  phoneInput: { flex: 1, backgroundColor: theme.colors.inputBg, borderWidth: 1, borderColor: theme.colors.border, borderRadius: 12, padding: 14, fontSize: 18, letterSpacing: 2, color: theme.colors.text },
  input: { backgroundColor: theme.colors.inputBg, borderWidth: 1, borderColor: theme.colors.border, borderRadius: 12, padding: 14, fontSize: 16, color: theme.colors.text, marginBottom: 16 },
  btn: { backgroundColor: COLORS.primary, borderRadius: 14, padding: 16, alignItems: 'center', marginTop: 8 },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  otpRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  otpBox: { width: 46, height: 56, borderWidth: 2, borderColor: theme.colors.border, borderRadius: 12, textAlign: 'center', fontSize: 24, fontWeight: '700', color: theme.colors.text, backgroundColor: theme.colors.inputBg },
  otpFilled: { borderColor: COLORS.primary, backgroundColor: '#E8F5E9' },
  resendRow: { alignItems: 'center', marginBottom: 12 },
  timerText: { color: theme.colors.textSecondary, fontSize: 14 },
  resendText: { color: COLORS.accent, fontSize: 14, fontWeight: '600' },
  backLink: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 8 },
  backText: { color: COLORS.accent, fontSize: 14 },
  devOtp: { color: '#EF4444', fontSize: 13, fontWeight: '600', marginBottom: 12, textAlign: 'center' },
  terms: { textAlign: 'center', fontSize: 11, color: theme.colors.textSecondary, marginTop: 24, lineHeight: 16 },
});
