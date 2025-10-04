'use client';
import { useRef, useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Loader2 } from 'lucide-react';
import { useTranslation } from '@/contexts/TranslationContext';

export default function AudioPlayer({ artwork, currentLang, title }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioUrl, setAudioUrl] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState('');
  const [isWebSpeechMode, setIsWebSpeechMode] = useState(false);
  const [webSpeechProgress, setWebSpeechProgress] = useState(0);
  const [webSpeechDuration, setWebSpeechDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [currentUtterance, setCurrentUtterance] = useState(null);
  const { tSync } = useTranslation();

  // Vérifier si l'audio existe déjà pour la langue actuelle
  useEffect(() => {
    const existingUrl = artwork?.audioUrl?.[currentLang];
    // Ignorer les URLs statiques qui pointent vers /audio/ (fichiers qui n'existent pas)
    // et seulement accepter les URLs générées dynamiquement (blob: ou https:)
    if (existingUrl && (existingUrl.startsWith('blob:') || existingUrl.startsWith('https:'))) {
      setAudioUrl(existingUrl);
    } else {
      setAudioUrl(null);
    }
  }, [artwork, currentLang]);

  // Fallback: Générer audio avec Web Speech API (navigateur)
  const generateAudioWithWebSpeech = () => {
    return new Promise((resolve, reject) => {
      if (!window.speechSynthesis) {
        reject(new Error('Web Speech API non supportée'));
        return;
      }

      try {
        let description = artwork.description?.[currentLang] || artwork.description?.fr || '';
        if (!description) {
          reject(new Error('Pas de description disponible'));
          return;
        }

        // Calculer durée approximative basée sur le nombre de mots
        const wordCount = description.split(' ').length;
        const wordsPerSecond = 2.5; // Vitesse de lecture moyenne
        const estimatedDuration = Math.ceil(wordCount / wordsPerSecond);
        setWebSpeechDuration(estimatedDuration);

        const utterance = new SpeechSynthesisUtterance(description);
        
        // Configuration de la voix selon la langue
        const voices = speechSynthesis.getVoices();
        let voice = voices.find(v => v.lang.startsWith(currentLang === 'wo' ? 'fr' : currentLang));
        if (!voice) voice = voices.find(v => v.lang.startsWith('fr'));
        if (voice) utterance.voice = voice;
        
        utterance.rate = playbackRate * 0.8;
        utterance.pitch = 1.0;
        utterance.volume = volume;

        let progressInterval;

        utterance.onstart = () => {
          setIsPlaying(true);
          setIsWebSpeechMode(true);
          setWebSpeechProgress(0);
          setIsPaused(false);

          // Simuler le progrès basé sur la durée estimée
          progressInterval = setInterval(() => {
            setWebSpeechProgress(prev => {
              if (prev >= estimatedDuration) {
                clearInterval(progressInterval);
                return estimatedDuration;
              }
              return prev + 0.1;
            });
          }, 100);

          resolve('audio en cours');
        };

        utterance.onend = () => {
          setIsPlaying(false);
          setIsWebSpeechMode(false);
          setWebSpeechProgress(estimatedDuration);
          setIsPaused(false);
          if (progressInterval) clearInterval(progressInterval);
          resolve('audio terminé');
        };

        utterance.onpause = () => {
          setIsPaused(true);
          if (progressInterval) clearInterval(progressInterval);
        };

        utterance.onresume = () => {
          setIsPaused(false);
          // Reprendre l'animation de progrès
          progressInterval = setInterval(() => {
            setWebSpeechProgress(prev => {
              if (prev >= estimatedDuration) {
                clearInterval(progressInterval);
                return estimatedDuration;
              }
              return prev + 0.1;
            });
          }, 100);
        };
        
        utterance.onerror = (e) => {
          setIsPlaying(false);
          setIsWebSpeechMode(false);
          setIsPaused(false);
          if (progressInterval) clearInterval(progressInterval);
          reject(new Error('Erreur Web Speech: ' + e.error));
        };

        setCurrentUtterance(utterance);
        speechSynthesis.speak(utterance);
        
      } catch (error) {
        reject(error);
      }
    });
  };

  // Fonction pour générer l'audio automatiquement
  const generateAudio = async () => {
    try {
      setIsGenerating(true);
      setGenerationError('');

      // Essayer d'abord l'API
      try {
        const response = await fetch(`/api/artwork/${artwork.id}/generate-audio`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            languages: [currentLang],
            provider: 'auto'
          })
        });

        const data = await response.json();

        if (data.success && data.audioResults[currentLang]?.audioUrl) {
          const generatedUrl = data.audioResults[currentLang].audioUrl;
          setAudioUrl(generatedUrl);
          return generatedUrl;
        }
      } catch (apiError) {
        console.log('API échouée, utilisation Web Speech API:', apiError);
      }

      // Fallback: Web Speech API
      console.log('Utilisation de Web Speech API comme fallback...');
      await generateAudioWithWebSpeech();
      return 'webspeech';

    } catch (error) {
      console.error('Erreur génération audio:', error);
      setGenerationError(error.message);
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  const togglePlay = async () => {
    try {
      // Si pas d'audio URL, générer automatiquement
      if (!audioUrl && !isGenerating) {
        const result = await generateAudio();
        
        // Si c'est Web Speech API, on n'a pas besoin de l'audioRef
        if (result === 'webspeech') {
          return; // Web Speech API gère la lecture directement
        }
        return; // L'audio se lancera via l'effet useEffect pour les vraies URLs
      }

      // Contrôles pour Web Speech API
      if (isWebSpeechMode && window.speechSynthesis) {
        if (isPlaying && !isPaused) {
          speechSynthesis.pause();
          setIsPlaying(false);
          setIsPaused(true);
        } else if (isPaused) {
          speechSynthesis.resume();
          setIsPlaying(true);
          setIsPaused(false);
        }
        return;
      }

      // Contrôles normaux pour les fichiers audio
      if (audioRef.current && audioUrl) {
        if (isPlaying) {
          audioRef.current.pause();
        } else {
          audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
      }
    } catch (error) {
      console.error('Erreur lecture audio:', error);
    }
  };

  // Auto-play après génération
  useEffect(() => {
    if (audioUrl && audioRef.current && !isPlaying) {
      audioRef.current.load(); // Recharger le nouvel audio
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.play();
          setIsPlaying(true);
        }
      }, 100);
    }
  }, [audioUrl]);

  const toggleMute = () => {
    if (isWebSpeechMode) {
      // Pour Web Speech API, on simule le mute en changeant le volume
      if (!isMuted) {
        setVolume(0);
        setIsMuted(true);
      } else {
        setVolume(1);
        setIsMuted(false);
      }
    } else if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = e.target.value / 100;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);

    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    
    // Pour Web Speech API, redémarrer avec le nouveau volume si en cours de lecture
    if (isWebSpeechMode && isPlaying && currentUtterance) {
      restartWebSpeechWithNewSettings();
    }
  };

  const handlePlaybackRateChange = (e) => {
    const newRate = parseFloat(e.target.value);
    setPlaybackRate(newRate);

    if (audioRef.current) {
      audioRef.current.playbackRate = newRate;
    }

    // Pour Web Speech API, redémarrer avec la nouvelle vitesse si en cours de lecture
    if (isWebSpeechMode && isPlaying && currentUtterance) {
      restartWebSpeechWithNewSettings();
    }
  };

  // Fonction pour redémarrer Web Speech avec nouveaux paramètres
  const restartWebSpeechWithNewSettings = () => {
    if (!currentUtterance || !window.speechSynthesis) return;

    // Arrêter la lecture actuelle
    speechSynthesis.cancel();
    
    // Sauvegarder les paramètres actuels
    const currentProgressPercent = webSpeechDuration > 0 ? (webSpeechProgress / webSpeechDuration) : 0;
    
    // Créer nouvelle utterance avec nouveaux paramètres
    setTimeout(() => {
      const newUtterance = new SpeechSynthesisUtterance(currentUtterance.text);
      newUtterance.rate = playbackRate * 0.8;
      newUtterance.pitch = 1.0;
      newUtterance.volume = volume;
      newUtterance.voice = currentUtterance.voice;

      // Reprendre depuis la position actuelle (approximative)
      if (currentProgressPercent > 0) {
        const words = currentUtterance.text.split(' ');
        const startWordIndex = Math.floor(words.length * currentProgressPercent);
        newUtterance.text = words.slice(startWordIndex).join(' ');
        setWebSpeechProgress(webSpeechProgress);
      }

      newUtterance.onstart = () => {
        setIsPlaying(true);
        setIsPaused(false);
      };

      newUtterance.onend = () => {
        setIsPlaying(false);
        setIsWebSpeechMode(false);
        setIsPaused(false);
      };

      newUtterance.onerror = () => {
        setIsPlaying(false);
        setIsWebSpeechMode(false);
        setIsPaused(false);
      };

      setCurrentUtterance(newUtterance);
      speechSynthesis.speak(newUtterance);
    }, 100);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e) => {
    const seekTime = (e.target.value / 100) * duration;
    if (audioRef.current) {
      audioRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  };

  const formatTime = (seconds) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculer le progrès selon le mode
  const getProgress = () => {
    if (isWebSpeechMode) {
      return webSpeechDuration > 0 ? (webSpeechProgress / webSpeechDuration) * 100 : 0;
    }
    return duration > 0 ? (currentTime / duration) * 100 : 0;
  };

  const getCurrentTime = () => isWebSpeechMode ? webSpeechProgress : currentTime;
  const getTotalDuration = () => isWebSpeechMode ? webSpeechDuration : duration;

  const progress = getProgress();

  return (
    <div className="bg-gradient-to-r from-amber-600 to-orange-700 text-white p-6 rounded-xl shadow-lg">
      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={() => setIsPlaying(false)}
        />
      )}

      <div className="flex items-center gap-4 mb-4">
        <Volume2 className="w-6 h-6" />
        <div className="flex-1">
          <p className="font-semibold text-lg">{tSync('Description audio')}</p>
          <p className="text-amber-100 text-sm">{title}</p>
          {isGenerating && (
            <p className="text-amber-200 text-xs mt-1">
              {tSync('Génération en cours...')}
            </p>
          )}
          {generationError && (
            <p className="text-red-200 text-xs mt-1">
              {tSync('Erreur')} : {generationError}
            </p>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <input
          type="range"
          min="0"
          max="100"
          value={progress}
          onChange={handleSeek}
          disabled={isGenerating}
          className="w-full h-2 bg-amber-800 rounded-lg appearance-none cursor-pointer accent-white disabled:opacity-50"
          style={{
            background: `linear-gradient(to right, white 0%, white ${progress}%, #92400E ${progress}%, #92400E 100%)`
          }}
        />
        <div className="flex justify-between text-sm text-amber-100 mt-2">
          <span>{formatTime(getCurrentTime())}</span>
          <span>{formatTime(getTotalDuration())}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between gap-4 mb-4">
        {/* Volume Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleMute}
            disabled={isGenerating}
            className="p-2 bg-amber-800 hover:bg-amber-900 rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            title={tSync('Volume')}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          
          <input
            type="range"
            min="0"
            max="100"
            value={volume * 100}
            onChange={handleVolumeChange}
            disabled={isGenerating}
            className="w-16 h-2 bg-amber-800 rounded-lg appearance-none cursor-pointer accent-white disabled:opacity-50"
            style={{
              background: `linear-gradient(to right, white 0%, white ${volume * 100}%, #92400E ${volume * 100}%, #92400E 100%)`
            }}
            title={`${tSync('Volume')}: ${Math.round(volume * 100)}%`}
          />
        </div>

        {/* Play/Pause Button */}
        <button
          onClick={togglePlay}
          disabled={isGenerating}
          className="p-4 bg-white text-amber-700 hover:bg-gray-100 rounded-full transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <Loader2 className="w-8 h-8 animate-spin" />
          ) : isPlaying ? (
            <Pause className="w-8 h-8" />
          ) : (
            <Play className="w-8 h-8 ml-1" />
          )}
        </button>

        {/* Speed Controls */}
        <div className="flex items-center gap-2">
          <span className="text-amber-100 text-xs font-semibold">
            {playbackRate}x
          </span>
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={playbackRate}
            onChange={handlePlaybackRateChange}
            disabled={isGenerating}
            className="w-16 h-2 bg-amber-800 rounded-lg appearance-none cursor-pointer accent-white disabled:opacity-50"
            style={{
              background: `linear-gradient(to right, white 0%, white ${((playbackRate - 0.5) / 1.5) * 100}%, #92400E ${((playbackRate - 0.5) / 1.5) * 100}%, #92400E 100%)`
            }}
            title={`${tSync('Vitesse')}: ${playbackRate}x`}
          />
          <span className="text-amber-100 text-xs">⚡</span>
        </div>
      </div>

      {!audioUrl && !isGenerating && (
        <div className="mt-3 text-center text-amber-100 text-sm">
          <p>🎙️ {tSync('Cliquez sur play pour écouter la description')}</p>
          <p className="text-xs opacity-75 mt-1">{tSync('Audio généré automatiquement')}</p>
        </div>
      )}
    </div>
  );
}