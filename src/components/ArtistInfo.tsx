import React from 'react';
import { Artist } from '../types/Artist';
import { Palette } from 'lucide-react';

interface ArtistInfoProps {
  artist: Artist;
}

export function ArtistInfo({ artist }: ArtistInfoProps) {
  return (
    <div className="flex flex-col items-center gap-4 relative w-full px-4" style={{ zIndex: 250 }}>
      {/* Artist Details Card */}
      <div className="bg-black/20 backdrop-blur-md rounded-2xl p-4 sm:p-6 max-w-2xl w-full border border-white/10">
        {/* Artist Name */}
        <div className="flex items-center justify-center gap-2 mb-3">
          <Palette className="w-4 h-4 sm:w-5 sm:h-5 text-white/80" />
          <h2 className="text-xl sm:text-2xl font-light text-white drop-shadow-lg text-center">
            {artist.name}
          </h2>
        </div>

        {/* Medium & Style */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 mb-4 flex-wrap">
          <span className="px-2 sm:px-3 py-1 bg-white/10 rounded-full text-xs sm:text-sm text-gray-300 border border-white/20">
            {artist.medium}
          </span>
          {artist.style && (
            <span className="px-2 sm:px-3 py-1 bg-white/5 rounded-full text-xs sm:text-sm text-gray-400 border border-white/10">
              {artist.style}
            </span>
          )}
        </div>

        {/* Bio */}
        <p className="text-sm sm:text-base text-center font-light text-gray-300 leading-relaxed mb-4">
          {artist.bio}
        </p>

        {/* Additional Info */}
        <div className="flex items-center justify-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-400 flex-wrap">
          {artist.nationality && (
            <div className="flex items-center gap-1">
              <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
              <span>{artist.nationality}</span>
            </div>
          )}
          {artist.birthYear && (
            <div className="flex items-center gap-1">
              <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z"/>
              </svg>
              <span>Born {artist.birthYear}</span>
            </div>
          )}
        </div>

        {/* Website Link */}
        {artist.website && (
          <div className="mt-4 text-center">
            <a 
              href={artist.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-white/10 hover:bg-white/20 
                       rounded-full text-xs sm:text-sm text-white transition-all duration-200
                       border border-white/20 hover:border-white/30"
            >
              <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Visit Website
            </a>
          </div>
        )}
      </div>

      {/* Gallery Navigation Hint */}
      <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-500 font-light flex-wrap justify-center">
        <div className="flex items-center gap-1">
          <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
          </svg>
          <span className="hidden sm:inline">Use arrow keys</span>
          <span className="sm:hidden">Arrows</span>
          <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
          </svg>
        </div>
        <span>or drag to browse</span>
      </div>
    </div>
  );
}