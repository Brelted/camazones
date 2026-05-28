import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Provider as ReduxProvider, useDispatch } from 'react-redux';
import store from './src/store';
import RootNavigator from './src/navigation/RootNavigator';
import { theme } from './src/theme';
import { restoreAuth } from './src/store/slices/authSlice';

function Bootstrapper() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(restoreAuth());
  }, [dispatch]);

  return <RootNavigator />;
}

export default function App() {
  return (
    <ReduxProvider store={store}>
      <StatusBar style="dark" backgroundColor={theme.colors.background} />
      <Bootstrapper />
    </ReduxProvider>
  );
}
