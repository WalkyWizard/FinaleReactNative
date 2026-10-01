import React from 'react';
import { Tabs } from 'expo-router';
import { useColorScheme, Platform } from 'react-native';
import { Colors } from '@/constants/theme';
import { useFavorites } from '@/context/FavoritesContext';

export default function TabLayout() {
  const scheme = useColorScheme();
  const theme = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const { favoritesCount } = useFavorites();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: theme.textSecondary,
        tabBarIcon: () => null,
        tabBarIconStyle: { display: 'none', height: 0, width: 0 },
        tabBarLabelPosition: 'beside-icon',
        tabBarItemStyle: {
          justifyContent: 'center',
          alignItems: 'center',
          height: 52,
        },
        tabBarLabelStyle: {
          fontSize: 16,
          fontWeight: '700',
        },
        tabBarStyle: {
          backgroundColor: theme.background,
          borderTopColor: theme.backgroundElement,
          elevation: 4,
          shadowOpacity: 0.05,
          height: Platform.OS === 'ios' ? 70 : 54,
          paddingBottom: Platform.OS === 'ios' ? 16 : 0,
        },
        headerStyle: {
          backgroundColor: theme.background,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: theme.backgroundElement,
        },
        headerTitleStyle: {
          color: theme.text,
          fontWeight: '700',
          fontSize: 18,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Галерея',
          headerTitle: 'Pixabay Галерея',
          tabBarLabel: 'Галерея',
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: 'Обране',
          headerTitle: 'Моє обране',
          tabBarLabel: favoritesCount > 0 ? `Обране (${favoritesCount})` : 'Обране',
        }}
      />
    </Tabs>
  );
}
