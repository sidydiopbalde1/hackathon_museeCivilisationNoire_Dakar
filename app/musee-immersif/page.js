'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { ArrowLeft, Loader2, Info, Settings } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/contexts/TranslationContext';

// Composant de chargement pour la vue 3D immersive
const LoadingImmersive = () => {
  const { tSync } = useTranslation();
  return (
    <div className="w-full h-screen bg-gradient-to-br from-amber-900 via-orange-900 to-red-900 flex items-center justify-center">
      <div className="text-center text-white">
        <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-amber-300 mx-auto mb-8"></div>
        <h2 className="text-3xl font-bold mb-4">{tSync('Initialisation de l\'expérience immersive...')}</h2>
        <p className="text-amber-200 text-lg mb-2">{tSync('Préparation de l\'environnement 3D')}</p>
        <p className="text-amber-300 text-sm">{tSync('Veuillez patienter quelques instants')}</p>
      </div>
    </div>
  );
};

// Import dynamique du composant immersif
const ImmersiveMuseumTour = dynamic(
  () => import('@/components/ImmersiveMuseumTour'), 
  {
    ssr: false,
    loading: () => <LoadingImmersive />
  }
);

export default function MuseeImmersifPage() {
  const router = useRouter();
  const { tSync } = useTranslation();
  const [showInstructions, setShowInstructions] = useState(true);
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div className="min-h-screen bg-black relative">
      {/* Header de navigation */}
      <div className="absolute top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-sm border-b border-amber-500/30">
        <div className="flex items-center justify-between p-4 max-w-7xl mx-auto">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 text-amber-300 hover:text-amber-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-semibold">{tSync('Retour à l\'accueil')}</span>
          </button>

          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-white hidden md:block">
              {tSync('Musée Immersif - Mode FPS')}
            </h1>
            <h1 className="text-lg font-bold text-white md:hidden">
              {tSync('Mode FPS')}
            </h1>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowInstructions(!showInstructions)}
                className="p-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-all"
                title={tSync('Instructions')}
              >
                <Info className="w-5 h-5" />
              </button>
              
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-all"
                title={tSync('Paramètres')}
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Instructions overlay */}
      {showInstructions && (
        <div className="absolute top-20 left-4 z-40 bg-black/95 backdrop-blur-sm border border-amber-500/50 rounded-xl p-6 max-w-md text-white">
          <h3 className="text-lg font-bold text-amber-300 mb-4">
            {tSync('Contrôles de navigation FPS')}
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-8 bg-amber-600 rounded flex items-center justify-center text-xs font-bold">
                WASD
              </div>
              <span>{tSync('Se déplacer (Avant/Arrière/Gauche/Droite)')}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-8 bg-amber-600 rounded flex items-center justify-center text-xs font-bold">
                🖱️
              </div>
              <span>{tSync('Regarder autour (Mouvement de la souris)')}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-8 bg-amber-600 rounded flex items-center justify-center text-xs font-bold">
                SHIFT
              </div>
              <span>{tSync('Courir (Maintenir appuyé)')}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-8 bg-amber-600 rounded flex items-center justify-center text-xs font-bold">
                SPACE
              </div>
              <span>{tSync('Sauter/Voler')}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-8 bg-emerald-600 rounded flex items-center justify-center text-xs font-bold">
                CLIC
              </div>
              <span>{tSync('Interagir avec les œuvres')}</span>
            </div>
          </div>
          <div className="mt-4 p-3 bg-amber-900/50 rounded-lg">
            <p className="text-xs text-amber-200">
              <strong>{tSync('Astuce')} :</strong> {tSync('Cliquez n\'importe où pour verrouiller la souris et commencer l\'exploration')}
            </p>
          </div>
          <button
            onClick={() => setShowInstructions(false)}
            className="mt-4 w-full bg-amber-600 hover:bg-amber-700 text-white py-2 rounded-lg transition-all"
          >
            {tSync('Commencer l\'exploration')}
          </button>
        </div>
      )}

      {/* Settings overlay */}
      {showSettings && (
        <div className="absolute top-20 right-4 z-40 bg-black/95 backdrop-blur-sm border border-emerald-500/50 rounded-xl p-6 max-w-sm text-white">
          <h3 className="text-lg font-bold text-emerald-300 mb-4">
            {tSync('Paramètres')}
          </h3>
          <div className="space-y-4 text-sm">
            <div className="flex items-center justify-between">
              <span>{tSync('Mode nuit/jour')}</span>
              <span className="text-emerald-300">{tSync('Touche dans le jeu')}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>{tSync('Sensibilité souris')}</span>
              <span className="text-emerald-300">{tSync('Standard')}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>{tSync('Vitesse de déplacement')}</span>
              <span className="text-emerald-300">{tSync('Normale')}</span>
            </div>
          </div>
          <div className="mt-4 p-3 bg-emerald-900/50 rounded-lg">
            <p className="text-xs text-emerald-200">
              {tSync('Cette expérience utilise les dernières technologies 3D pour vous offrir une navigation immersive dans le musée.')}
            </p>
          </div>
          <button
            onClick={() => setShowSettings(false)}
            className="mt-4 w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg transition-all"
          >
            {tSync('Fermer')}
          </button>
        </div>
      )}

      {/* Composant 3D immersif principal */}
      <ImmersiveMuseumTour />
    </div>
  );
}