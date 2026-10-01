import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

interface LoadingIndicatorProps {
  message?: string;
}

export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  message = 'Завантаження зображень...',
}) => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#007AFF" />
      {message ? (
        <Text style={[styles.text, { color: theme.textSecondary }]}>{message}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  text: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: '500',
  },
});
