import React, { useEffect, useMemo, useState } from 'react';
import * as Speech from 'expo-speech';
import { Pressable, StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import AuthScreen from '../screens/auth/AuthScreen';
import { LoadingDots, Text } from '../components/ui';
import SplashAnimation from '../components/SplashAnimation';
import { darkPalette, overlay, palette } from '../theme';
import { setDarkModePersisted, setLanguagePersisted } from '../store/slices/settingsSlice';
import { translate } from '../i18n';

const baseTabs = [
  { name: 'Home', labelKey: 'home', icon: '🏠' },
  { name: 'Products', labelKey: 'search', icon: '🔎' },
  { name: 'Shops', labelKey: 'shops', icon: '🏪' },
  { name: 'Messages', labelKey: 'chat', icon: '💬' },
  { name: 'Seller', labelKey: 'profile', icon: '👤' },
];

const adminTab = { name: 'Admin', labelKey: 'admin', icon: '🛡️' };
let welcomeSpokenOnHome = false;

const screenLoaders = {
  Home: () => require('../screens/home/HomeScreen').default,
  Products: () => require('../screens/products/ProductsScreen').default,
  Shops: () => require('../screens/shops/ShopsScreen').default,
  Messages: () => require('../screens/messages/MessagesScreen').default,
  Seller: () => require('../screens/seller/SellerScreen').default,
  Wallet: () => require('../screens/wallet/WalletScreen').default,
  Games: () => require('../screens/games/GamesScreen').default,
  Admin: () => require('../screens/admin/AdminScreen').default,
};

function ScreenLoader({ name, navigation, route, appSettings, backgroundColor, color }) {
  const [Screen, setScreen] = useState(null);

  useEffect(() => {
    let alive = true;
    setScreen(null);
    const timer = setTimeout(() => {
      const LoadedScreen = (screenLoaders[name] ?? screenLoaders.Home)();
      if (alive) {
        setScreen(() => LoadedScreen);
      }
    }, 0);

    return () => {
      alive = false;
      clearTimeout(timer);
    };
  }, [name]);

  if (!Screen) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor }]}>
        <LoadingDots color={color} label="Chargement" />
      </View>
    );
  }

  return <Screen navigation={navigation} route={route} appSettings={appSettings} />;
}

export default function RootNavigator() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const isBootstrapping = useSelector((state) => state.auth.isBootstrapping);
  const user = useSelector((state) => state.auth.user);
  const { darkMode, language } = useSelector((state) => state.settings);
  const [activeTab, setActiveTab] = useState('Home');
  const [params, setParams] = useState({});
  const activeTheme = darkMode ? darkPalette : palette;
  const visibleTabs = useMemo(() => (user?.role === 'ADMIN' ? [...baseTabs, adminTab] : baseTabs), [user?.role]);
  const activeName = useMemo(
    () => (visibleTabs.some((tab) => tab.name === activeTab) || screenLoaders[activeTab] ? activeTab : 'Home'),
    [activeTab, visibleTabs]
  );
  const t = useMemo(() => (key) => translate(language, key), [language]);

  const navigation = useMemo(
    () => ({
      navigate: (name, routeParams = {}) => {
        setParams((current) => ({ ...current, [name]: routeParams }));
        setActiveTab(name);
      },
      goBack: () => setActiveTab('Home'),
    }),
    []
  );

  const appSettings = useMemo(
    () => ({
      darkMode,
      setDarkMode: (value) => dispatch(setDarkModePersisted(value)),
      language,
      setLanguage: (value) => dispatch(setLanguagePersisted(value)),
      colors: activeTheme,
      t,
    }),
    [darkMode, language, activeTheme, dispatch, t]
  );

  useEffect(() => {
    if (!isAuthenticated || activeName !== 'Home' || welcomeSpokenOnHome) {
      return undefined;
    }

    welcomeSpokenOnHome = true;
    const timer = setTimeout(() => {
      Speech.speak(language === 'en' ? 'Welcome to Camazones' : 'Bienvenue sur Camazones', {
        language: language === 'en' ? 'en-US' : 'fr-FR',
        pitch: 1,
        rate: 0.92,
      });
    }, 550);

    return () => clearTimeout(timer);
  }, [activeName, isAuthenticated, language]);

  if (isBootstrapping) {
    return <SplashAnimation />;
  }

  if (!isAuthenticated) {
    return <AuthScreen />;
  }

  return (
    <View style={[styles.shell, { backgroundColor: activeTheme.background }]}>
      {activeName !== 'Home' ? (
        <Pressable
          onPress={navigation.goBack}
          style={[
            styles.backButton,
            {
              backgroundColor: darkMode ? darkPalette.surface : palette.card,
              borderColor: darkMode ? darkPalette.line : overlay.line,
            },
          ]}
        >
          <Text style={[styles.backButtonText, { color: activeTheme.primary }]}>← Retour</Text>
        </Pressable>
      ) : null}
      <View style={styles.body}>
        <ScreenLoader
          name={activeName}
          navigation={navigation}
          route={{ params: params[activeName] ?? {} }}
          appSettings={appSettings}
          backgroundColor={activeTheme.background}
          color={activeTheme.primary}
        />
      </View>
      <View
        style={[
          styles.tabbar,
          {
            backgroundColor: activeTheme.background,
            borderTopColor: darkMode ? darkPalette.line : overlay.line,
          },
        ]}
      >
        {visibleTabs.map((tab) => {
          const active = activeName === tab.name;

          return (
            <Pressable key={tab.name} onPress={() => setActiveTab(tab.name)} style={styles.tab}>
              <View
                style={[
                  styles.tabIcon,
                  {
                    borderColor: darkMode ? darkPalette.line : overlay.line,
                    backgroundColor: darkMode ? darkPalette.surface : overlay.soft,
                  },
                  active && { backgroundColor: activeTheme.primary, borderColor: activeTheme.primary },
                ]}
              >
                <Text style={[styles.tabIconText, { color: active ? activeTheme.background : activeTheme.primary }]}>
                  {tab.icon}
                </Text>
              </View>
              <Text style={[styles.tabText, { color: active ? activeTheme.primary : darkMode ? darkPalette.muted : overlay.muted }]}>
                {t(tab.labelKey)}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    flex: 1,
  },
  body: {
    flex: 1,
  },
  backButton: {
    position: 'absolute',
    zIndex: 20,
    top: 12,
    left: 14,
    paddingHorizontal: 13,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
  },
  backButtonText: {
    fontSize: 12,
    fontWeight: '900',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabbar: {
    minHeight: 90,
    flexDirection: 'row',
    paddingHorizontal: 8,
    paddingTop: 7,
    paddingBottom: 24,
    borderTopWidth: 1,
    shadowColor: '#1F1F1F',
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.09,
    shadowRadius: 18,
    elevation: 12,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
  tabIcon: {
    width: 41,
    height: 41,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  tabIconText: {
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '900',
  },
  tabText: {
    fontSize: 11,
    fontWeight: '900',
  },
});
