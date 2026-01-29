import { useState, useEffect, useCallback, useRef } from 'react';
import { Artist } from '../types/Artist';
import { artistImageService } from '../services/artistImageService';

interface UseArtistImagesOptions {
  artists: Artist[];
  centerIndex: number;
  preloadRadius?: number;
}

interface UseArtistImagesResult {
  getImage: (artist: Artist) => string | null;
  isLoading: (artistId: string) => boolean;
  loadedCount: number;
  totalArtists: number;
  loadingProgress: number;
}

export function useArtistImages({
  artists,
  centerIndex,
  preloadRadius = 4
}: UseArtistImagesOptions): UseArtistImagesResult {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [loadingImages, setLoadingImages] = useState<Set<string>>(new Set());
  const loadingRef = useRef<Set<string>>(new Set());

  // Preload images around the center index
  useEffect(() => {
    const preloadArtists = async () => {
      if (artists.length === 0) return;

      const start = Math.max(0, centerIndex - preloadRadius);
      const end = Math.min(artists.length - 1, centerIndex + preloadRadius);
      
      const artistsToLoad = artists.slice(start, end + 1);
      const newLoadingSet = new Set<string>();

      for (const artist of artistsToLoad) {
        // Only add to loading if not already loaded or currently loading
        if (!loadedImages.has(artist.id) && !loadingRef.current.has(artist.id)) {
          newLoadingSet.add(artist.id);
          loadingRef.current.add(artist.id);
        }
      }

      if (newLoadingSet.size === 0) return;

      setLoadingImages(prev => new Set([...prev, ...newLoadingSet]));

      // Load images in parallel
      const loadPromises = artistsToLoad
        .filter(artist => newLoadingSet.has(artist.id))
        .map(async (artist) => {
          const success = await artistImageService.preloadImage(artist);
          return { artistId: artist.id, success };
        });

      const results = await Promise.all(loadPromises);

      // Update loaded and loading sets
      setLoadedImages(prev => {
        const newSet = new Set(prev);
        results.forEach(({ artistId, success }) => {
          if (success) {
            newSet.add(artistId);
          }
          loadingRef.current.delete(artistId);
        });
        return newSet;
      });

      setLoadingImages(prev => {
        const newSet = new Set(prev);
        results.forEach(({ artistId }) => {
          newSet.delete(artistId);
        });
        return newSet;
      });
    };

    preloadArtists();
  }, [artists, centerIndex, preloadRadius]); // Removed loadedImages and loadingImages from deps

  // Get image for an artist
  const getImage = useCallback((artist: Artist): string | null => {
    return artistImageService.getImageUrl(artist);
  }, []);

  // Check if artist image is loading
  const isLoading = useCallback((artistId: string): boolean => {
    return loadingImages.has(artistId) || artistImageService.isLoading(artistId);
  }, [loadingImages]);

  // Calculate loading progress
  const loadedCount = loadedImages.size;
  const totalArtists = artists.length;
  const loadingProgress = totalArtists > 0 ? (loadedCount / totalArtists) * 100 : 0;

  return {
    getImage,
    isLoading,
    loadedCount,
    totalArtists,
    loadingProgress
  };
}