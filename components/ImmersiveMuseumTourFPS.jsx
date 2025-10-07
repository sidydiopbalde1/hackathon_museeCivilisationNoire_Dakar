'use client';

import { useRef, useState, Suspense, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, Box, Plane, Html, Stars, Sky } from '@react-three/drei';
import { Physics, useBox } from '@react-three/cannon';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/contexts/TranslationContext';
import { useArtworks } from '@/contexts/ArtworkContext';
import FPSPlayer from './FPSPlayer';
import * as THREE from 'three';

// Composant pour une œuvre d'art 3D
function ArtworkDisplay({ artwork, position, onClick }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += hovered ? 0.01 : 0.005;
    }
  });

  return (
    <group position={position}>
      {/* Cadre de l'œuvre */}
      <Box
        ref={meshRef}
        args={[2, 2.5, 0.1]}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        onClick={onClick}
        scale={hovered ? 1.1 : 1}
      >
        <meshPhongMaterial color={hovered ? '#f59e0b' : '#8b4513'} />
      </Box>
      
      {/* Image de l'œuvre */}
      <Plane args={[1.8, 2.2]} position={[0, 0, 0.051]}>
        <meshBasicMaterial color="#8B4513" />
      </Plane>
      
      {/* Titre de l'œuvre */}
      {hovered && (
        <Html position={[0, -1.5, 0]} center>
          <div className="bg-black/80 text-white px-3 py-2 rounded-lg text-center max-w-40">
            <h3 className="font-bold text-sm">{artwork.title?.fr || 'Œuvre'}</h3>
            <p className="text-xs opacity-80">{artwork.period}</p>
          </div>
        </Html>
      )}
    </group>
  );
}

// Composant pour les collisions des murs
function InvisibleWalls() {
  // Mur gauche
  useBox(() => ({ 
    position: [-10, 2.5, 0], 
    args: [0.1, 5, 20], 
    type: 'Static' 
  }));
  
  // Mur droit
  useBox(() => ({ 
    position: [10, 2.5, 0], 
    args: [0.1, 5, 20], 
    type: 'Static' 
  }));
  
  // Mur arrière
  useBox(() => ({ 
    position: [0, 2.5, -10], 
    args: [20, 5, 0.1], 
    type: 'Static' 
  }));
  
  // Mur avant
  useBox(() => ({ 
    position: [0, 2.5, 10], 
    args: [20, 5, 0.1], 
    type: 'Static' 
  }));
  
  // Sol
  useBox(() => ({ 
    position: [0, -0.05, 0], 
    args: [20, 0.1, 20], 
    type: 'Static' 
  }));

  return null;
}

// Composant pour une salle du musée avec physique
function MuseumRoomFPS({ roomId, artworks, onArtworkClick, night, performance }) {
  const { tSync } = useTranslation();
  
  const roomConfigs = {
    entree: {
      walls: [
        { position: [0, 2.5, -10], rotation: [0, 0, 0], args: [20, 5, 0.1] },
        { position: [0, 2.5, 10], rotation: [0, 0, 0], args: [20, 5, 0.1] },
        { position: [-10, 2.5, 0], rotation: [0, Math.PI/2, 0], args: [20, 5, 0.1] },
        { position: [10, 2.5, 0], rotation: [0, Math.PI/2, 0], args: [20, 5, 0.1] }
      ],
      artworks: artworks.slice(0, 4),
      artworkPositions: [
        [-7, 1.5, -9.9],
        [0, 1.5, -9.9], 
        [7, 1.5, -9.9],
        [-7, 1.5, 9.9]
      ]
    }
  };

  const config = roomConfigs[roomId] || roomConfigs.entree;

  return (
    <>
      {/* Sol */}
      <Plane args={[20, 20]} rotation={[-Math.PI/2, 0, 0]} position={[0, 0, 0]}>
        <meshPhongMaterial color={night ? '#2D1B10' : '#8B4513'} />
      </Plane>
      
      {/* Plafond */}
      <Plane args={[20, 20]} rotation={[Math.PI/2, 0, 0]} position={[0, 5, 0]}>
        <meshPhongMaterial color={night ? '#1A1A1A' : '#DEB887'} />
      </Plane>

      {/* Murs visuels */}
      {config.walls.map((wall, index) => (
        <Box
          key={index}
          args={wall.args}
          position={wall.position}
          rotation={wall.rotation}
        >
          <meshPhongMaterial color={night ? '#8B7355' : '#D2B48C'} />
        </Box>
      ))}

      {/* Murs invisibles pour collisions */}
      <InvisibleWalls />

      {/* Œuvres d'art */}
      {config.artworks.map((artwork, index) => (
        config.artworkPositions[index] && (
          <ArtworkDisplay
            key={artwork.id || index}
            artwork={artwork}
            position={config.artworkPositions[index]}
            onClick={() => onArtworkClick(artwork)}
          />
        )
      ))}

      {/* Éclairage adapté au mode performance */}
      {performance && (
        <>
          {/* Spots sur les œuvres */}
          {config.artworkPositions.map((position, index) => (
            <spotLight
              key={index}
              position={[position[0], 4, position[2] + 1]}
              target-position={position}
              intensity={night ? 2 : 1}
              angle={Math.PI / 6}
              penumbra={0.3}
              color={night ? '#FFD700' : '#FFFFFF'}
              castShadow
            />
          ))}
        </>
      )}

      {/* Titre de la salle */}
      <Text
        position={[0, 4, -7.5]}
        fontSize={0.5}
        color={night ? '#FFD700' : '#8B4513'}
        anchorX="center"
        anchorY="middle"
      >
        {tSync(`Salle ${roomId} - Mode FPS`)}
      </Text>
    </>
  );
}

