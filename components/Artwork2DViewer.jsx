'use client';

import { useState } from 'react';
import { useTranslation } from '@/contexts/TranslationContext';
import ImagePreviewModal from './ImagePreviewModal';

export default function Artwork2DViewer({ artwork }) {
  const { tSync } = useTranslation();
  const [showPreview, setShowPreview] = useState(false);

  if (!artwork || !artwork.imageUrl) {
    return (
      <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">{tSync('Image non disponible')}</p>
      </div>
    );
  }

  return (
    <>
      <div className="relative w-full h-96 rounded-lg overflow-hidden shadow-xl bg-white">
        {/* Image principale */}
        <div className="relative w-full h-full group">
          <img
            src={artwork.imageUrl}
            alt={artwork.title?.fr || 'Œuvre'}
            crossOrigin="anonymous"
            className="w-full h-full object-contain cursor-pointer transition-transform duration-300 group-hover:scale-105"
            onClick={() => setShowPreview(true)}
            title={tSync('Cliquez pour agrandir')}
          />

          {/* Overlay avec icône zoom au survol */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 p-3 rounded-full">
              <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
              </svg>
            </div>
          </div>

          {/* Informations en overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
            <h3 className="text-white font-bold text-lg mb-1">
              {artwork.title?.fr || 'Œuvre'}
            </h3>
            <p className="text-gray-300 text-sm">
              {artwork.origin} • {artwork.period}
            </p>
          </div>
        </div>

        {/* Instructions */}
        <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-2 rounded-lg text-sm">
          <p>🔍 {tSync('Cliquez pour agrandir')}</p>
        </div>
      </div>

      {/* Modal de prévisualisation */}
      <ImagePreviewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        artwork={artwork}
      />
    </>
  );
}