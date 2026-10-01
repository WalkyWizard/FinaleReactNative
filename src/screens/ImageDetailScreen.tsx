import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Share,
} from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { Image } from 'expo-image';
import { PixabayImage } from '@/types/pixabay';
import { ApiService } from '@/services/api';
import { useFavorites } from '@/context/FavoritesContext';
import { useTheme } from '@/hooks/useTheme';
import { ImageStats } from '@/components/detail/ImageStats';
import { AuthorCard } from '@/components/detail/AuthorCard';
import { LoadingIndicator } from '@/components/common/LoadingIndicator';
import { ErrorMessage } from '@/components/common/ErrorMessage';

export default function ImageDetailScreen() {
  const { id, initialData } = useLocalSearchParams<{ id: string; initialData?: string }>();
  const theme = useTheme();
  const { isFavorite, toggleFavorite } = useFavorites();

  const [image, setImage] = useState<PixabayImage | null>(() => {
    if (initialData) {
      try {
        return JSON.parse(initialData) as PixabayImage;
      } catch {
        return null;
      }
    }
    return null;
  });

  const [isLoading, setIsLoading] = useState<boolean>(!image);
  const [error, setError] = useState<string | null>(null);

  const imageId = Number(id);
  const isFav = image ? isFavorite(image.id) : false;

  const handleRetry = useCallback(() => {
    setIsLoading(true);
    setError(null);
    ApiService.fetchImageById(imageId)
      .then((data) => {
        if (data) {
          setImage(data);
        } else {
          setError('Зображення не знайдено');
        }
      })
      .catch((err: any) => {
        setError(err.message || 'Не вдалося завантажити деталі зображення');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [imageId]);

  useEffect(() => {
    let isMounted = true;
    if (!image && id) {
      ApiService.fetchImageById(imageId)
        .then((data) => {
          if (isMounted) {
            if (data) {
              setImage(data);
            } else {
              setError('Зображення не знайдено');
            }
            setIsLoading(false);
          }
        })
        .catch((err: any) => {
          if (isMounted) {
            setError(err.message || 'Не вдалося завантажити деталі зображення');
            setIsLoading(false);
          }
        });
    }

    return () => {
      isMounted = false;
    };
  }, [id, image, imageId]);

  const handleShare = async () => {
    if (!image) return;
    try {
      await Share.share({
        message: `Перегляньте це фото від ${image.user} на Pixabay: ${image.pageURL || image.largeImageURL}`,
        url: image.largeImageURL,
      });
    } catch (err) {
      console.error('Error sharing image:', err);
    }
  };

  const handleToggleFavorite = () => {
    if (image) {
      toggleFavorite(image);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
        <Stack.Screen options={{ title: 'Завантаження...' }} />
        <LoadingIndicator message="Завантаження деталей зображення..." />
      </SafeAreaView>
    );
  }

  if (error || !image) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
        <Stack.Screen options={{ title: 'Помилка' }} />
        <ErrorMessage message={error || 'Зображення не знайдено'} onRetry={handleRetry} />
      </SafeAreaView>
    );
  }

  const tagsList = image.tags ? image.tags.split(',').map((t) => t.trim()) : [];
  const aspectRatio =
    image.imageWidth && image.imageHeight
      ? image.imageWidth / image.imageHeight
      : 16 / 9;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <Stack.Screen
        options={{
          title: `Фото від ${image.user}`,
          headerRight: () => (
            <TouchableOpacity onPress={handleShare} style={styles.headerBtn}>
              <Text style={styles.shareText}>Поділитися</Text>
            </TouchableOpacity>
          ),
        }}
      />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.imageWrapper, { aspectRatio: Math.max(0.75, Math.min(aspectRatio, 1.8)) }]}>
          <Image
            source={{ uri: image.largeImageURL || image.webformatURL }}
            style={styles.image}
            contentFit="cover"
            transition={300}
          />
        </View>

        <TouchableOpacity
          style={[
            styles.favButton,
            {
              backgroundColor: isFav ? '#FF3B30' : theme.backgroundElement,
              borderColor: isFav ? '#FF3B30' : theme.backgroundElement,
            },
          ]}
          onPress={handleToggleFavorite}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.favButtonText,
              { color: isFav ? '#FFFFFF' : theme.text },
            ]}
          >
            {isFav ? 'В обраному' : 'Додати до обраного'}
          </Text>
        </TouchableOpacity>

        <AuthorCard authorName={image.user} />

        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Статистика
        </Text>
        <ImageStats
          views={image.views}
          likes={image.likes}
          downloads={image.downloads}
          comments={image.comments}
        />

        {tagsList.length > 0 && (
          <View style={styles.tagsSection}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Теги
            </Text>
            <View style={styles.tagsContainer}>
              {tagsList.map((tag, idx) => (
                <View
                  key={idx}
                  style={[styles.tagBadge, { backgroundColor: theme.backgroundElement }]}
                >
                  <Text style={[styles.tagText, { color: theme.textSecondary }]}>
                    #{tag}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {image.imageWidth && image.imageHeight && (
          <View style={[styles.specsCard, { backgroundColor: theme.backgroundElement }]}>
            <Text style={[styles.specsText, { color: theme.textSecondary }]}>
              Роздільна здатність: {image.imageWidth} × {image.imageHeight} px
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  headerBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  shareText: {
    color: '#007AFF',
    fontSize: 15,
    fontWeight: '600',
  },
  imageWrapper: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#E1E4E8',
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  favButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 14,
    marginBottom: 12,
    borderWidth: 1,
  },
  favButtonText: {
    fontSize: 16,
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 8,
  },
  tagsSection: {
    marginTop: 8,
    marginBottom: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 13,
    fontWeight: '500',
  },
  specsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    marginTop: 16,
  },
  specsText: {
    fontSize: 13,
    fontWeight: '500',
  },
});
