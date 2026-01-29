import React, { useState, useEffect } from 'react';
import { CoverFlow } from './components/CoverFlow';
import { SearchBar } from './components/SearchBar';
import { ArtistInfo } from './components/ArtistInfo';
import { GalleryBackgroundVideo } from './components/GalleryBackgroundVideo';
import { Artist } from './types/Artist';
import { artistService } from './services/artistService';
import { useArtistImages } from './hooks/useArtistImages';

export default function App() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  // Artist image loading - preloads images around the center position
  const {
    getImage,
    isLoading,
    loadedCount,
    totalArtists,
    loadingProgress
  } = useArtistImages({
    artists,
    centerIndex: currentIndex,
    preloadRadius: 4 // Load 4 artists around center for smooth scrolling
  });

  // Load artists from database
  const loadArtists = async (query: string = ''): Promise<Artist[]> => {
    // Minimal delay for smooth UX
    await new Promise(resolve => setTimeout(resolve, 50));
    
    if (!query.trim()) {
      // Return all featured artists
      return artistService.getFeaturedArtists();
    } else {
      // Search in database
      return artistService.searchArtists(query);
    }
  };

  const fetchArtists = async (query: string = '') => {
    setLoading(true);
    setError(null);
    setSearchQuery(query);
    
    try {
      const artistsData = await loadArtists(query);
      setArtists(artistsData);
      
      // Set random starting index each time
      const randomIndex = Math.floor(Math.random() * artistsData.length);
      setCurrentIndex(randomIndex);
      setSelectedArtist(artistsData[randomIndex]);
      
      setLoading(false);
    } catch (err) {
      setError('Failed to load artists');
      setArtists([]);
      setCurrentIndex(0);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArtists();
  }, []);

  const handleSearch = (query: string) => {
    fetchArtists(query);
  };

  const handleArtistSelect = (artist: Artist) => {
    setSelectedArtist(artist);
    
    // Update current index
    const index = artists.findIndex(a => a.id === artist.id);
    if (index !== -1) {
      setCurrentIndex(index);
    }
  };

  const totalArtistsCount = artistService.getTotalArtistCount();
  const displayText = searchQuery 
    ? `${artists.length} results for "${searchQuery}"`
    : `Featured ${totalArtistsCount} Artists`;

  return (
    <div 
      className="h-screen text-white overflow-hidden relative"
      style={{
        background: 'linear-gradient(to bottom, #000000 0%, #111111 100%)',
        zIndex: 1,
        position: 'relative',
        width: '100vw',
        height: '100vh',
        isolation: 'isolate'
      }}
    >
      {/* Background Video */}
      <GalleryBackgroundVideo />

      {/* Reflective floor */}
      <div 
        className="fixed bottom-0 left-0 right-0 h-1/2 pointer-events-none"
        style={{
          background: 'linear-gradient(to top, rgba(255,255,255,0.02) 0%, transparent 100%)',
          transform: 'perspective(1000px) rotateX(60deg)',
          transformOrigin: 'bottom',
          zIndex: 1
        }}
      />

      {/* Search Bar - always visible */}
      <div className="absolute top-4 left-0 right-0 z-[300] px-4">
        <SearchBar onSearch={handleSearch} />
      </div>

      {/* Main Content */}
      <div className="relative flex-1 flex flex-col items-center justify-center px-4 md:px-8" style={{ zIndex: 200, height: '100vh' }}>
        {loading ? (
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400"></div>
            <span className="text-gray-300">Loading artists...</span>
          </div>
        ) : error ? (
          <div className="text-center text-red-400">
            <p>{error}</p>
            <button 
              onClick={() => fetchArtists()}
              className="mt-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : artists.length === 0 ? (
          <div className="text-center text-gray-400">
            <p>No artists found for "{searchQuery}"</p>
            <button 
              onClick={() => fetchArtists()}
              className="mt-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
            >
              Show All Artists
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-8">
            <CoverFlow 
              artists={artists} 
              onArtistSelect={handleArtistSelect}
              selectedArtist={selectedArtist}
              getImage={getImage}
              isLoading={isLoading}
            />
            
            {selectedArtist && (
              <ArtistInfo artist={selectedArtist} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}