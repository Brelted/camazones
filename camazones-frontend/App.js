import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Provider as ReduxProvider, useDispatch, useSelector } from 'react-redux';
import store from './src/store';
import RootNavigator from './src/navigation/RootNavigator';
import { darkPalette, theme } from './src/theme';
import { authBootstrapComplete, restoreAuth } from './src/store/slices/authSlice';
import { restoreSettings } from './src/store/slices/settingsSlice';
import { restoreWallet } from './src/store/slices/walletSlice';

const BOOT_TIMEOUT_MS = 2500;

function Bootstrapper() {
  const dispatch = useDispatch();
  const darkMode = useSelector((state) => state.settings.darkMode);

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
    ]).finally(() => clearTimeout(bootTimer));

    return () => {
      alive = false;
      clearTimeout(bootTimer);
    };
  }, [dispatch]);

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
