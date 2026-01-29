import { Artist } from '../types/Artist';

// Service to get artist portrait images from the database
// Uses pre-defined image URLs from the artists database

interface ArtistImageCache {
  [artistId: string]: string | null;
}

class ArtistImageService {
  private cache: ArtistImageCache = {};
  private loadingSet = new Set<string>();

  // Get image URL for an artist - uses database imageUrl or returns null
  getImageUrl(artist: Artist): string | null {
    // If already in cache, return it
    if (this.cache[artist.id] !== undefined) {
      return this.cache[artist.id];
    }

    // If currently loading, return null
    if (this.loadingSet.has(artist.id)) {
      return null;
    }

    // Get image URL from artist data
    const imageUrl = artist.imageUrl || null;
    
    // Store in cache
    this.cache[artist.id] = imageUrl;

    return imageUrl;
  }

  // Preload an image
  async preloadImage(artist: Artist): Promise<boolean> {
    const url = this.getImageUrl(artist);
    if (!url) return false;

    // Mark as loading
    this.loadingSet.add(artist.id);

    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        this.loadingSet.delete(artist.id);
        resolve(true);
      };
      img.onerror = () => {
        // On error, mark as failed in cache
        this.cache[artist.id] = null;
        this.loadingSet.delete(artist.id);
        resolve(false);
      };
      img.src = url;
    });
  }

  // Clear cache for specific artist
  clearCache(artistId: string) {
    delete this.cache[artistId];
  }

  // Clear all cache
  clearAllCache() {
    this.cache = {};
    this.loadingSet.clear();
  }

  // Check if artist image is loaded
  isLoaded(artistId: string): boolean {
    return this.cache[artistId] !== undefined && this.cache[artistId] !== null;
  }

  // Check if artist image is currently loading
  isLoading(artistId: string): boolean {
    return this.loadingSet.has(artistId);
  }
}

export const artistImageService = new ArtistImageService();