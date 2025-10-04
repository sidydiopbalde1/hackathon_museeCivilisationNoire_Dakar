'use client';

import { useEffect } from 'react';
import { X, ZoomIn, ZoomOut, RotateCw, Download } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from '@/contexts/TranslationContext';

export default function ImagePreviewModal({ isOpen, onClose, artwork }) {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const { tSync } = useTranslation();

  // Fermer avec Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Reset zoom et rotation à la fermeture
  useEffect(() => {
    if (!isOpen) {
      setZoom(1);
      setRotation(0);
    }
  }, [isOpen]);

  if (!isOpen || !artwork) return null;

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.25, 0.5));
  const handleRotate = () => setRotation(prev => (prev + 90) % 360);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = artwork.imageUrl;
    link.download = `${artwork.title?.fr || 'artwork'}.jpg`;
    link.target = '_blank';
    link.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/90 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full h-full max-w-7xl max-h-screen p-4 flex flex-col">
        {/* Header avec contrôles */}
        <div className="flex items-center justify-between mb-4 z-10">
          <div className="text-white">
            <h2 className="text-xl font-bold">{artwork.title?.fr}</h2>
            <p className="text-gray-300 text-sm">{artwork.origin} • {artwork.period}</p>
          </div>

          <div className="flex items-center gap-2">
            {/* Contrôles */}
            <button
              onClick={handleZoomOut}
              className="p-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors"
              title={tSync('Dézoomer')}
            >
              <ZoomOut className="w-5 h-5" />
            </button>

            <span className="text-white text-sm px-2">
              {Math.round(zoom * 100)}%
            </span>

            <button
              onClick={handleZoomIn}
              className="p-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors"
              title={tSync('Zoomer')}
            >
              <ZoomIn className="w-5 h-5" />
            </button>

            <button
              onClick={handleRotate}
              className="p-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors"
              title={tSync('Tourner')}
            >
              <RotateCw className="w-5 h-5" />
            </button>

            <button
              onClick={handleDownload}
              className="p-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors"
              title={tSync('Télécharger')}
            >
              <Download className="w-5 h-5" />
            </button>

            <button
              onClick={onClose}
              className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              title={tSync('Fermer')}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Image Container */}
        <div className="flex-1 flex items-center justify-center overflow-hidden">
          <div 
            className="relative transition-transform duration-200 ease-out cursor-move"
            style={{
              transform: `scale(${zoom}) rotate(${rotation}deg)`,
              maxWidth: '100%',
              maxHeight: '100%'
            }}
          >
            <img
              src={artwork.imageUrl}
              alt={artwork.title?.fr || 'Œuvre'}
              crossOrigin="anonymous"
              className="max-w-full max-h-full object-contain shadow-2xl"
              draggable={false}
            />
          </div>
        </div>

        {/* Footer avec infos */}
        <div className="mt-4 text-center text-gray-300 text-sm">
          <p>{tSync('Cliquez en dehors de l\'image pour fermer')} • {tSync('Utilisez les contrôles pour zoomer et tourner')}</p>
        </div>
      </div>
    </div>
  );
}