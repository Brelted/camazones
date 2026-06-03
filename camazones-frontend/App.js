import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { Provider as ReduxProvider, useDispatch, useSelector } from 'react-redux';
import store from './src/store';
import RootNavigator from './src/navigation/RootNavigator';
import { darkPalette, theme } from './src/theme';
import { authBootstrapComplete, restoreAuth } from './src/store/slices/authSlice';
import { restoreSettings } from './src/store/slices/settingsSlice';
import { restoreWallet } from './src/store/slices/walletSlice';

const BOOT_TIMEOUT_MS = 900;
SplashScreen.preventAutoHideAsync().catch(() => {});

function Bootstrapper() {
  const dispatch = useDispatch();
  const darkMode = useSelector((state) => state.settings.darkMode);
  const isBootstrapping = useSelector((state) => state.auth.isBootstrapping);

  useEffect(() => {
    let alive = true;
    const bootTimer = setTimeout(() => {
      if (alive) {
        dispatch(authBootstrapComplete());
      }
    }, BOOT_TIMEOUT_MS);

    Promise.allSettled([
      dispatch(restoreSettings()),
      dispatch(restoreWallet()),
      dispatch(restoreAuth()),
    ]).finally(() => {
      clearTimeout(bootTimer);
      if (alive) {
        dispatch(authBootstrapComplete());
      }
    });

    return () => {
      alive = false;
      clearTimeout(bootTimer);
    };
  }, [dispatch]);

  useEffect(() => {
    if (!isBootstrapping) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [isBootstrapping]);

  return (
    <>
      <StatusBar style={darkMode ? 'light' : 'dark'} backgroundColor={darkMode ? darkPalette.background : theme.colors.background} />
      <RootNavigator />
    </>
  );
}

export default function App() {
  return (
    <ReduxProvider store={store}>
      <Bootstrapper />
    </ReduxProvider>
  );
}
