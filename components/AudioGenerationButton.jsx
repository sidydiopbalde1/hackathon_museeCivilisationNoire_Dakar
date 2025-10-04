'use client';

import { useState } from 'react';
import { Mic, Loader2, Volume2, AlertCircle } from 'lucide-react';
import { useTranslation } from '@/contexts/TranslationContext';

export default function AudioGenerationButton({ artwork, onAudioGenerated }) {
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState('');
  const [error, setError] = useState('');
  const { tSync, currentLang } = useTranslation();

  const generateAudio = async () => {
    try {
      setGenerating(true);
      setError('');
      setProgress(tSync('Connexion au service audio...'));

      const response = await fetch(`/api/artwork/${artwork.id}/generate-audio`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          languages: ['fr', 'en', 'wo'],
          provider: 'auto'
        })
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Erreur de génération');
      }

      setProgress(tSync('Audio généré avec succès!'));
      
      // Notifier le parent avec les nouveaux audios
      if (onAudioGenerated) {
        onAudioGenerated(data.audioResults);
      }

      // Faire disparaître le message de succès après 3 secondes
      setTimeout(() => {
        setProgress('');
      }, 3000);

    } catch (error) {
      console.error('Erreur génération audio:', error);
      setError(error.message);
    } finally {
      setGenerating(false);
    }
  };

  // Vérifier si l'artwork a déjà des audios
  const hasExistingAudio = artwork.audioUrl && Object.keys(artwork.audioUrl).length > 0;

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Volume2 className="w-5 h-5 text-blue-600" />
        </div>
        
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-2">
            {tSync('Génération audio automatique')}
          </h3>
          
          <p className="text-sm text-gray-600 mb-4">
            {tSync('Convertir la description de cette œuvre en audio dans les 3 langues (FR, EN, Wolof)')}
          </p>

          {hasExistingAudio && (
            <div className="mb-3 p-2 bg-green-100 border border-green-200 rounded text-sm text-green-700">
              ✅ {tSync('Audio déjà disponible pour cette œuvre')}
            </div>
          )}

          {error && (
            <div className="mb-3 p-2 bg-red-100 border border-red-200 rounded text-sm text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          {progress && (
            <div className="mb-3 p-2 bg-blue-100 border border-blue-200 rounded text-sm text-blue-700">
              {progress}
            </div>
          )}

          <button
            onClick={generateAudio}
            disabled={generating}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              generating
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {generating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {tSync('Génération en cours...')}
              </>
            ) : (
              <>
                <Mic className="w-4 h-4" />
                {hasExistingAudio 
                  ? tSync('Regénérer l\'audio')
                  : tSync('Générer l\'audio')
                }
              </>
            )}
          </button>

          <div className="mt-3 text-xs text-gray-500">
            <p>💡 {tSync('Utilise des IA gratuits (ElevenLabs, OpenAI TTS)')}</p>
            <p>⏱️ {tSync('Durée estimée : 10-30 secondes par langue')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}