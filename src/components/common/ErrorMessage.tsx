import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  onRetry,
}) => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: theme.text }]}>Щось пішло не так</Text>
      <Text style={[styles.message, { color: theme.textSecondary }]}>{message}</Text>
      {onRetry ? (
        <TouchableOpacity
          style={styles.retryButton}
          onPress={onRetry}
          activeOpacity={0.8}
        >
          <Text style={styles.retryButtonText}>Спробувати знову</Text>
        </TouchableOpacity>
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
    marginTop: 40,
  },
  title: {
    fontSize: 19,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
    maxWidth: 280,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 20,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
});
