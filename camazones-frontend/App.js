import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Provider as ReduxProvider, useDispatch, useSelector } from 'react-redux';
import store from './src/store';
import RootNavigator from './src/navigation/RootNavigator';
import { darkPalette, theme } from './src/theme';
import { restoreAuth } from './src/store/slices/authSlice';
import { restoreSettings } from './src/store/slices/settingsSlice';
import { restoreWallet } from './src/store/slices/walletSlice';

function Bootstrapper() {
  const dispatch = useDispatch();
  const darkMode = useSelector((state) => state.settings.darkMode);

  useEffect(() => {
    dispatch(restoreAuth());
    dispatch(restoreSettings());
    dispatch(restoreWallet());
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
