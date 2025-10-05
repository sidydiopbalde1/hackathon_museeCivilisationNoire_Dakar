'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { ArrowLeft, Loader2, Home, Map, Info } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/contexts/TranslationContext';

// Composant de chargement pour la vue 3D
const Loading3D = () => {
  const { tSync } = useTranslation();
  return (
    <div className="w-full h-screen bg-gradient-to-br from-amber-900 to-orange-900 flex items-center justify-center">
      <div className="text-center text-white">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-amber-300 mx-auto mb-6"></div>
        <h2 className="text-2xl font-bold mb-2">{tSync('Chargement de la visite virtuelle...')}</h2>
        <p className="text-amber-200">{tSync('Préparation de votre expérience immersive')}</p>
      </div>
    </div>
  );
};

// Import dynamique du composant 3D avec fallback
const VirtualMuseumTour = dynamic(
  () => import('@/components/VirtualMuseumTour').catch(() => import('@/components/VirtualMuseumTourFallback')), 
  {
    ssr: false,
    loading: () => <Loading3D />
  }
);

export default function VisiteVirtuellePage() {
  const router = useRouter();
  const { tSync } = useTranslation();
  const [showInstructions, setShowInstructions] = useState(true);
  const [currentRoom, setCurrentRoom] = useState('entree');

  const rooms = [
    { id: 'entree', name: tSync('Hall d\'entrée'), description: tSync('Accueil et présentation du musée') },
    { id: 'salle1', name: tSync('Salle des Masques'), description: tSync('Collection de masques traditionnels') },
    { id: 'salle2', name: tSync('Salle des Textiles'), description: tSync('Artisanat et tissages africains') },
    { id: 'salle3', name: tSync('Salle des Sculptures'), description: tSync('Sculptures et statues ancestrales') },
    { id: 'salle4', name: tSync('Salle Contemporaine'), description: tSync('Art moderne et contemporain') }
  ];

  const handleRoomChange = (roomId) => {
    setCurrentRoom(roomId);
  };

  return (
    <div className="min-h-screen bg-black relative">
      {/* Header de navigation */}
      <div className="absolute top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-b border-amber-500/30">
        <div className="flex items-center justify-between p-4 max-w-7xl mx-auto">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 text-amber-300 hover:text-amber-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-semibold">{tSync('Retour à l\'accueil')}</span>
          </button>

          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-white">
              {tSync('Visite Virtuelle 3D')}
            </h1>
            
            <button
              onClick={() => setShowInstructions(!showInstructions)}
              className="p-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-all"
              title={tSync('Instructions')}
            >
              <Info className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Instructions overlay */}
      {showInstructions && (
        <div className="absolute top-20 left-4 z-40 bg-black/90 backdrop-blur-sm border border-amber-500/50 rounded-xl p-6 max-w-md text-white">
          <h3 className="text-lg font-bold text-amber-300 mb-4">
            {tSync('Instructions de navigation')}
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-amber-600 rounded flex items-center justify-center text-xs font-bold">
                🖱️
              </div>
              <span>{tSync('Clic gauche + glisser : Regarder autour')}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-amber-600 rounded flex items-center justify-center text-xs font-bold">
                ⚲
              </div>
              <span>{tSync('Molette : Zoomer/Dézoomer')}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-amber-600 rounded flex items-center justify-center text-xs font-bold">
                👆
              </div>
              <span>{tSync('Clic sur œuvre : Voir détails')}</span>
            </div>
          </div>
          <button
            onClick={() => setShowInstructions(false)}
            className="mt-4 w-full bg-amber-600 hover:bg-amber-700 text-white py-2 rounded-lg transition-all"
          >
            {tSync('Commencer la visite')}
          </button>
        </div>
      )}

      {/* Sélecteur de salles */}
      <div className="absolute bottom-4 left-4 right-4 z-40">
        <div className="bg-black/80 backdrop-blur-sm border border-amber-500/50 rounded-xl p-4 max-w-4xl mx-auto">
          <div className="flex items-center gap-2 mb-3">
            <Map className="w-5 h-5 text-amber-300" />
            <h3 className="text-amber-300 font-semibold">{tSync('Plan du musée')}</h3>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {rooms.map((room) => (
              <button
                key={room.id}
                onClick={() => handleRoomChange(room.id)}
                className={`p-3 rounded-lg transition-all text-left ${
                  currentRoom === room.id
                    ? 'bg-amber-600 text-white'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                <div className="font-semibold text-sm">{room.name}</div>
                <div className="text-xs opacity-80 mt-1">{room.description}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Composant 3D principal */}
      <VirtualMuseumTour currentRoom={currentRoom} onRoomChange={handleRoomChange} />
    </div>
  );
}