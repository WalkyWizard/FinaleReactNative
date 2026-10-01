import React from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useFavorites } from '@/context/FavoritesContext';
import { FavoriteCard } from '@/components/favorites/FavoriteCard';
import { EmptyState } from '@/components/common/EmptyState';
import { LoadingIndicator } from '@/components/common/LoadingIndicator';
import { useTheme } from '@/hooks/useTheme';
import { PixabayImage } from '@/types/pixabay';

export default function FavoritesScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { favorites, isLoading, removeFavorite } = useFavorites();

  const handleImagePress = (item: PixabayImage) => {
    router.push({
      pathname: '/image/[id]',
      params: {
        id: String(item.id),
        initialData: JSON.stringify(item),
      },
    });
  };

  const handleConfirmRemove = (item: PixabayImage) => {
    Alert.alert(
      'Видалення з обраного',
      'Ви впевнені, що хочете видалити це зображення зі списку обраного?',
      [
        { text: 'Скасувати', style: 'cancel' },
        {
          text: 'Видалити',
          style: 'destructive',
          onPress: () => removeFavorite(item.id),
        },
      ]
    );
  };

  const renderItem = ({ item }: { item: PixabayImage }) => (
    <FavoriteCard
      image={item}
      onPress={() => handleImagePress(item)}
      onRemove={() => handleConfirmRemove(item)}
    />
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <View style={styles.container}>
        {isLoading ? (
          <LoadingIndicator message="Завантаження збережених фото..." />
        ) : (
          <FlatList
            data={favorites}
            keyExtractor={(item) => String(item.id)}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <EmptyState
                title="Список обраного порожній"
                description="Натисніть на значок сердечка на будь-якому зображенні в галереї, щоб додати його сюди."
              />
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  listContent: {
    paddingVertical: 12,
    flexGrow: 1,
  },
});
