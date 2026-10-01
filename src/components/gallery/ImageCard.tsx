import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Image } from 'expo-image';
import { PixabayImage } from '@/types/pixabay';
import { useFavorites } from '@/context/FavoritesContext';
import { useTheme } from '@/hooks/useTheme';

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = (width - 16 * 3) / 2;

interface ImageCardProps {
  image: PixabayImage;
  onPress: () => void;
}

export const ImageCard: React.FC<ImageCardProps> = ({ image, onPress }) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const theme = useTheme();
  const favorite = isFavorite(image.id);

  const handleFavoritePress = (e: any) => {
    e.stopPropagation?.();
    toggleFavorite(image);
  };

  const formatNumber = (num: number) => {
    return num > 999 ? `${(num / 1000).toFixed(1)}k` : String(num);
  };

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
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: image.webformatURL || image.previewURL }}
          style={styles.image}
          contentFit="cover"
          transition={250}
        />
        <TouchableOpacity
          style={[
            styles.favoriteBadge,
            { backgroundColor: favorite ? '#FF3B30' : 'rgba(0, 0, 0, 0.65)' },
          ]}
          onPress={handleFavoritePress}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={styles.favoriteBadgeText}>
            {favorite ? 'В обраному' : '+ В обране'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={[styles.author, { color: theme.text }]} numberOfLines={1}>
          {image.user}
        </Text>
        <View style={styles.statsRow}>
          <Text style={[styles.statText, { color: theme.textSecondary }]}>
            Лайки: {formatNumber(image.likes)}
          </Text>
          <Text style={[styles.statText, { color: theme.textSecondary }]}>
            Перегляди: {formatNumber(image.views)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: COLUMN_WIDTH,
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 12,
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  imageContainer: {
    width: '100%',
    height: COLUMN_WIDTH * 1.1,
    position: 'relative',
    backgroundColor: '#E1E4E8',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  favoriteBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  footer: {
    padding: 10,
    gap: 4,
  },
  author: {
    fontSize: 13,
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  statText: {
    fontSize: 11,
    fontWeight: '500',
  },
});
