'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslation } from '@/contexts/TranslationContext';

// Simulateur 3D CSS (sans Three.js)
function CSS3DViewer({ artwork }) {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isAnimating, setIsAnimating] = useState(true);
  const animationRef = useRef();

  useEffect(() => {
    if (isAnimating) {
      const animate = () => {
        setRotation(prev => ({
          x: prev.x + 0.5,
          y: prev.y + 0.3
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
  }, [isAnimating]);

  const handleMouseEnter = () => setIsAnimating(false);
  const handleMouseLeave = () => setIsAnimating(true);

  return (
    <div className="relative w-full h-full flex items-center justify-center perspective-1000">
      {/* Environnement de musée */}
      <div 
        className="relative w-64 h-64 preserve-3d cursor-pointer transition-transform duration-300 hover:scale-110"
        style={{
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Cube représentant l'œuvre */}
        <div className="absolute inset-0 preserve-3d">
          {/* Face avant */}
          <div 
            className="absolute w-full h-full bg-gradient-to-br from-amber-500 to-orange-600 shadow-xl flex items-center justify-center text-white font-bold text-lg"
            style={{ transform: 'translateZ(128px)' }}
          >
            🎨 {artwork?.title?.fr?.substring(0, 15) || 'Œuvre'}...
          </div>
          
          {/* Face arrière */}
          <div 
            className="absolute w-full h-full bg-gradient-to-br from-red-500 to-pink-600 shadow-xl flex items-center justify-center text-white font-bold"
            style={{ transform: 'translateZ(-128px) rotateY(180deg)' }}
          >
            📍 {artwork?.origin || 'Origine'}
          </div>
          
          {/* Face droite */}
          <div 
            className="absolute w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 shadow-xl flex items-center justify-center text-white font-bold"
            style={{ transform: 'rotateY(90deg) translateZ(128px)' }}
          >
            📅 {artwork?.period || 'Période'}
          </div>
          
          {/* Face gauche */}
          <div 
            className="absolute w-full h-full bg-gradient-to-br from-green-500 to-emerald-600 shadow-xl flex items-center justify-center text-white font-bold"
            style={{ transform: 'rotateY(-90deg) translateZ(128px)' }}
          >
            🔨 {artwork?.material || 'Matériau'}
          </div>
          
          {/* Face haut */}
          <div 
            className="absolute w-full h-full bg-gradient-to-br from-purple-500 to-violet-600 shadow-xl flex items-center justify-center text-white font-bold"
            style={{ transform: 'rotateX(90deg) translateZ(128px)' }}
          >
            📏 {artwork?.dimensions || 'Dimensions'}
          </div>
          
          {/* Face bas */}
          <div 
            className="absolute w-full h-full bg-gradient-to-br from-gray-500 to-slate-600 shadow-xl flex items-center justify-center text-white font-bold"
            style={{ transform: 'rotateX(-90deg) translateZ(128px)' }}
          >
            🏛️ MCN
          </div>
        </div>
      </div>
    </div>
  );
}

// Composant principal du viewer 3D
export default function Artwork3DViewer({ artwork }) {
  const { tSync } = useTranslation();

  if (!artwork) {
    return (
      <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">{tSync('Chargement de la vue 3D...')}</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-96 rounded-lg overflow-hidden shadow-xl bg-gradient-to-b from-amber-100 to-orange-100">
      {/* CSS 3D Viewer */}
      <CSS3DViewer artwork={artwork} />

      {/* Instructions */}
      <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-2 rounded-lg text-sm">
        <p>{tSync('🖱️ Survolez pour interagir')}</p>
        <p>{tSync('🎮 Rotation automatique')}</p>
      </div>

      {/* Info sur l'œuvre */}
      <div className="absolute top-4 right-4 bg-white/90 text-gray-800 px-3 py-2 rounded-lg text-sm max-w-xs">
        <h3 className="font-bold">{artwork.title?.fr || 'Œuvre'}</h3>
        <p className="text-xs text-gray-600">{artwork.origin || 'Origine inconnue'}</p>
      </div>
    </div>
  );
}