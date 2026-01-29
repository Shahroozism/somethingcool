import React, { useState, useRef, useEffect } from 'react';
import { Artist } from '../types/Artist';
import { useResponsive } from '../hooks/useResponsive';

// Fast reflection component with artist images
function ReflectionComponent({ 
  artist, 
  index, 
  currentIndex,
  getImage
}: {
  artist: Artist;
  index: number;
  currentIndex: number;
  getImage?: (artist: Artist) => string | null;
}) {
  const artistImage = getImage ? getImage(artist) : null;

  // Only show reflection if we have an image
  if (!artistImage) {
    return null;
  }

  return (
    <div 
      className="absolute top-full left-0 w-full h-full rounded-lg pointer-events-none select-none transition-all duration-500"
      style={{
        backgroundImage: `url(${artistImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        transform: 'scaleY(-1) translateY(0px)',
        opacity: index === currentIndex ? '0.9' : '0.75',
        maskImage: 'linear-gradient(to top, rgba(255,255,255,0.75) 0%, rgba(255,255,255,0.4) 20%, rgba(255,255,255,0.15) 40%, transparent 60%)',
        WebkitMaskImage: 'linear-gradient(to top, rgba(255,255,255,0.75) 0%, rgba(255,255,255,0.4) 20%, rgba(255,255,255,0.15) 40%, transparent 60%)',
        filter: 'blur(0.5px) brightness(0.6) contrast(1.3)'
      }}
    />
  );
}

interface CoverFlowProps {
  artists: Artist[];
  onArtistSelect: (artist: Artist) => void;
  selectedArtist: Artist | null;
  getImage?: (artist: Artist) => string | null;
  isLoading?: (artistId: string) => boolean;
}

export function CoverFlow({ 
  artists, 
  onArtistSelect, 
  selectedArtist, 
  getImage,
  isLoading
}: CoverFlowProps) {
  const [currentIndex, setCurrentIndex] = useState(() => Math.floor(artists.length / 2));
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [velocity, setVelocity] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const { isMobile, albumSize } = useResponsive();
  const lastDragTime = useRef(Date.now());
  const animationRef = useRef<number>();


  useEffect(() => {
    if (selectedArtist) {
      const index = artists.findIndex(artist => artist.id === selectedArtist.id);
      if (index !== -1) {
        setCurrentIndex(index);
      }
    }
  }, [selectedArtist, artists]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        const newIndex = Math.max(0, currentIndex - 1);
        setCurrentIndex(newIndex);
        onArtistSelect(artists[newIndex]);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        const newIndex = Math.min(artists.length - 1, currentIndex + 1);
        setCurrentIndex(newIndex);
        onArtistSelect(artists[newIndex]);
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onArtistSelect(artists[currentIndex]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, artists, onArtistSelect]);

  // Touch and mouse handlers for smooth dragging
  const handleDragStart = (clientX: number) => {
    setIsDragging(true);
    setDragStart(clientX);
    setDragOffset(0);
    setVelocity(0);
    lastDragTime.current = Date.now();
    
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  const handleDragMove = (clientX: number) => {
    if (!isDragging) return;
    
    const currentTime = Date.now();
    const deltaTime = currentTime - lastDragTime.current;
    const newOffset = clientX - dragStart;
    const deltaOffset = newOffset - dragOffset;
    
    setDragOffset(newOffset);
    setVelocity(deltaOffset / Math.max(deltaTime, 1));
    lastDragTime.current = currentTime;
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    
    // Improved momentum calculation for smoother interaction
    const threshold = 50; // Balanced threshold
    const velocityThreshold = 0.5; // Reasonable velocity trigger
    const highVelocityThreshold = 2.0; // For multi-item jumps
    
    let targetIndex = currentIndex;
    const dragDistance = Math.abs(dragOffset);
    const dragVelocity = Math.abs(velocity);
    
    if (dragDistance > threshold || dragVelocity > velocityThreshold) {
      // Smart jump calculation based on drag distance and velocity
      let jumpCount = 1;
      
      // High velocity allows multi-item jumps
      if (dragVelocity > highVelocityThreshold) {
        jumpCount = Math.min(2, Math.ceil(dragVelocity / 1.5)); // Max 2 items for control
      }
      
      // Large drag distance also allows jumps
      if (dragDistance > threshold * 2) {
        jumpCount = Math.max(jumpCount, Math.floor(dragDistance / (threshold * 1.5)));
      }
      
      if (dragOffset < 0 || velocity < -velocityThreshold) {
        // Dragging left/fast left velocity moves forward
        targetIndex = Math.min(artists.length - 1, currentIndex + jumpCount);
      } else if (dragOffset > 0 || velocity > velocityThreshold) {
        // Dragging right/fast right velocity moves backward
        targetIndex = Math.max(0, currentIndex - jumpCount);
      }
    }
    
    setCurrentIndex(targetIndex);
    onArtistSelect(artists[targetIndex]);
    setDragOffset(0);
    setVelocity(0);
  };

  // Mouse handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handleDragStart(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    e.preventDefault();
    handleDragMove(e.clientX);
  };

  const handleMouseUp = () => {
    handleDragEnd();
  };

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    handleDragStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    handleDragMove(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    handleDragEnd();
  };

  const handleArtistClick = (artist: Artist, index: number) => {
    if (!isDragging) {
      setCurrentIndex(index);
      onArtistSelect(artist);
    }
  };

  const getTransform = (index: number) => {
    const baseOffset = index - currentIndex;
    const offset = baseOffset + (isDragging ? dragOffset / 100 : 0);
    
    // Enhanced Apple CoverFlow algorithm - wider spacing for better clickability and more visible albums
    const SPACING = isMobile ? 120 : 160; // Increased spacing for better click targets and more visible cards
    const ROTATION = 55; // Slightly reduced rotation for better visibility
    
    if (Math.abs(offset) < 0.1) {
      // Center card - prominent focal point
      return `translateX(0px) translateZ(300px) rotateY(0deg) scale(1.3)`;
    } else if (offset < 0) {
      // Cards to the left (previous) - properly spaced with good visibility
      const distance = Math.abs(offset);
      const x = -SPACING * distance;
      const z = -80 * distance; // Better depth separation for distinct positioning
      const scale = Math.max(0.8, 1.15 - (distance * 0.04)); // Good size progression with better minimum
      return `translateX(${x}px) translateZ(${z}px) rotateY(${ROTATION}deg) scale(${scale})`;
    } else {
      // Cards to the right (next) - properly spaced with good visibility
      const distance = Math.abs(offset);
      const x = SPACING * distance;
      const z = -80 * distance; // Better depth separation for distinct positioning
      const scale = Math.max(0.8, 1.15 - (distance * 0.04)); // Good size progression with better minimum
      return `translateX(${x}px) translateZ(${z}px) rotateY(-${ROTATION}deg) scale(${scale})`;
    }
  };

  const getZIndex = (index: number) => {
    // Fixed z-index system - cards further from center should have LOWER z-index
    const MAX_ZINDEX = 1000; // Center card highest
    const offset = Math.abs(index - currentIndex);
    
    if (offset === 0) {
      return MAX_ZINDEX; // Center card highest priority
    } else if (offset === 1) {
      return 100; // Adjacent cards high priority
    } else if (offset === 2) {
      return 50; // Second level cards medium priority
    } else if (offset === 3) {
      return 25; // Third level cards lower priority
    } else if (offset === 4) {
      return 15; // Fourth level cards even lower
    } else {
      // Cards further away get progressively lower z-index (further = lower z-index)
      return Math.max(1, 10 - offset); // Minimum z-index of 1, decreasing with distance
    }
  };

  const getOpacity = (index: number) => {
    const baseOffset = index - currentIndex;
    const offset = Math.abs(baseOffset + (isDragging ? dragOffset / 100 : 0));
    
    // Simplified opacity system - much more solid cards
    if (offset < 0.1) return 1; // Center card fully opaque
    if (offset <= 1) return 1; // Adjacent cards fully visible
    if (offset <= 2) return 1; // Second level cards fully visible  
    if (offset <= 3) return 0.95; // Third level cards almost fully visible
    if (offset <= 4) return 0.9; // Fourth level cards very visible
    return Math.max(0.8, 0.9 - ((offset - 4) * 0.05)); // Far cards still quite visible
  };

  if (artists.length === 0) {
    return (
      <div className="text-center text-gray-400">
        No artists available
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto relative" style={{ zIndex: 300 }}>
      <div 
        ref={containerRef}
        className="relative h-96 flex items-center justify-center overflow-visible select-none"
        style={{ 
          perspective: '1500px', // Increased perspective for wider view
          perspectiveOrigin: 'center center',
          cursor: isDragging ? 'grabbing' : 'grab'
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {artists.map((artist, index) => (
          <div
            key={artist.id}
            className="absolute select-none"
            style={{
              transform: getTransform(index),
              zIndex: getZIndex(index) + 1000, // Boost all card z-indexes significantly
              opacity: getOpacity(index),
              transformOrigin: 'center center',
              transformStyle: 'preserve-3d',
              transition: isDragging ? 'none' : 'all 400ms cubic-bezier(0.23, 1, 0.32, 1)' // Smooth Apple-like easing
            }}
            onClick={() => handleArtistClick(artist, index)}
          >
            <div 
              className="relative group select-none"
              style={{
                width: `${albumSize}px`,
                height: `${albumSize}px`,
              }}
            >
              {/* Artist Image or placeholder */}
              {getImage && getImage(artist) ? (
                <img
                  src={getImage(artist)!}
                  alt={artist.name}
                  draggable={false}
                  className="w-full h-full object-cover rounded-lg shadow-2xl border border-gray-800/30 select-none"
                  style={{
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.9), 0 8px 32px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.1)',
                    userSelect: 'none'
                  }}
                />
              ) : (
                <div 
                  className="w-full h-full rounded-lg shadow-2xl border border-gray-800/30 select-none flex items-center justify-center bg-gradient-to-br from-gray-950 to-black"
                  style={{
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.9), 0 8px 32px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.05)',
                    userSelect: 'none'
                  }}
                >
                  {isLoading && isLoading(artist.id) ? (
                    <div className="flex flex-col items-center gap-2 text-white/60">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-400"></div>
                      <span className="text-xs text-center px-2">Loading...</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-white/40">
                      <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                      </svg>
                      <span className="text-xs text-center px-2">{artist.name}</span>
                    </div>
                  )}
                </div>
              )}
              
              {/* Enhanced glass reflection effect */}
              <div 
                className="absolute inset-0 rounded-lg pointer-events-none"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 25%, transparent 50%, rgba(0,0,0,0.02) 75%, rgba(0,0,0,0.08) 100%)',
                }}
              />
              
              {/* Apple CoverFlow reflection - authentic gradient */}
              <ReflectionComponent 
                artist={artist}
                index={index}
                currentIndex={currentIndex}
                getImage={getImage}
              />
              
              {/* Floor highlight - subtle light reflection on the floor */}
              <div 
                className="absolute top-full left-0 w-full h-3 rounded-lg pointer-events-none select-none transition-opacity duration-1000"
                style={{
                  background: 'linear-gradient(to bottom, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.12) 40%, transparent 100%)',
                  transform: 'translateY(6px)',
                  opacity: index === currentIndex ? '0.6' : '0.35'
                }}
              />
              
              {/* Clean center card effects */}
              {index === currentIndex && (
                <>
                  {/* Subtle border for center card */}
                  <div className="absolute inset-0 rounded-lg border border-white/30 shadow-2xl"></div>
                  
                  {/* Simple indicator */}
                  <div className="absolute top-3 right-3 w-2.5 h-2.5 bg-white rounded-full opacity-90 shadow-lg animate-pulse"></div>
                  
                  {/* Light reflection on top edge */}
                  <div 
                    className="absolute top-0 left-1/4 right-1/4 h-1 bg-white/20 rounded-full blur-sm"
                  />
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}