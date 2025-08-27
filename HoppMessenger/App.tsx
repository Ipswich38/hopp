/**
 * Hopp Messenger - Emergency Communication App
 * Built with React Native + TypeScript + Material 3 Design
 *
 * @format
 */

import React from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from './src/navigation/AppNavigator';
import { MD3LightTheme, MD3DarkTheme } from './src/theme/colors';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  const theme = {
    ...MD3LightTheme,
    colors: isDarkMode ? MD3DarkTheme : MD3LightTheme,
  };

  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <StatusBar 
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          backgroundColor={theme.colors.surface}
        />
        <AppNavigator />
      </PaperProvider>
    </SafeAreaProvider>
  );
}

export default App;
