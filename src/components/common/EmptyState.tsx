import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

interface EmptyStateProps {
  title?: string;
  description?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'Зображень не знайдено',
  description = 'Спробуйте змінити пошуковий запит або вибрати іншу категорію',
}) => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
      <Text style={[styles.description, { color: theme.textSecondary }]}>{description}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    marginTop: 60,
  },
  title: {
    fontSize: 19,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 280,
  },
});
