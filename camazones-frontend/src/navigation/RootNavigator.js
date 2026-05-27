import React from 'react';
import { useSelector } from 'react-redux';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// ── Screens ──────────────────────────────────────────────────────────────────
import HomeScreen           from '../screens/home/HomeScreen';
import ProductsScreen       from '../screens/products/ProductsScreen';
import ProductDetailScreen  from '../screens/products/ProductDetailScreen';
import PublishProductScreen from '../screens/products/PublishProductScreen';
import SellerScreen         from '../screens/seller/SellerScreen';
import WalletScreen         from '../screens/wallet/WalletScreen';
import AuthScreen           from '../screens/auth/AuthScreen';

const Stack = createNativeStackNavigator();
const Tab   = createBottomTabNavigator();

// ── Options d'en-tête communes ────────────────────────────────────────────────
const HEADER_OPTS = {
  headerStyle:      { backgroundColor: '#FF6B35' },
  headerTintColor:  '#fff',
  headerTitleStyle: { fontWeight: 'bold' },
};

// ─────────────────────────────────────────────────────────────────────────────
// Stacks individuels
// ─────────────────────────────────────────────────────────────────────────────

function HomeStackNavigator() {
  return (
    <Stack.Navigator screenOptions={HEADER_OPTS}>
      <Stack.Screen
        name="HomeMain"
        component={HomeScreen}
        options={{ title: 'Accueil' }}
      />
    </Stack.Navigator>
  );
}

/** Produits + Détail + Publication — accessibles depuis l'onglet Produits */
function ProductsStackNavigator() {
  return (
    <Stack.Navigator screenOptions={HEADER_OPTS}>
      <Stack.Screen
        name="ProductsList"
        component={ProductsScreen}
        options={{ title: 'Produits' }}
      />
      <Stack.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
        options={{ title: 'Détail du produit' }}
      />
      <Stack.Screen
        name="PublishProduct"
        component={PublishProductScreen}
        options={{ title: 'Publier un produit' }}
      />
    </Stack.Navigator>
  );
}

/** Ma Boutique — avec accès au formulaire de publication */
function SellerStackNavigator() {
  return (
    <Stack.Navigator screenOptions={HEADER_OPTS}>
      <Stack.Screen
        name="SellerMain"
        component={SellerScreen}
        options={{ title: 'Ma Boutique' }}
      />
      {/* Réutilise les mêmes écrans depuis l'onglet Boutique */}
      <Stack.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
        options={{ title: 'Détail du produit' }}
      />
      <Stack.Screen
        name="PublishProduct"
        component={PublishProductScreen}
        options={{ title: 'Publier un produit' }}
      />
    </Stack.Navigator>
  );
}

function WalletStackNavigator() {
  return (
    <Stack.Navigator screenOptions={HEADER_OPTS}>
      <Stack.Screen
        name="WalletMain"
        component={WalletScreen}
        options={{ title: 'Portefeuille' }}
      />
    </Stack.Navigator>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Bottom Tab Navigator
// ─────────────────────────────────────────────────────────────────────────────

function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor:   '#FF6B35',
        tabBarInactiveTintColor: '#7F8C8D',
        tabBarStyle: { borderTopWidth: 1, borderTopColor: '#f0f0f0' },
        tabBarIcon: ({ focused, color, size }) => {
          const icons = {
            Home:     focused ? 'home'          : 'home-outline',
            Products: focused ? 'shopping'      : 'shopping-outline',
            Seller:   focused ? 'store'         : 'store-outline',
            Wallet:   focused ? 'wallet'        : 'wallet-outline',
          };
          return <MaterialCommunityIcons name={icons[route.name]} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home"     component={HomeStackNavigator}     options={{ title: 'Accueil'       }} />
      <Tab.Screen name="Products" component={ProductsStackNavigator} options={{ title: 'Produits'      }} />
      <Tab.Screen name="Seller"   component={SellerStackNavigator}   options={{ title: 'Ma Boutique'   }} />
      <Tab.Screen name="Wallet"   component={WalletStackNavigator}   options={{ title: 'Portefeuille'  }} />
    </Tab.Navigator>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Root Navigator  (Auth guard)
// ─────────────────────────────────────────────────────────────────────────────

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
