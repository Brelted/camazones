import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import BrandLogo from '../../components/BrandLogo';
import { Button, HelperText, Surface, Text, TextInput } from '../../components/ui';
import { translate } from '../../i18n';
import { login, register } from '../../store/slices/authSlice';
import { darkPalette, overlay, palette } from '../../theme';

const accountTypes = [
  {
    id: 'independent',
    icon: '👤',
  },
  {
    id: 'professional',
    icon: '🏪',
  },
];

export default function AuthScreen() {
  const dispatch = useDispatch();
  const authError = useSelector((state) => state.auth.error);
  const isLoading = useSelector((state) => state.auth.isLoading);
  const { darkMode, language } = useSelector((state) => state.settings);
  const [mode, setMode] = useState('login');
  const [localError, setLocalError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    password: '',
    accountType: 'independent',
  });

  const colors = darkMode ? darkPalette : palette;
  const muted = darkMode ? darkPalette.muted : overlay.muted;
  const line = darkMode ? darkPalette.line : overlay.line;
  const soft = darkMode ? palette.dark : overlay.soft;
  const surface = darkMode ? darkPalette.surface : overlay.surface;
  const t = (key) => translate(language, key);
  const validationError = localError || authError || '';
  const selectedAccountType = accountTypes.find((item) => item.id === registerForm.accountType);

  useEffect(() => {
    setLocalError('');
  }, [mode, language]);

  const updateLoginField = (field, value) => {
    setLoginForm((current) => ({ ...current, [field]: value }));
  };

  const updateRegisterField = (field, value) => {
    setRegisterForm((current) => ({ ...current, [field]: value }));
  };

  const validateEmail = (email) => /.+@.+\..+/.test(email);

  const handleLogin = async () => {
    if (!loginForm.email || !loginForm.password) {
      setLocalError(t('emailPasswordRequired'));
      return;
    }

    if (!validateEmail(loginForm.email)) {
      setLocalError(t('invalidEmail'));
      return;
    }

    setLocalError('');
    try {
      await dispatch(login(loginForm));
    } catch (error) {
      return;
    }
  };

  const handleRegister = async () => {
    if (
      !registerForm.firstName ||
      !registerForm.lastName ||
      !registerForm.phone ||
      !registerForm.email ||
      !registerForm.password
    ) {
      setLocalError(t('allFieldsRequired'));
      return;
    }

    if (!validateEmail(registerForm.email)) {
      setLocalError(t('invalidEmail'));
      return;
    }

    if (registerForm.password.length < 6) {
      setLocalError(t('passwordMin'));
      return;
    }

    setLocalError('');
    try {
      await dispatch(register({
        firstName: registerForm.firstName,
        lastName: registerForm.lastName,
        phone: registerForm.phone,
        email: registerForm.email,
        password: registerForm.password,
      }));
    } catch (error) {
      return;
    }
  };

  const primaryAction = mode === 'login' ? handleLogin : handleRegister;

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={styles.hero}>
            <BrandLogo caption={t('authLogoCaption')} colors={colors} muted={muted} />
            <Text style={[styles.heroTitle, { color: colors.text }]}>{t('authTitle')}</Text>
            <Text style={[styles.heroSubtitle, { color: muted }]}>{t('authSubtitle')}</Text>
          </View>

          <Surface style={[styles.card, { backgroundColor: surface, borderColor: line }]}>
            <View style={[styles.modeBar, { backgroundColor: soft }]}>
              <Pressable
                onPress={() => setMode('login')}
                style={[styles.modeButton, mode === 'login' && { backgroundColor: colors.primary }]}
              >
                <Text style={[styles.modeLabel, { color: muted }, mode === 'login' && { color: colors.background }]}>
                  {t('login')}
                </Text>
              </Pressable>
              <Pressable
                onPress={() => setMode('register')}
                style={[styles.modeButton, mode === 'register' && { backgroundColor: colors.primary }]}
              >
                <Text style={[styles.modeLabel, { color: muted }, mode === 'register' && { color: colors.background }]}>
                  {t('register')}
                </Text>
              </Pressable>
            </View>

            <View style={styles.form}>
              {mode === 'register' ? (
                <>
                  <View style={styles.row}>
                    <TextInput
                      label={t('firstName')}
                      value={registerForm.firstName}
                      onChangeText={(value) => updateRegisterField('firstName', value)}
                      style={styles.halfInput}
                    />
                    <TextInput
                      label={t('lastName')}
                      value={registerForm.lastName}
                      onChangeText={(value) => updateRegisterField('lastName', value)}
                      style={styles.halfInput}
                    />
                  </View>
                  <TextInput
                    label={t('phone')}
                    keyboardType="phone-pad"
                    value={registerForm.phone}
                    onChangeText={(value) => updateRegisterField('phone', value)}
                  />
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.accountTypes}
                    keyboardShouldPersistTaps="handled"
                  >
                    {accountTypes.map((item) => (
                      <Pressable
                        key={item.id}
                        onPress={() => updateRegisterField('accountType', item.id)}
                        style={[
                          styles.accountType,
                          { backgroundColor: soft, borderColor: line },
                          registerForm.accountType === item.id && {
                            backgroundColor: darkMode ? palette.darkSurface : overlay.secondary,
                            borderColor: colors.secondary,
                          },
                        ]}
                      >
                        <Text style={[styles.accountTypeTitle, { color: colors.text }]}>{t(`${item.id}AccountLabel`)}</Text>
                        <Text style={[styles.accountTypeText, { color: muted }]}>{t(`${item.id}AccountText`)}</Text>
                      </Pressable>
                    ))}
                  </ScrollView>
                  <View style={styles.selectedBadge}>
                    <View style={[styles.localBadge, { backgroundColor: soft, borderColor: line }]}>
                      <Text style={[styles.localBadgeText, { color: colors.primary }]}>
                        {selectedAccountType?.icon} {selectedAccountType?.id === 'professional' ? t('professionalAccountLabel') : t('independentAccountLabel')}
                      </Text>
                    </View>
                  </View>
                </>
              ) : null}

              <TextInput
                label={t('email')}
                keyboardType="email-address"
                autoCapitalize="none"
                value={mode === 'login' ? loginForm.email : registerForm.email}
                onChangeText={(value) =>
                  mode === 'login' ? updateLoginField('email', value) : updateRegisterField('email', value)
                }
              />
              <TextInput
                label={t('password')}
                secureTextEntry={!showPassword}
                value={mode === 'login' ? loginForm.password : registerForm.password}
                onChangeText={(value) =>
                  mode === 'login' ? updateLoginField('password', value) : updateRegisterField('password', value)
                }
              />
              <Pressable onPress={() => setShowPassword((value) => !value)} style={[styles.passwordToggle, { borderColor: line, backgroundColor: soft }]}>
                <Text style={[styles.passwordToggleText, { color: colors.primary }]}>
                  {showPassword ? `🙈 ${t('hidePassword')}` : `👁 ${t('showPassword')}`}
                </Text>
              </Pressable>

              <HelperText type="error" visible={Boolean(validationError)}>
                {validationError}
              </HelperText>

              <Button
                mode="contained"
                onPress={primaryAction}
                loading={isLoading}
                disabled={isLoading}
                contentStyle={styles.buttonContent}
                buttonColor={colors.primary}
                textColor={colors.background}
              >
                {mode === 'login' ? t('loginAction') : t('registerAction')}
              </Button>

              <Text style={[styles.footerText, { color: muted }]}>
                {mode === 'login' ? t('jwtRestored') : t('profileTypeInfo')}
              </Text>
            </View>
          </Surface>
        </KeyboardAvoidingView>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 32,
  },
  hero: {
    gap: 14,
    marginBottom: 22,
  },
  heroTitle: {
    fontSize: 34,
    lineHeight: 39,
    fontWeight: '900',
    letterSpacing: -1.2,
  },
  heroSubtitle: {
    fontSize: 15,
    lineHeight: 22,
  },
  card: {
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
  },
  modeBar: {
    flexDirection: 'row',
    borderRadius: 8,
    padding: 4,
    marginBottom: 18,
  },
  modeButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 11,
    borderRadius: 8,
  },
  modeLabel: {
    fontWeight: '800',
  },
  form: {
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  halfInput: {
    flex: 1,
  },
  accountTypes: {
    gap: 10,
    paddingRight: 4,
  },
  accountType: {
    width: 220,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  accountTypeTitle: {
    fontWeight: '900',
    marginBottom: 4,
  },
  accountTypeText: {
    lineHeight: 18,
    fontSize: 12,
  },
  selectedBadge: {
    flexDirection: 'row',
  },
  localBadge: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  localBadgeText: {
    fontSize: 11,
    fontWeight: '900',
  },
  passwordToggle: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  passwordToggleText: {
    fontSize: 12,
    fontWeight: '900',
  },
  buttonContent: {
    paddingVertical: 8,
  },
  footerText: {
    textAlign: 'center',
    lineHeight: 19,
  },
});
