import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

interface AuthorCardProps {
  authorName: string;
}

export const AuthorCard: React.FC<AuthorCardProps> = ({ authorName }) => {
  const theme = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: theme.backgroundElement }]}>
      <Text style={[styles.label, { color: theme.textSecondary }]}>
        Автор
      </Text>
      <Text style={[styles.authorName, { color: theme.text }]}>
        {authorName || 'Pixabay Creator'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 14,
    borderRadius: 14,
    marginVertical: 8,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 4,
  },
  authorName: {
    fontSize: 16,
    fontWeight: '700',
  },
});
