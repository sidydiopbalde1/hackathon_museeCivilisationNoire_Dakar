'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/contexts/TranslationContext';
import { useArtworks } from '@/contexts/ArtworkContext';
import { ChevronLeft, ChevronRight, Eye, Info } from 'lucide-react';

export default function VirtualMuseumTourFallback({ currentRoom, onRoomChange }) {
  const router = useRouter();
  const { artworks } = useArtworks();
  const { tSync } = useTranslation();
  const [selectedArtwork, setSelectedArtwork] = useState(null);

  const rooms = [
    { id: 'entree', name: tSync('Hall d\'entrée'), artworks: artworks.slice(0, 4) },
    { id: 'salle1', name: tSync('Salle des Masques'), artworks: artworks.slice(4, 8) },
    { id: 'salle2', name: tSync('Salle des Textiles'), artworks: artworks.slice(8, 12) },
    { id: 'salle3', name: tSync('Salle des Sculptures'), artworks: artworks.slice(12, 16) },
    { id: 'salle4', name: tSync('Salle Contemporaine'), artworks: artworks.slice(16, 20) }
  ];

  const currentRoomData = rooms.find(room => room.id === currentRoom) || rooms[0];

  return (
    <div className="w-full h-screen bg-gradient-to-br from-amber-100 to-orange-100 relative">
      {/* Fond de salle */}
      <div className="absolute inset-0 bg-gradient-to-b from-amber-200 via-amber-100 to-amber-200">
        {/* Simulation de perspective 3D avec CSS */}
        <div className="absolute inset-0" style={{
          background: `
            linear-gradient(to bottom, #8B4513 0%, #8B4513 20%, #D2B48C 20%, #D2B48C 80%, #8B4513 80%, #8B4513 100%),
            linear-gradient(to right, #8B4513 0%, #8B4513 5%, transparent 5%, transparent 95%, #8B4513 95%, #8B4513 100%)
          `,
          backgroundSize: '100% 100%, 100% 100%'
        }}>
        </div>
      </div>

      {/* Titre de la salle */}
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-20">
        <h1 className="text-4xl font-bold text-amber-900 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-2xl shadow-lg">
          {currentRoomData.name}
        </h1>
      </div>

      {/* Galerie des œuvres */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto p-8">
          {currentRoomData.artworks.map((artwork, index) => (
            <div
              key={artwork.id || index}
              className="group relative cursor-pointer transform transition-all duration-300 hover:scale-110 hover:z-30"
              onClick={() => router.push(`/artwork/${artwork.id || artwork._id}`)}
            >
              {/* Cadre */}
              <div className="bg-gradient-to-br from-amber-800 to-amber-900 p-4 rounded-lg shadow-2xl">
                {/* Image de l'œuvre */}
                <div className="relative h-40 w-full bg-amber-50 rounded overflow-hidden">
                  {artwork.imageUrl ? (
                    <img
                      src={artwork.imageUrl}
                      alt={artwork.title?.fr || 'Œuvre'}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-amber-200 to-amber-300 flex items-center justify-center">
                      <span className="text-4xl">🎨</span>
                    </div>
                  )}
                  
                  {/* Overlay au survol */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Eye className="w-8 h-8 text-white" />
                  </div>
                </div>

                {/* Info œuvre */}
                <div className="mt-3 text-center">
                  <h3 className="text-white font-bold text-sm line-clamp-1">
                    {artwork.title?.fr || 'Sans titre'}
                  </h3>
                  <p className="text-amber-200 text-xs">
                    {artwork.period || 'Période inconnue'}
                  </p>
                </div>
              </div>

              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <div className="bg-black/80 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap">
                  {tSync('Cliquer pour voir les détails')}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Message informatif */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="bg-amber-900/90 text-white px-6 py-3 rounded-xl text-center max-w-md">
          <div className="flex items-center gap-2 justify-center mb-2">
            <Info className="w-5 h-5" />
            <span className="font-semibold">{tSync('Mode de compatibilité')}</span>
          </div>
          <p className="text-sm text-amber-200">
            {tSync('Visite simplifiée pour une meilleure compatibilité. Cliquez sur une œuvre pour la découvrir !')}
          </p>
        </div>
      </div>
    </div>
  );
}