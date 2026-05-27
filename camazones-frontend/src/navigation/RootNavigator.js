import React from 'react';
import { useSelector } from 'react-redux';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { View, Text, StyleSheet } from 'react-native';

// ── Screens ───────────────────────────────────────────────────────────────────
import HomeScreen    from '../screens/home/HomeScreen';
import SellerScreen  from '../screens/seller/SellerScreen';
import WalletScreen  from '../screens/wallet/WalletScreen';
import AuthScreen    from '../screens/auth/AuthScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';

// ProductsScreen + detail seront ajoutés lors du merge avec feature/products-frontend
// Pour l'instant: placeholder
import { View as RNView } from 'react-native';
function ProductsPlaceholder() {
  return (
    <RNView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF8F0' }}>
      <Text style={{ fontSize: 40 }}>🛍️</Text>
      <Text style={{ fontSize: 16, color: '#2C3E50', marginTop: 8, fontWeight: '600' }}>Produits</Text>
      <Text style={{ fontSize: 13, color: '#7F8C8D', marginTop: 4 }}>Module en cours de fusion...</Text>
    </RNView>
  );
}

import { COLORS, SHADOW } from '../theme';

const Stack = createNativeStackNavigator();
const Tab   = createBottomTabNavigator();

// ── Options d'en-tête partagées ───────────────────────────────────────────────
const HEADER_OPTS = {
  headerStyle:      { backgroundColor: COLORS.primary },
  headerTintColor:  '#fff',
  headerTitleStyle: { fontWeight: 'bold', letterSpacing: 0.5 },
  headerShadowVisible: true,
};

// ── Stacks ────────────────────────────────────────────────────────────────────

function HomeStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeMain"   component={HomeScreen}    />
      <Stack.Screen name="Profile"    component={ProfileScreen}
        options={{ ...HEADER_OPTS, headerShown: true, title: 'Mon Profil' }}
      />
      {/* ProductDetail + PublishProduct disponibles après merge products-frontend */}
      <Stack.Screen name="ProductDetail"  component={ProductsPlaceholder}
        options={{ ...HEADER_OPTS, headerShown: true, title: 'Produit' }}
      />
    </Stack.Navigator>
  );
}

function ProductsStackNavigator() {
  return (
    <Stack.Navigator screenOptions={HEADER_OPTS}>
      <Stack.Screen name="ProductsList"   component={ProductsPlaceholder}  options={{ title: 'Produits' }} />
      <Stack.Screen name="ProductDetail"  component={ProductsPlaceholder}  options={{ title: 'Détail' }} />
      <Stack.Screen name="PublishProduct" component={ProductsPlaceholder}  options={{ title: 'Publier' }} />
    </Stack.Navigator>
  );
}

function SellerStackNavigator() {
  return (
    <Stack.Navigator screenOptions={HEADER_OPTS}>
      <Stack.Screen name="SellerMain"     component={SellerScreen}         options={{ title: 'Ma Boutique' }} />
      <Stack.Screen name="ProductDetail"  component={ProductsPlaceholder}  options={{ title: 'Produit' }} />
      <Stack.Screen name="PublishProduct" component={ProductsPlaceholder}  options={{ title: 'Publier un produit' }} />
    </Stack.Navigator>
  );
}

function WalletStackNavigator() {
  return (
    <Stack.Navigator screenOptions={HEADER_OPTS}>
      <Stack.Screen name="WalletMain" component={WalletScreen} options={{ title: 'Portefeuille' }} />
    </Stack.Navigator>
  );
}

// ── Tab Navigator ─────────────────────────────────────────────────────────────

const TAB_ICONS = {
  Home:     { active: 'home',     inactive: 'home-outline'     },
  Products: { active: 'shopping', inactive: 'shopping-outline' },
  Seller:   { active: 'store',    inactive: 'store-outline'    },
  Wallet:   { active: 'wallet',   inactive: 'wallet-outline'   },
};

function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor:   COLORS.primary,
        tabBarInactiveTintColor: '#7F8C8D',
        tabBarStyle: {
          borderTopWidth:  1,
          borderTopColor:  COLORS.border,
          backgroundColor: COLORS.surface,
          height: 60,
          paddingBottom: 8,
          paddingTop: 4,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        tabBarIcon: ({ focused, color, size }) => {
          const icons = TAB_ICONS[route.name];
          return (
            <MaterialCommunityIcons
              name={focused ? icons?.active : icons?.inactive}
              size={size}
              color={color}
            />
          );
        },
      })}
    >
      <Tab.Screen name="Home"     component={HomeStackNavigator}     options={{ title: 'Accueil'      }} />
      <Tab.Screen name="Products" component={ProductsStackNavigator} options={{ title: 'Produits'     }} />
      <Tab.Screen name="Seller"   component={SellerStackNavigator}   options={{ title: 'Ma Boutique'  }} />
      <Tab.Screen name="Wallet"   component={WalletStackNavigator}   options={{ title: 'Portefeuille' }} />
    </Tab.Navigator>
  );
}

// ── Root (Auth Guard) ─────────────────────────────────────────────────────────

export default function RootNavigator() {
  const isAuthenticated = useSelector((state) => state.auth.token !== null);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <Stack.Screen name="Main" component={MainTabNavigator} />
      ) : (
        <Stack.Screen name="Auth" component={AuthScreen} />
      )}
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({});
