import React, { useState, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  SafeAreaView, KeyboardAvoidingView, Platform, ActivityIndicator,
  Animated, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { COLORS } from '../utils/constants';

export default function LoginScreen() {
  const { login } = useAuth();
  const { theme } = useTheme();
  const [step, setStep] = useState('phone'); // 'phone' | 'otp' | 'name'
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const [devOtp, setDevOtp] = useState('');
  const otpRefs = useRef([]);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const fadeIn = () => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }).start();
  };

  const startTimer = () => {
    setTimer(60);
    const interval = setInterval(() => {
      setTimer((t) => {
        if (t <= 1) { clearInterval(interval); return 0; }
        return t - 1;
      });
    }, 1000);
  };

  const handleSendOTP = async () => {
    if (!/^[6-9]\d{9}$/.test(phone)) {
      Alert.alert('Invalid Number', 'Enter a valid 10-digit Indian mobile number.');
      return;
    }
    setLoading(true);
    try {
      const res = await authAPI.sendOTP(phone);
      if (res.data.otp) setDevOtp(res.data.otp); // dev only
      setStep('otp');
      fadeAnim.setValue(0);
      fadeIn();
      startTimer();
    } catch (err) {
      Alert.alert('Error', err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleOTPChange = (val, idx) => {
    const newOtp = [...otp];
    newOtp[idx] = val;
    setOtp(newOtp);
    if (val && idx < 5) otpRefs.current[idx + 1]?.focus();
    if (!val && idx > 0) otpRefs.current[idx - 1]?.focus();

    // Auto-submit when all filled
    if (newOtp.every((d) => d) && val) {
      const otpString = newOtp.join('');
      handleVerifyOTP(otpString);
    }
  };

  const handleVerifyOTP = async (otpString) => {
    const otpVal = otpString || otp.join('');
    if (otpVal.length !== 6) {
      Alert.alert('Error', 'Enter all 6 digits of the OTP');
      return;
    }
    setLoading(true);
    try {
      const res = await authAPI.verifyOTP(phone, otpVal, name || undefined);
      if (res.data.requiresRegistration) {
        setStep('name');
        fadeAnim.setValue(0);
        fadeIn();
      } else {
        await login(res.data.token, res.data.user);
      }
    } catch (err) {
      Alert.alert('Invalid OTP', err.response?.data?.message || 'OTP verification failed');
      setOtp(['', '', '', '', '', '']);
      otpRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteRegistration = async () => {
    if (!name.trim()) {
      Alert.alert('Name Required', 'Please enter your full name');
      return;
    }
    setLoading(true);
    try {
      const res = await authAPI.completeRegistration({ phone, name });
      await login(res.data.token, res.data.user);
    } catch (err) {
      Alert.alert('Error', err.response?.data?.message || 'Registration failed');
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

        {/* Step: Phone */}
        {step === 'phone' && (
          <View style={s.card}>
            <Text style={s.stepTitle}>Enter Mobile Number</Text>
            <Text style={s.stepSub}>We'll send a 6-digit OTP to verify your number</Text>
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
            <TouchableOpacity style={s.btn} onPress={handleSendOTP} disabled={loading}>
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={s.btnText}>Send OTP</Text>}
            </TouchableOpacity>
          </View>
        )}

        {/* Step: OTP */}
        {step === 'otp' && (
          <Animated.View style={[s.card, { opacity: fadeAnim }]}>
            <Text style={s.stepTitle}>Verify OTP</Text>
            <Text style={s.stepSub}>Enter the 6-digit code sent to +91 {phone}</Text>
            {devOtp ? <Text style={s.devOtp}>DEV OTP: {devOtp}</Text> : null}
            <View style={s.otpRow}>
              {otp.map((digit, i) => (
                <TextInput
                  key={i}
                  ref={(r) => (otpRefs.current[i] = r)}
                  style={[s.otpBox, digit ? s.otpFilled : null]}
                  maxLength={1}
                  keyboardType="number-pad"
                  value={digit}
                  onChangeText={(v) => handleOTPChange(v, i)}
                  onKeyPress={({ nativeEvent }) => {
                    if (nativeEvent.key === 'Backspace' && !otp[i] && i > 0) {
                      otpRefs.current[i - 1]?.focus();
                    }
                  }}
                />
              ))}
            </View>
            {loading && <ActivityIndicator color={COLORS.primary} style={{ marginTop: 12 }} />}
            <View style={s.resendRow}>
              {timer > 0 ? (
                <Text style={s.timerText}>Resend OTP in {timer}s</Text>
              ) : (
                <TouchableOpacity onPress={handleSendOTP}>
                  <Text style={s.resendText}>Resend OTP</Text>
                </TouchableOpacity>
              )}
            </View>
            <TouchableOpacity style={s.backLink} onPress={() => { setStep('phone'); setOtp(['','','','','','']); }}>
              <Ionicons name="arrow-back" size={16} color={COLORS.accent} />
              <Text style={s.backText}>Change number</Text>
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* Step: Name (new user) */}
        {step === 'name' && (
          <Animated.View style={[s.card, { opacity: fadeAnim }]}>
            <Text style={s.stepTitle}>Complete Profile</Text>
            <Text style={s.stepSub}>Tell us your name to get started</Text>
            <TextInput
              style={s.input}
              placeholder="Full Name"
              placeholderTextColor={theme.colors.textSecondary}
              value={name}
              onChangeText={setName}
              autoFocus
            />
            <TouchableOpacity style={s.btn} onPress={handleCompleteRegistration} disabled={loading}>
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={s.btnText}>Create Account</Text>}
            </TouchableOpacity>
          </Animated.View>
        )}

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
