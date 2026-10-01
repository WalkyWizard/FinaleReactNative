import React, { useEffect } from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';

import { FavoritesProvider } from '@/context/FavoritesContext';
import { Colors } from '@/constants/theme';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme === 'dark' ? 'dark' : 'light'];

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <FavoritesProvider>
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: theme.background,
            },
            headerTintColor: theme.text,
            headerTitleStyle: {
              fontWeight: '700',
            },
            contentStyle: {
              backgroundColor: theme.background,
            },
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="image/[id]"
            options={{
              title: 'Деталі зображення',
              headerBackTitle: 'Назад',
            }}
          />
        </Stack>
      </FavoritesProvider>
    </ThemeProvider>
  );
}
