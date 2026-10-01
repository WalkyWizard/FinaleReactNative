import AsyncStorage from '@react-native-async-storage/async-storage';
import { PixabayImage } from '@/types/pixabay';

const FAVORITES_STORAGE_KEY = '@pixabay_favorites_v1';

export const StorageService = {
  async getFavorites(): Promise<PixabayImage[]> {
    try {
      const jsonValue = await AsyncStorage.getItem(FAVORITES_STORAGE_KEY);
      if (!jsonValue) return [];
      const parsed = JSON.parse(jsonValue);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error('Failed to load favorites from AsyncStorage:', error);
      return [];
    }
  },

  async addFavorite(image: PixabayImage): Promise<PixabayImage[]> {
    try {
      const currentFavorites = await this.getFavorites();
      const exists = currentFavorites.some((item) => item.id === image.id);
      if (exists) {
        return currentFavorites;
      }
      const updated = [image, ...currentFavorites];
      await AsyncStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    } catch (error) {
      console.error('Failed to add favorite to AsyncStorage:', error);
      throw error;
    }
  },

  async removeFavorite(imageId: number): Promise<PixabayImage[]> {
    try {
      const currentFavorites = await this.getFavorites();
      const updated = currentFavorites.filter((item) => item.id !== imageId);
      await AsyncStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    } catch (error) {
      console.error('Failed to remove favorite from AsyncStorage:', error);
      throw error;
    }
  },

  async isFavorite(imageId: number): Promise<boolean> {
    try {
      const currentFavorites = await this.getFavorites();
      return currentFavorites.some((item) => item.id === imageId);
    } catch (error) {
      console.error('Failed to check favorite status in AsyncStorage:', error);
      return false;
    }
  },

  async clearFavorites(): Promise<void> {
    try {
      await AsyncStorage.removeItem(FAVORITES_STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear favorites:', error);
    }
  },
};
