import React, { useState, useEffect } from 'react';

interface GalleryBackgroundVideoProps {
  youtubeId?: string;
}

export function GalleryBackgroundVideo({ 
  youtubeId = 'uj2dmQruJXs' // Default: Sun timelapse video
}: GalleryBackgroundVideoProps) {
  const [hasError, setHasError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  // Reset error state when youtubeId changes
  useEffect(() => {
    setHasError(false);
    setRetryCount(0);
    setIsLoading(true);
  }, [youtubeId]);

  const handleIframeError = () => {
    setIsLoading(false);
    if (retryCount < 2) {
      setRetryCount(prev => prev + 1);
      // Reset error to trigger retry
      setTimeout(() => setHasError(false), 1000);
    } else {
      setHasError(true);
    }
  };

  const handleIframeLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  return (
    <>
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: -10,
          overflow: 'hidden',
          pointerEvents: 'none'
        }}
      >
        {/* Animated Sun Background */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'radial-gradient(ellipse at center, #ff6b35 0%, #f7931e 20%, #fdc830 40%, #f37335 60%, #000000 80%)',
            backgroundSize: '200% 200%',
            animation: 'sunPulse 8s ease-in-out infinite',
            opacity: 0.4
          }}
        />
        
        {/* Sun Core */}
        <div
          style={{
            position: 'absolute',
            top: '40%',
            left: '50%',
            width: '300px',
            height: '300px',
            transform: 'translate(-50%, -50%)',
            borderRadius: '50%',
            background: 'radial-gradient(circle, #fff9e6 0%, #ffeb99 30%, #ff9a00 70%, transparent 100%)',
            filter: 'blur(40px)',
            animation: 'sunGlow 4s ease-in-out infinite',
            opacity: 0.6
          }}
        />
        
        {/* Subtle overlay for better contrast */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.5) 100%)',
            pointerEvents: 'none'
          }}
        />
      </div>

      {/* CSS animations */}
      <style>{`
        @keyframes sunPulse {
          0%, 100% { 
            background-size: 200% 200%;
            background-position: 50% 50%;
          }
          50% { 
            background-size: 250% 250%;
            background-position: 50% 40%;
          }
        }
        
        @keyframes sunGlow {
          0%, 100% { 
            opacity: 0.6;
            transform: translate(-50%, -50%) scale(1);
          }
          50% { 
            opacity: 0.8;
            transform: translate(-50%, -50%) scale(1.1);
          }
        }
        
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </>
  );
}