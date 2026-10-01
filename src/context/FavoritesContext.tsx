import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { PixabayImage } from '@/types/pixabay';
import { StorageService } from '@/services/storage';

interface FavoritesContextType {
  favorites: PixabayImage[];
  favoritesCount: number;
  isLoading: boolean;
  isFavorite: (id: number) => boolean;
  toggleFavorite: (image: PixabayImage) => Promise<boolean>;
  removeFavorite: (id: number) => Promise<void>;
  refreshFavorites: () => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<PixabayImage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    StorageService.getFavorites().then((items) => {
      if (isMounted) {
        setFavorites(items);
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const refreshFavorites = useCallback(async () => {
    try {
      setIsLoading(true);
      const items = await StorageService.getFavorites();
      setFavorites(items);
    } catch (error) {
      console.error('Failed to load favorites in context:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const favoriteIdsSet = useMemo(() => new Set(favorites.map((f) => f.id)), [favorites]);

  const isFavorite = useCallback(
    (id: number) => {
      return favoriteIdsSet.has(id);
    },
    [favoriteIdsSet]
  );

  const toggleFavorite = useCallback(
    async (image: PixabayImage): Promise<boolean> => {
      try {
        if (favoriteIdsSet.has(image.id)) {
          const updated = await StorageService.removeFavorite(image.id);
          setFavorites(updated);
          return false;
        } else {
          const updated = await StorageService.addFavorite(image);
          setFavorites(updated);
          return true;
        }
      } catch (error) {
        console.error('Failed to toggle favorite:', error);
        return favoriteIdsSet.has(image.id);
      }
    },
    [favoriteIdsSet]
  );

  const removeFavorite = useCallback(async (id: number) => {
    try {
      const updated = await StorageService.removeFavorite(id);
      setFavorites(updated);
    } catch (error) {
      console.error('Failed to remove favorite:', error);
    }
  }, []);

  const value = useMemo(
    () => ({
      favorites,
      favoritesCount: favorites.length,
      isLoading,
      isFavorite,
      toggleFavorite,
      removeFavorite,
      refreshFavorites,
    }),
    [favorites, isLoading, isFavorite, toggleFavorite, removeFavorite, refreshFavorites]
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
};

export const useFavorites = (): FavoritesContextType => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};
