import React, { useState } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  Text,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useGallery } from '@/hooks/useGallery';
import { SearchBar } from '@/components/common/SearchBar';
import { CategoryChips } from '@/components/common/CategoryChips';
import { LoadingIndicator } from '@/components/common/LoadingIndicator';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { EmptyState } from '@/components/common/EmptyState';
import { ImageCard } from '@/components/gallery/ImageCard';
import { useTheme } from '@/hooks/useTheme';
import { PixabayImage } from '@/types/pixabay';

export default function GalleryScreen() {
  const router = useRouter();
  const theme = useTheme();

  const [customKeywords, setCustomKeywords] = useState<string[]>(['Kyiv', 'Neon']);

  const {
    query,
    images,
    isInitialLoading,
    isLoadingMore,
    isRefreshing,
    error,
    search,
    refresh,
    loadMore,
    retry,
  } = useGallery('space');

  const handleSearchWithCustomTag = (newQuery: string) => {
    const trimmed = newQuery.trim();
    if (trimmed && !customKeywords.some((k) => k.toLowerCase() === trimmed.toLowerCase())) {
      setCustomKeywords((prev) => [trimmed, ...prev.slice(0, 7)]);
    }
    search(trimmed);
  };

  const handleSelectKeyword = (keyword: string) => {
    search(keyword);
  };

  const handleRemoveCustomKeyword = (keywordToRemove: string) => {
    setCustomKeywords((prev) =>
      prev.filter((k) => k.toLowerCase() !== keywordToRemove.toLowerCase())
    );
  };

  const handleImagePress = (item: PixabayImage) => {
    router.push({
      pathname: '/image/[id]',
      params: {
        id: String(item.id),
        initialData: JSON.stringify(item),
      },
    });
  };

  const renderItem = ({ item }: { item: PixabayImage }) => (
    <ImageCard image={item} onPress={() => handleImagePress(item)} />
  );

  const renderFooter = () => {
    if (!isLoadingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color="#007AFF" />
        <Text style={[styles.footerText, { color: theme.textSecondary }]}>
          Завантаження наступних фото...
        </Text>
      </View>
    );
  };

  const renderEmpty = () => {
    if (isInitialLoading) return null;
    if (error) {
      return <ErrorMessage message={error} onRetry={retry} />;
    }
    return (
      <EmptyState
        title="Зображень не знайдено"
        description={
          query
            ? `За запитом "${query}" нічого не знайдено. Спробуйте інше слово.`
            : 'Спробуйте вибрати іншу категорію або ввести запит для пошуку.'
        }
      />
    );
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <View style={styles.container}>
        <View style={styles.header}>
          <SearchBar
            value={query}
            onSearch={handleSearchWithCustomTag}
            isLoading={isInitialLoading && images.length > 0}
          />
          <CategoryChips
            activeKeyword={query}
            onSelectKeyword={handleSelectKeyword}
            customKeywords={customKeywords}
            onRemoveCustomKeyword={handleRemoveCustomKeyword}
          />
        </View>

        {isInitialLoading && images.length === 0 ? (
          <LoadingIndicator message="Отримання зображень з Pixabay..." />
        ) : error && images.length === 0 ? (
          <ErrorMessage message={error} onRetry={retry} />
        ) : (
          <FlatList
            data={images}
            keyExtractor={(item) => String(item.id)}
            renderItem={renderItem}
            numColumns={2}
            style={styles.flatList}
            columnWrapperStyle={styles.columnWrapper}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            onEndReached={loadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={renderFooter}
            ListEmptyComponent={renderEmpty}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={refresh}
                tintColor="#007AFF"
                colors={['#007AFF']}
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
  header: {
    flexShrink: 0,
    marginBottom: 4,
  },
  flatList: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 24,
    flexGrow: 1,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  footerText: {
    fontSize: 13,
    fontWeight: '500',
  },
});
