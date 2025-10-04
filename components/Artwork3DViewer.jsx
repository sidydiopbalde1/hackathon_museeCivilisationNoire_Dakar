'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslation } from '@/contexts/TranslationContext';
import ImagePreviewModal from './ImagePreviewModal';

function CSS3DViewer({ artwork, onImageClick }) {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isAnimating, setIsAnimating] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const animationRef = useRef();

  useEffect(() => {
    if (isAnimating && !isHovered) {
      const animate = () => {
        setRotation(prev => ({
          x: prev.x + 0.3,
          y: prev.y + 0.5
        }));
        animationRef.current = requestAnimationFrame(animate);
      };
      animationRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isAnimating, isHovered]);

  return (
    <div 
      className="relative w-full h-full flex items-center justify-center" 
      style={{ perspective: '1000px' }}
      onMouseEnter={() => { setIsHovered(true); setIsAnimating(false); }}
      onMouseLeave={() => { setIsHovered(false); setIsAnimating(true); }}
    >
      {/* Fond musée */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50 to-orange-100"></div>
      
      {/* Cadre 3D avec image */}
      <div 
        className="relative transition-all duration-500"
        style={{
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) ${isHovered ? 'scale(1.1)' : 'scale(1)'}`,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Cadre doré extérieur */}
        <div className="relative w-80 h-60 bg-gradient-to-br from-yellow-500 via-yellow-600 to-yellow-700 p-2 shadow-2xl">
          {/* Cadre intérieur */}
          <div className="w-full h-full bg-gradient-to-br from-amber-800 to-amber-900 p-1">
            {/* Image */}
            <div className="w-full h-full relative overflow-hidden">
              <img 
                src={artwork?.imageUrl} 
                alt={artwork?.title?.fr || 'Œuvre'}
                crossOrigin="anonymous"
                className="w-full h-full object-cover cursor-pointer hover:brightness-110 transition-all"
                style={{ 
                  display: 'block',
                  width: '100%',
                  height: '100%'
                }}
                onClick={onImageClick}
                title="Cliquez pour agrandir"
              />
              
              {/* Plaque info */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent p-3">
                <h3 className="text-white font-bold text-sm">
                  {artwork?.title?.fr}
                </h3>
                <p className="text-amber-200 text-xs">
                  {artwork?.origin} • {artwork?.period}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Éclairage */}
        <div 
          className="absolute -top-20 -left-20 w-40 h-40 bg-gradient-radial from-yellow-200/30 to-transparent rounded-full blur-xl pointer-events-none"
          style={{ transform: 'translateZ(50px)' }}
        />
      </div>

      {/* Sol */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-gray-300/20 to-transparent pointer-events-none" />
    </div>
  );
}

export default function Artwork3DViewer({ artwork }) {
  const { tSync } = useTranslation();
  const [showPreview, setShowPreview] = useState(false);

  if (!artwork || !artwork.imageUrl) {
    return (
      <div className="w-full h-96 bg-gray-200 flex items-center justify-center">
        <p className="text-gray-500">{tSync('Image non disponible')}</p>
      </div>
    );
  }

  return (
    <>
      <div className="relative w-full h-96 overflow-hidden bg-gradient-to-b from-amber-100 to-orange-100">
        <CSS3DViewer 
          artwork={artwork} 
          onImageClick={() => setShowPreview(true)}
        />

      {/* Instructions */}
      <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-2 rounded-lg text-sm">
        <p>🖱️ {tSync('Survolez pour interagir')}</p>
        <p>🎮 {tSync('Rotation automatique')}</p>
      </div>

      {/* Info */}
      <div className="absolute top-4 right-4 bg-white/90 px-3 py-2 rounded-lg text-sm max-w-xs">
        <h3 className="font-bold text-gray-800">{artwork.title?.fr}</h3>
        <p className="text-xs text-gray-600">{artwork.origin}</p>
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