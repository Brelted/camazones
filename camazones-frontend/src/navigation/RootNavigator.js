import React from 'react';
import { useSelector } from 'react-redux';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Screens placeholders
import HomeScreen from '../screens/home/HomeScreen';
import ProductsScreen from '../screens/products/ProductsScreen';
import SellerScreen from '../screens/seller/SellerScreen';
import WalletScreen from '../screens/wallet/WalletScreen';
import AuthScreen from '../screens/auth/AuthScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function HomeStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: '#FF6B35' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Stack.Screen name="HomeMain" component={HomeScreen} options={{ title: 'Accueil' }} />
    </Stack.Navigator>
  );
}

function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Products') {
            iconName = focused ? 'shopping' : 'shopping-outline';
          } else if (route.name === 'Seller') {
            iconName = focused ? 'store' : 'store-outline';
          } else if (route.name === 'Wallet') {
            iconName = focused ? 'wallet' : 'wallet-outline';
          }
          return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#FF6B35',
        tabBarInactiveTintColor: '#7F8C8D',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeStackNavigator} options={{ title: 'Accueil' }} />
      <Tab.Screen name="Products" component={ProductsScreen} options={{ title: 'Produits' }} />
      <Tab.Screen name="Seller" component={SellerScreen} options={{ title: 'Ma Boutique' }} />
      <Tab.Screen name="Wallet" component={WalletScreen} options={{ title: 'Portefeuille' }} />
    </Tab.Navigator>
  );
}

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
