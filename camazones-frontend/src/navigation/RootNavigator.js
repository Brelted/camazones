import React, { useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import HomeScreen from '../screens/home/HomeScreen';
import ProductsScreen from '../screens/products/ProductsScreen';
import ShopsScreen from '../screens/shops/ShopsScreen';
import SellerScreen from '../screens/seller/SellerScreen';
import MessagesScreen from '../screens/messages/MessagesScreen';
import WalletScreen from '../screens/wallet/WalletScreen';
import AuthScreen from '../screens/auth/AuthScreen';
import AdminScreen from '../screens/admin/AdminScreen';
import GamesScreen from '../screens/games/GamesScreen';
import { Text } from '../components/ui';
import { darkPalette, overlay, palette, theme } from '../theme';
import { setDarkModePersisted, setLanguagePersisted } from '../store/slices/settingsSlice';
import { translate } from '../i18n';

const baseTabs = [
  { name: 'Home', labelKey: 'home', icon: 'H', component: HomeScreen },
  { name: 'Products', labelKey: 'search', icon: 'S', component: ProductsScreen },
  { name: 'Shops', labelKey: 'shops', icon: 'B', component: ShopsScreen },
  { name: 'Messages', labelKey: 'chat', icon: 'DM', component: MessagesScreen },
  { name: 'Games', labelKey: 'games', icon: 'G', component: GamesScreen },
  { name: 'Seller', labelKey: 'profile', icon: 'P', component: SellerScreen },
];

const adminTab = { name: 'Admin', labelKey: 'admin', icon: 'A', component: AdminScreen };

const hiddenScreens = {
  Wallet: WalletScreen,
};

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
  const activeConfig = useMemo(
    () => visibleTabs.find((tab) => tab.name === activeTab) ?? { name: activeTab, component: hiddenScreens[activeTab] ?? HomeScreen },
    [activeTab, visibleTabs]
  );
  const ActiveScreen = activeConfig.component;
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

  if (isBootstrapping) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (!isAuthenticated) {
    return <AuthScreen />;
  }

  return (
    <View style={[styles.shell, { backgroundColor: activeTheme.background }]}>
      <View style={styles.body}>
        <ActiveScreen navigation={navigation} route={{ params: params[activeTab] ?? {} }} appSettings={appSettings} />
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
          const active = activeTab === tab.name;

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
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabbar: {
    minHeight: 78,
    flexDirection: 'row',
    paddingHorizontal: 8,
    paddingTop: 8,
    paddingBottom: 10,
    borderTopWidth: 1,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
  tabIcon: {
    width: 34,
    height: 34,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  tabIconText: {
    fontSize: 15,
    lineHeight: 18,
    fontWeight: '900',
  },
  tabText: {
    fontSize: 10,
    fontWeight: '900',
  },
});
