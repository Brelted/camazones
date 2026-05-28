import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Button, HelperText, Surface, Text, TextInput, useTheme } from '../../components/ui';
import { useDispatch, useSelector } from 'react-redux';
import BrandLogo from '../../components/BrandLogo';
import { Badge } from '../../components/MarketplaceCards';
import { accountTypes } from '../../data/marketplace';
import { overlay, palette } from '../../theme';
import { login, register } from '../../store/slices/authSlice';

export default function AuthScreen() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const authError = useSelector((state) => state.auth.error);
  const isLoading = useSelector((state) => state.auth.isLoading);
  const [mode, setMode] = useState('login');
  const [localError, setLocalError] = useState('');
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
  });
  const [registerForm, setRegisterForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    password: '',
    accountType: 'independent',
  });

  useEffect(() => {
    setLocalError('');
  }, [mode]);

  const validationError = localError || authError || '';
  const selectedAccountType = accountTypes.find((item) => item.id === registerForm.accountType);

  const updateLoginField = (field, value) => {
    setLoginForm((current) => ({ ...current, [field]: value }));
  };

  const updateRegisterField = (field, value) => {
    setRegisterForm((current) => ({ ...current, [field]: value }));
  };

  const validateEmail = (email) => /.+@.+\..+/.test(email);

  const handleLogin = async () => {
    if (!loginForm.email || !loginForm.password) {
      setLocalError('Email et mot de passe requis.');
      return;
    }

    if (!validateEmail(loginForm.email)) {
      setLocalError('Adresse email invalide.');
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
      setLocalError('Tous les champs sont requis.');
      return;
    }

    if (!validateEmail(registerForm.email)) {
      setLocalError('Adresse email invalide.');
      return;
    }

    if (registerForm.password.length < 6) {
      setLocalError('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }

    const credentials = {
      firstName: registerForm.firstName,
      lastName: registerForm.lastName,
      phone: registerForm.phone,
      email: registerForm.email,
      password: registerForm.password,
    };
    setLocalError('');
    try {
      await dispatch(register(credentials));
    } catch (error) {
      return;
    }
  };

  const primaryAction = mode === 'login' ? handleLogin : handleRegister;

  return (
    <View style={[styles.screen, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={styles.hero}>
            <BrandLogo caption="Boutiques, vendeurs et achats sécurisés" />
            <Text style={styles.heroTitle}>Entrez dans un marché plus élégant.</Text>
            <Text style={styles.heroSubtitle}>
              Connectez-vous pour découvrir les vitrines, parler aux vendeurs et finaliser vos achats.
            </Text>
          </View>

          <Surface style={styles.card} elevation={0}>
            <View style={styles.modeBar}>
              <Pressable
                onPress={() => setMode('login')}
                style={[styles.modeButton, mode === 'login' && styles.modeButtonActive]}
              >
                <Text style={[styles.modeLabel, mode === 'login' && styles.modeLabelActive]}>Connexion</Text>
              </Pressable>
              <Pressable
                onPress={() => setMode('register')}
                style={[styles.modeButton, mode === 'register' && styles.modeButtonActive]}
              >
                <Text style={[styles.modeLabel, mode === 'register' && styles.modeLabelActive]}>Inscription</Text>
              </Pressable>
            </View>

            <View style={styles.form}>
              {mode === 'register' ? (
                <>
                  <View style={styles.row}>
                    <TextInput
                      label="Prénom"
                      mode="outlined"
                      value={registerForm.firstName}
                      onChangeText={(value) => updateRegisterField('firstName', value)}
                      style={styles.halfInput}
                      outlineColor={overlay.line}
                      activeOutlineColor={palette.primary}
                    />
                    <TextInput
                      label="Nom"
                      mode="outlined"
                      value={registerForm.lastName}
                      onChangeText={(value) => updateRegisterField('lastName', value)}
                      style={styles.halfInput}
                      outlineColor={overlay.line}
                      activeOutlineColor={palette.primary}
                    />
                  </View>
                  <TextInput
                    label="Téléphone"
                    mode="outlined"
                    keyboardType="phone-pad"
                    value={registerForm.phone}
                    onChangeText={(value) => updateRegisterField('phone', value)}
                    style={styles.input}
                    outlineColor={overlay.line}
                    activeOutlineColor={palette.primary}
                  />
                  <View style={styles.accountTypes}>
                    {accountTypes.map((item) => (
                      <Pressable
                        key={item.id}
                        onPress={() => updateRegisterField('accountType', item.id)}
                        style={[
                          styles.accountType,
                          registerForm.accountType === item.id && styles.accountTypeActive,
                        ]}
                      >
                        <Text style={styles.accountTypeTitle}>{item.label}</Text>
                        <Text style={styles.accountTypeText}>{item.description}</Text>
                      </Pressable>
                    ))}
                  </View>
                  <View style={styles.selectedBadge}>
                    <Badge type={selectedAccountType?.id === 'professional' ? 'professional' : 'independent'} />
                  </View>
                </>
              ) : null}

              <TextInput
                label="Email"
                mode="outlined"
                keyboardType="email-address"
                autoCapitalize="none"
                value={mode === 'login' ? loginForm.email : registerForm.email}
                onChangeText={(value) =>
                  mode === 'login' ? updateLoginField('email', value) : updateRegisterField('email', value)
                }
                style={styles.input}
                outlineColor={overlay.line}
                activeOutlineColor={palette.primary}
              />
              <TextInput
                label="Mot de passe"
                mode="outlined"
                secureTextEntry
                value={mode === 'login' ? loginForm.password : registerForm.password}
                onChangeText={(value) =>
                  mode === 'login' ? updateLoginField('password', value) : updateRegisterField('password', value)
                }
                style={styles.input}
                outlineColor={overlay.line}
                activeOutlineColor={palette.primary}
              />

              <HelperText type="error" visible={Boolean(validationError)}>
                {validationError}
              </HelperText>

              <Button
                mode="contained"
                onPress={primaryAction}
                loading={isLoading}
                disabled={isLoading}
                contentStyle={styles.buttonContent}
                buttonColor={palette.primary}
                textColor={palette.background}
              >
                {mode === 'login' ? 'Se connecter' : 'Créer mon compte'}
              </Button>

              <Text style={styles.footerText}>
                {mode === 'login'
                  ? 'Votre session JWT est restaurée automatiquement au lancement.'
                  : 'Le type de profil sert à séparer client indépendant et boutique professionnelle.'}
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
    color: palette.text,
    fontSize: 34,
    lineHeight: 39,
    fontWeight: '900',
    letterSpacing: -1.2,
  },
  heroSubtitle: {
    color: overlay.muted,
    fontSize: 15,
    lineHeight: 22,
  },
  card: {
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: overlay.line,
    backgroundColor: overlay.surface,
  },
  modeBar: {
    flexDirection: 'row',
    borderRadius: 8,
    padding: 4,
    marginBottom: 18,
    backgroundColor: overlay.soft,
  },
  modeButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 11,
    borderRadius: 8,
  },
  modeButtonActive: {
    backgroundColor: palette.primary,
  },
  modeLabel: {
    color: overlay.muted,
    fontWeight: '800',
  },
  modeLabelActive: {
    color: palette.background,
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
    backgroundColor: palette.background,
  },
  input: {
    backgroundColor: palette.background,
  },
  accountTypes: {
    gap: 10,
  },
  accountType: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: overlay.line,
    backgroundColor: overlay.soft,
  },
  accountTypeActive: {
    borderColor: palette.secondary,
    backgroundColor: overlay.secondary,
  },
  accountTypeTitle: {
    color: palette.text,
    fontWeight: '900',
    marginBottom: 4,
  },
  accountTypeText: {
    color: overlay.muted,
    lineHeight: 18,
    fontSize: 12,
  },
  selectedBadge: {
    flexDirection: 'row',
  },
  buttonContent: {
    paddingVertical: 8,
  },
  footerText: {
    color: overlay.muted,
    textAlign: 'center',
    lineHeight: 19,
  },
});
