import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  SafeAreaView, KeyboardAvoidingView, Platform, ActivityIndicator,
  Alert, ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { COLORS } from '../utils/constants';

export default function LoginScreen() {
  const { login } = useAuth();
  const { theme } = useTheme();
  const { t, language, changeLanguage, languages } = useLanguage();
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDirectLogin = async () => {
    if (!/^[6-9]\d{9}$/.test(phone)) {
      Alert.alert(t('login_invalid_number'), t('login_invalid_number_msg'));
      return;
    }
    if (!name.trim()) {
      Alert.alert(t('login_name_required'), t('login_name_required_msg'));
      return;
    }
    setLoading(true);
    try {
      const res = await authAPI.login(phone, name.trim());
      await login(res.data.token, res.data.user);
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || String(err) || 'Unable to login';
      Alert.alert(t('login_failed'), msg);
    } finally {
      setLoading(false);
    }
  };

  const s = styles(theme);

  return (
    <SafeAreaView style={s.container}>
      {/* Language bar */}
      <View style={s.langBar}>
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

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={s.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Logo + Title */}
          <View style={s.header}>
            <View style={s.logoBox}>
              <Ionicons name="shield-checkmark" size={42} color={COLORS.white} />
            </View>
            <Text style={s.appName}>{t('app_name')}</Text>
            <Text style={s.tagline}>{t('app_tagline')}</Text>
          </View>

          {/* Form card */}
          <View style={s.card}>
            <Text style={s.cardTitle}>{t('login_title')}</Text>
            <Text style={s.cardSub}>{t('login_subtitle')}</Text>

            {/* Name field */}
            <View style={s.fieldGroup}>
              <View style={s.labelRow}>
                <Ionicons name="person-outline" size={15} color={COLORS.accent} />
                <Text style={s.fieldLabel}>{t('login_name_placeholder')}</Text>
              </View>
              <TextInput
                style={s.input}
                placeholder={t('login_name_placeholder')}
                placeholderTextColor={theme.colors.textSecondary}
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
                returnKeyType="next"
              />
            </View>

            {/* Phone field */}
            <View style={s.fieldGroup}>
              <View style={s.labelRow}>
                <Ionicons name="call-outline" size={15} color={COLORS.accent} />
                <Text style={s.fieldLabel}>Mobile Number</Text>
              </View>
              <View style={s.phoneRow}>
                <View style={s.countryBadge}>
                  <Text style={s.flag}>🇮🇳</Text>
                  <Text style={s.countryCode}>+91</Text>
                </View>
                <TextInput
                  style={s.phoneInput}
                  placeholder={t('login_phone_placeholder')}
                  placeholderTextColor={theme.colors.textSecondary}
                  keyboardType="phone-pad"
                  maxLength={10}
                  value={phone}
                  onChangeText={setPhone}
                  returnKeyType="done"
                  onSubmitEditing={handleDirectLogin}
                />
              </View>
            </View>

            {/* Continue button */}
            <TouchableOpacity
              style={[s.btn, loading && s.btnDisabled]}
              onPress={handleDirectLogin}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <View style={s.btnInner}>
                  <Text style={s.btnText}>{t('login_continue')}</Text>
                  <Ionicons name="arrow-forward" size={18} color="#fff" />
                </View>
              )}
            </TouchableOpacity>

            <Text style={s.terms}>{t('login_terms')}</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },

  /* Language bar */
  langBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    paddingTop: 14,
    paddingHorizontal: 24,
  },
  langBtn: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  langBtnActive: {
    backgroundColor: 'rgba(255,255,255,0.22)',
    borderColor: '#fff',
  },
  langBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.55)',
  },
  langBtnTextActive: {
    color: '#fff',
    fontWeight: '700',
  },

  /* Scroll */
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 24,
  },

  /* Header */
  header: {
    alignItems: 'center',
    marginBottom: 28,
  },
  logoBox: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  appName: {
    fontSize: 30,
    fontWeight: '800',
    color: COLORS.white,
    letterSpacing: 0.4,
  },
  tagline: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.65)',
    marginTop: 6,
  },

  /* Card */
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  cardTitle: {
    fontSize: 21,
    fontWeight: '800',
    color: theme.colors.text,
    marginBottom: 4,
  },
  cardSub: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginBottom: 24,
    lineHeight: 18,
  },

  /* Field group */
  fieldGroup: {
    marginBottom: 16,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 8,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.text,
  },

  /* Full-width input */
  input: {
    width: '100%',
    backgroundColor: theme.colors.background,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    borderRadius: 14,
    paddingVertical: 15,
    paddingHorizontal: 16,
    fontSize: 16,
    color: theme.colors.text,
  },

  /* Phone row */
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  countryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: theme.colors.background,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    borderRadius: 14,
    paddingVertical: 15,
    paddingHorizontal: 14,
  },
  flag: {
    fontSize: 18,
    lineHeight: 20,
  },
  countryCode: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.text,
  },
  phoneInput: {
    flex: 1,
    backgroundColor: theme.colors.background,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    borderRadius: 14,
    paddingVertical: 15,
    paddingHorizontal: 16,
    fontSize: 16,
    color: theme.colors.text,
    letterSpacing: 1,
  },

  /* Button */
  btn: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    paddingVertical: 17,
    alignItems: 'center',
    marginTop: 8,
  },
  btnDisabled: {
    opacity: 0.7,
  },
  btnInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  btnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },

  /* Terms */
  terms: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: 18,
    lineHeight: 17,
  },
});
