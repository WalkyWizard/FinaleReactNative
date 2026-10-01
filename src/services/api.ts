import { FetchImagesParams, PixabayImage, PixabayResponse } from '@/types/pixabay';

const BACKEND_API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.0.107:8000/api';
const PIXABAY_KEY = process.env.EXPO_PUBLIC_PIXABAY_KEY || '54971242-41a786a7388d43fae0f5b3e89';
const PIXABAY_DIRECT_URL = 'https://pixabay.com/api/';

async function fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs = 8000): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

export const ApiService = {
  async fetchImages({
    q = '',
    page = 1,
    per_page = 20,
    category,
  }: FetchImagesParams): Promise<PixabayResponse> {
    const queryParams = new URLSearchParams();
    if (q.trim()) queryParams.append('q', q.trim());
    queryParams.append('page', String(page));
    queryParams.append('per_page', String(Math.max(3, Math.min(per_page, 100))));
    if (category && category.trim()) queryParams.append('category', category.trim().toLowerCase());

    const backendUrl = `${BACKEND_API_URL}/images?${queryParams.toString()}`;

    try {
      const response = await fetchWithTimeout(backendUrl, {
        headers: { Accept: 'application/json' },
      });

      if (response.ok) {
        const data = await response.json();
        return {
          total: data.total || 0,
          totalHits: data.totalHits || 0,
          page,
          per_page,
          hits: data.hits || [],
        };
      }
    } catch {
      console.warn('Backend proxy unreachable, falling back to direct Pixabay API');
    }

    try {
      queryParams.append('key', PIXABAY_KEY);
      queryParams.append('image_type', 'photo');
      queryParams.append('safesearch', 'true');

      const directUrl = `${PIXABAY_DIRECT_URL}?${queryParams.toString()}`;
      const directResponse = await fetchWithTimeout(directUrl, {
        headers: {
          Accept: 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        },
      });

      if (!directResponse.ok) {
        if (directResponse.status === 400) {
          throw new Error('Некоректні параметри пошукового запиту.');
        }
        if (directResponse.status === 429) {
          throw new Error('Перевищено ліміт запитів до Pixabay API. Спробуйте пізніше.');
        }
        throw new Error(`Помилка Pixabay API (${directResponse.status}).`);
      }

      const directData = await directResponse.json();
      return {
        total: directData.total || 0,
        totalHits: directData.totalHits || 0,
        page,
        per_page,
        hits: directData.hits || [],
      };
    } catch (directError: any) {
      console.error('Failed to fetch from Pixabay direct API:', directError);
      throw new Error(
        directError.message || "Не вдалося отримати зображення. Перевірте з'єднання з інтернетом."
      );
    }
  },

  async fetchImageById(id: number | string): Promise<PixabayImage | null> {
    const backendUrl = `${BACKEND_API_URL}/images/${id}`;

    try {
      const response = await fetchWithTimeout(backendUrl, {
        headers: { Accept: 'application/json' },
      });

      if (response.ok) {
        return await response.json();
      }
    } catch {
    }

    try {
      const directUrl = `${PIXABAY_DIRECT_URL}?key=${PIXABAY_KEY}&id=${id}`;
      const response = await fetchWithTimeout(directUrl, {
        headers: {
          Accept: 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        },
      });

      if (!response.ok) {
        throw new Error(`Помилка отримання деталей зображення (${response.status})`);
      }

      const data = await response.json();
      const hits: PixabayImage[] = data.hits || [];
      return hits.length > 0 ? hits[0] : null;
    } catch (error: any) {
      console.error('Failed to fetch image details:', error);
      throw new Error(error.message || 'Не вдалося завантажити інформацію про зображення.');
    }
  },
};
