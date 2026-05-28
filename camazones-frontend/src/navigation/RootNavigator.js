import React, { useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import HomeScreen from '../screens/home/HomeScreen';
import ProductsScreen from '../screens/products/ProductsScreen';
import SellerScreen from '../screens/seller/SellerScreen';
import MessagesScreen from '../screens/messages/MessagesScreen';
import WalletScreen from '../screens/wallet/WalletScreen';
import AuthScreen from '../screens/auth/AuthScreen';
import { Text } from '../components/ui';
import { darkPalette, overlay, palette, theme } from '../theme';

const tabs = [
  { name: 'Home', title: 'Boutiques', icon: 'B', component: HomeScreen },
  { name: 'Products', title: 'Recherche', icon: 'R', component: ProductsScreen },
  { name: 'Seller', title: 'Profil', icon: 'P', component: SellerScreen },
  { name: 'Messages', title: 'DM', icon: 'M', component: MessagesScreen },
  { name: 'Wallet', title: 'Paiement', icon: 'C', component: WalletScreen },
];

export default function RootNavigator() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const isBootstrapping = useSelector((state) => state.auth.isBootstrapping);
  const [activeTab, setActiveTab] = useState('Home');
  const [params, setParams] = useState({});
  const [darkMode, setDarkMode] = useState(false);

  const activeConfig = useMemo(() => tabs.find((tab) => tab.name === activeTab) ?? tabs[0], [activeTab]);
  const ActiveScreen = activeConfig.component;
  const activeTheme = darkMode ? darkPalette : palette;

  const navigation = useMemo(
    () => ({
      navigate: (name, routeParams = {}) => {
        setParams((current) => ({ ...current, [name]: routeParams }));
        setActiveTab(name);
      },
    }),
    []
  );

  const appSettings = useMemo(
    () => ({
      darkMode,
      setDarkMode,
      colors: activeTheme,
    }),
    [darkMode, activeTheme]
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
        {tabs.map((tab) => {
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
                  active && { backgroundColor: activeTheme.primary, borderColor: activeTheme.secondary },
                ]}
              >
                <Text style={[styles.tabIconText, { color: active ? activeTheme.background : activeTheme.primary }]}>
                  {tab.icon}
                </Text>
              </View>
              <Text style={[styles.tabText, { color: active ? activeTheme.primary : darkMode ? darkPalette.muted : overlay.muted }]}>
                {tab.title}
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
    minHeight: 94,
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingTop: 12,
    paddingBottom: 16,
    borderTopWidth: 1,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
  },
  tabIcon: {
    width: 38,
    height: 38,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  tabIconText: {
    fontSize: 15,
    fontWeight: '900',
  },
  tabText: {
    fontSize: 11,
    fontWeight: '900',
  },
});