// Composant principal
export default function ImmersiveMuseumTourFPS({ currentRoom = 'entree', onRoomChange }) {
  const router = useRouter();
  const { artworks } = useArtworks();
  const { tSync } = useTranslation();
  const [night, setNight] = useState(false);
  const [performance, setPerformance] = useState(true);

  const handleArtworkClick = (artwork) => {
    router.push(`/artwork/${artwork.id || artwork._id}`);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      switch(e.code) {
        case "KeyN":
          setNight(!night);
          return;
        case "KeyP":
          setPerformance(!performance);
          return;
        default: 
          return;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [night, performance]);

  return (
    <div className="w-full h-screen">
      <Suspense fallback={
        <div className="w-full h-screen bg-gradient-to-br from-amber-900 to-orange-900 flex items-center justify-center">
          <div className="text-center text-white">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-amber-300 mx-auto mb-6"></div>
            <h2 className="text-2xl font-bold">{tSync('Chargement de la visite FPS...')}</h2>
          </div>
        </div>
      }>
        <Canvas
          camera={{ position: [0, 1.6, 5], fov: 75 }}
          gl={{ 
            antialias: true, 
            alpha: false,
            shadowMap: true,
            shadowMapType: THREE.PCFSoftShadowMap
          }}
        >
          {/* Environnement jour/nuit */}
          {night ? (
            <>
              <Stars radius={300} depth={60} count={20000} factor={7} />
              <fog attach="fog" args={['#1a1a2e', 10, 50]} />
            </>
          ) : (
            <>
              <Sky sunPosition={[100, 20, 100]} />
              <fog attach="fog" args={['#f0f4f5', 10, 50]} />
            </>
          )}

          {/* Éclairage global */}
          <ambientLight intensity={night ? 0.2 : 0.6} color={night ? '#4A4A8A' : '#FFFFFF'} />
          <directionalLight 
            position={[10, 10, 5]} 
            intensity={night ? 0.3 : 1} 
            color={night ? '#FFD700' : '#FFFFFF'}
            castShadow 
          />

          {/* Physique avec gravité */}
          <Physics gravity={[0, -30, 0]}>
            {/* Joueur FPS */}
            <FPSPlayer position={[0, 1.6, 5]} />
            
            {/* Salle du musée */}
            <MuseumRoomFPS
              roomId={currentRoom}
              artworks={artworks}
              onArtworkClick={handleArtworkClick}
              night={night}
              performance={performance}
            />
          </Physics>
        </Canvas>
      </Suspense>
      
      {/* Interface utilisateur */}
      <div className="absolute top-4 left-4 text-white bg-black/50 p-3 rounded-lg">
        <p className="text-sm">Mode: {night ? 'Nuit 🌙' : 'Jour ☀️'}</p>
        <p className="text-sm">Performance: {performance ? 'ON' : 'OFF'}</p>
        <p className="text-xs mt-2">N: Jour/Nuit | P: Performance</p>
      </div>
    </div>
  );
}