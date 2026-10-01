import { useState, useEffect, useCallback, useRef } from 'react';
import { PixabayImage } from '@/types/pixabay';
import { ApiService } from '@/services/api';

const PER_PAGE = 20;

export function useGallery(initialQuery = 'space') {
  const [query, setQuery] = useState<string>(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [images, setImages] = useState<PixabayImage[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalHits, setTotalHits] = useState<number>(0);

  const [isInitialLoading, setIsInitialLoading] = useState<boolean>(true);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const isFetchingRef = useRef<boolean>(false);

  const hasMore = images.length < totalHits;

  const loadImages = useCallback(
    async (
      targetQuery: string,
      targetCategory: string,
      targetPage: number,
      append = false
    ) => {
      if (isFetchingRef.current) {
        setIsRefreshing(false);
        setIsLoadingMore(false);
        return;
      }
      isFetchingRef.current = true;

      if (!append) {
        setError(null);
      }

      try {
        const response = await ApiService.fetchImages({
          q: targetQuery,
          category: targetCategory,
          page: targetPage,
          per_page: PER_PAGE,
        });

        setTotalHits(response.totalHits);
        setPage(targetPage);

        setImages((prev) => {
          if (!append) {
            return response.hits;
          }
          const existingIds = new Set(prev.map((img) => img.id));
          const newHits = response.hits.filter((img) => !existingIds.has(img.id));
          return [...prev, ...newHits];
        });
      } catch (err: any) {
        setError(err.message || 'Не вдалося завантажити зображення');
      } finally {
        isFetchingRef.current = false;
        setIsInitialLoading(false);
        setIsLoadingMore(false);
        setIsRefreshing(false);
      }
    },
    []
  );

  useEffect(() => {
    let isMounted = true;
    ApiService.fetchImages({
      q: initialQuery,
      category: '',
      page: 1,
      per_page: PER_PAGE,
    })
      .then((response) => {
        if (isMounted) {
          setTotalHits(response.totalHits);
          setPage(1);
          setImages(response.hits);
          setIsInitialLoading(false);
        }
      })
      .catch((err: any) => {
        if (isMounted) {
          setError(err.message || 'Не вдалося завантажити зображення');
          setIsInitialLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [initialQuery]);

  const handleSearch = useCallback(
    (newQuery: string) => {
      const trimmed = newQuery.trim();
      setQuery(trimmed);
      setSelectedCategory('');
      setIsInitialLoading(true);
      setImages([]);
      loadImages(trimmed, '', 1, false);
    },
    [loadImages]
  );

  const handleSelectCategory = useCallback(
    (cat: string) => {
      const nextCategory = selectedCategory === cat ? '' : cat;
      setSelectedCategory(nextCategory);
      setIsInitialLoading(true);
      setImages([]);
      loadImages(query, nextCategory, 1, false);
    },
    [selectedCategory, query, loadImages]
  );

  const handleRefresh = useCallback(() => {
    if (isFetchingRef.current) {
      setIsRefreshing(false);
      return;
    }
    setIsRefreshing(true);
    loadImages(query, selectedCategory, 1, false);
  }, [query, selectedCategory, loadImages]);

  const handleLoadMore = useCallback(() => {
    if (isLoadingMore || isInitialLoading || isRefreshing || !hasMore || isFetchingRef.current) {
      return;
    }
    setIsLoadingMore(true);
    const nextPage = page + 1;
    loadImages(query, selectedCategory, nextPage, true);
  }, [isLoadingMore, isInitialLoading, isRefreshing, hasMore, page, query, selectedCategory, loadImages]);

  const handleRetry = useCallback(() => {
    setIsInitialLoading(true);
    loadImages(query, selectedCategory, 1, false);
  }, [query, selectedCategory, loadImages]);

  return {
    query,
    selectedCategory,
    images,
    page,
    totalHits,
    isInitialLoading,
    isLoadingMore,
    isRefreshing,
    error,
    hasMore,
    search: handleSearch,
    selectCategory: handleSelectCategory,
    refresh: handleRefresh,
    loadMore: handleLoadMore,
    retry: handleRetry,
  };
}
