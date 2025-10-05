'use client';

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Settings, Languages, Loader2 } from 'lucide-react';
import { useTranslation } from '@/contexts/TranslationContext';

export default function DynamicVideoPlayer({ artwork, className = '' }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [videoQuality, setVideoQuality] = useState('720p');
  const [error, setError] = useState(null);
  
  const videoRef = useRef(null);
  const { currentLang, tSync } = useTranslation();

  // Générer l'URL de la vidéo basée sur l'artwork et la langue
  const generateVideoUrl = (quality = '720p') => {
    if (!artwork?.id) return null;
    
    // URLs simulées pour différentes langues et qualités
    const baseUrl = `/videos/artworks/${artwork.id}`;
    return `${baseUrl}_${currentLang}_${quality}.mp4`;
  };

  // URLs de fallback pour les vidéos de démonstration
  const getFallbackVideoUrl = () => {
    const demoVideos = [
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4'
    ];
    
    // Utiliser l'ID de l'artwork pour sélectionner une vidéo de demo cohérente
    const index = artwork?.id ? parseInt(artwork.id.slice(-1)) % demoVideos.length : 0;
    return demoVideos[index] || demoVideos[0];
  };

  const videoUrl = generateVideoUrl(videoQuality) || getFallbackVideoUrl();

  useEffect(() => {
    if (videoRef.current) {
      const video = videoRef.current;
      
      const handleLoadedData = () => {
        setIsLoading(false);
        setDuration(video.duration);
        setError(null);
      };
      
      const handleTimeUpdate = () => {
        setCurrentTime(video.currentTime);
      };
      
      const handleError = () => {
        setError(tSync('Erreur de chargement de la vidéo'));
        setIsLoading(false);
      };

      video.addEventListener('loadeddata', handleLoadedData);
      video.addEventListener('timeupdate', handleTimeUpdate);
      video.addEventListener('error', handleError);
      
      // Charger la vidéo
      video.load();

      return () => {
        video.removeEventListener('loadeddata', handleLoadedData);
        video.removeEventListener('timeupdate', handleTimeUpdate);
        video.removeEventListener('error', handleError);
      };
    }
  }, [videoUrl, currentLang]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleSeek = (e) => {
    if (videoRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickPosition = (e.clientX - rect.left) / rect.width;
      const newTime = clickPosition * duration;
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const qualities = ['480p', '720p', '1080p'];
  const languages = [
    { code: 'fr', name: 'Français' },
    { code: 'en', name: 'English' },
    { code: 'wo', name: 'Wolof' }
  ];

  return (
    <div className={`bg-black rounded-xl overflow-hidden relative group ${className}`}>
      {/* Vidéo */}
      <div className="relative">
        <video
          ref={videoRef}
          className="w-full h-64 object-cover"
          poster={artwork?.imageUrl}
          preload="metadata"
          playsInline
        >
          <source src={videoUrl} type="video/mp4" />
          <track
            kind="captions"
            src={`/videos/subtitles/${artwork?.id}_${currentLang}.vtt`}
            srcLang={currentLang}
            label={tSync('Sous-titres')}
            default
          />
          {tSync('Votre navigateur ne supporte pas la lecture de vidéos.')}
        </video>

        {/* Overlay de chargement */}
        {isLoading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="text-center text-white">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
              <p className="text-sm">{tSync('Chargement de la vidéo...')}</p>
            </div>
          </div>
        )}

        {/* Overlay d'erreur */}
        {error && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
            <div className="text-center text-white">
              <div className="text-4xl mb-2">📹</div>
              <p className="text-sm">{error}</p>
              <p className="text-xs opacity-70 mt-1">
                {tSync('Vidéo de démonstration utilisée')}
              </p>
            </div>
          </div>
        )}

        {/* Contrôles vidéo */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
          {/* Barre de progression */}
          <div 
            className="w-full h-1 bg-white/30 rounded cursor-pointer mb-3"
            onClick={handleSeek}
          >
            <div 
              className="h-full bg-amber-500 rounded transition-all"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            />
          </div>

          {/* Contrôles */}
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
              <button
                onClick={togglePlay}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </button>
              
              <button
                onClick={toggleMute}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
              
              <div className="text-sm">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Sélecteur de langue */}
              <div className="relative">
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  <Languages className="w-5 h-5" />
                </button>
                
                {showSettings && (
                  <div className="absolute bottom-12 right-0 bg-black/90 border border-amber-500/50 rounded-lg p-3 min-w-40">
                    <div className="mb-3">
                      <h4 className="text-sm font-semibold mb-2">{tSync('Qualité')}</h4>
                      {qualities.map((quality) => (
                        <button
                          key={quality}
                          onClick={() => {
                            setVideoQuality(quality);
                            setShowSettings(false);
                          }}
                          className={`block w-full text-left px-2 py-1 text-sm rounded ${
                            videoQuality === quality ? 'bg-amber-600' : 'hover:bg-white/10'
                          }`}
                        >
                          {quality}
                        </button>
                      ))}
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-semibold mb-2">{tSync('Langue audio')}</h4>
                      <p className="text-xs opacity-70">
                        {tSync('Vidéo adaptée à votre langue actuelle')} ({currentLang.toUpperCase()})
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Informations sur la vidéo */}
      <div className="p-4 bg-white">
        <h3 className="font-bold text-gray-900 mb-2">
          {tSync('Présentation vidéo')} - {artwork?.title?.[currentLang] || 'Sans titre'}
        </h3>
        <p className="text-sm text-gray-600 mb-3">
          {tSync('Découvrez cette œuvre en détail avec notre guide expert, dans votre langue préférée.')}
        </p>
        
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{tSync('Langue')}: {currentLang.toUpperCase()}</span>
          <span>{tSync('Qualité')}: {videoQuality}</span>
          <span>{tSync('Durée')}: {formatTime(duration)}</span>
        </div>
      </div>
    </div>
  );
}