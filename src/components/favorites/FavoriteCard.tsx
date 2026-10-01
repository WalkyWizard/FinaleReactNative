import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { PixabayImage } from '@/types/pixabay';
import { useTheme } from '@/hooks/useTheme';

interface FavoriteCardProps {
  image: PixabayImage;
  onPress: () => void;
  onRemove: () => void;
}

export const FavoriteCard: React.FC<FavoriteCardProps> = ({
  image,
  onPress,
  onRemove,
}) => {
  const theme = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor: theme.backgroundElement,
          shadowColor: '#000',
        },
      ]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <Image
        source={{ uri: image.webformatURL || image.previewURL }}
        style={styles.thumbnail}
        contentFit="cover"
        transition={200}
      />
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text style={[styles.author, { color: theme.text }]} numberOfLines={1}>
            {image.user}
          </Text>
          <TouchableOpacity
            onPress={onRemove}
            style={styles.deleteButton}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={styles.deleteText}>Видалити</Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.tags, { color: theme.textSecondary }]} numberOfLines={1}>
          {image.tags}
        </Text>

        <View style={styles.statsRow}>
          <Text style={[styles.statText, { color: theme.textSecondary }]}>
            Лайки: {image.likes}
          </Text>
          <Text style={[styles.statText, { color: theme.textSecondary }]}>
            Перегляди: {image.views}
          </Text>
          <Text style={[styles.statText, { color: theme.textSecondary }]}>
            Завантаження: {image.downloads}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 12,
    marginHorizontal: 16,
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    height: 100,
  },
  thumbnail: {
    width: 100,
    height: '100%',
    backgroundColor: '#E1E4E8',
  },
  content: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  author: {
    fontSize: 15,
    fontWeight: '700',
    flex: 1,
    marginRight: 8,
  },
  deleteButton: {
    paddingVertical: 2,
    paddingHorizontal: 6,
  },
  deleteText: {
    color: '#FF3B30',
    fontSize: 13,
    fontWeight: '600',
  },
  tags: {
    fontSize: 12,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statText: {
    fontSize: 11,
    fontWeight: '500',
  },
});
