import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as ReduxProvider } from 'react-redux';
import store from './src/store';
import RootNavigator from './src/navigation/RootNavigator';
import { theme } from './src/theme';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <ReduxProvider store={store}>
      <Provider theme={theme}>
        <NavigationContainer>
          <StatusBar barStyle="dark-content" />
          <RootNavigator />
        </NavigationContainer>
      </Provider>
    </ReduxProvider>
  );
}
