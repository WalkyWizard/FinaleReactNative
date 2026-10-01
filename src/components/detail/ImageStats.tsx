import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

interface ImageStatsProps {
  views: number;
  likes: number;
  downloads: number;
  comments?: number;
}

export const ImageStats: React.FC<ImageStatsProps> = ({
  views,
  likes,
  downloads,
  comments = 0,
}) => {
  const theme = useTheme();

  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={[styles.statBox, { backgroundColor: theme.backgroundElement }]}>
          <Text style={[styles.statValue, { color: theme.text }]}>{formatNumber(views)}</Text>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Перегляди</Text>
        </View>
        <View style={[styles.statBox, { backgroundColor: theme.backgroundElement }]}>
          <Text style={[styles.statValue, { color: theme.text }]}>{formatNumber(likes)}</Text>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Лайки</Text>
        </View>
      </View>
      <View style={styles.row}>
        <View style={[styles.statBox, { backgroundColor: theme.backgroundElement }]}>
          <Text style={[styles.statValue, { color: theme.text }]}>{formatNumber(downloads)}</Text>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Завантаження</Text>
        </View>
        <View style={[styles.statBox, { backgroundColor: theme.backgroundElement }]}>
          <Text style={[styles.statValue, { color: theme.text }]}>{formatNumber(comments)}</Text>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Коментарі</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  statBox: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 18,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
});
