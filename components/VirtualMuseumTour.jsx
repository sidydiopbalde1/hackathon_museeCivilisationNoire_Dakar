'use client';

import { useRef, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Box, Plane, Html } from '@react-three/drei';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/contexts/TranslationContext';
import { useArtworks } from '@/contexts/ArtworkContext';

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

// Composant pour une salle du musée
function MuseumRoom({ roomId, artworks, onArtworkClick }) {
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
    },
    salle1: {
      walls: [
        { position: [0, 2.5, -8], rotation: [0, 0, 0], args: [16, 5, 0.1] },
        { position: [0, 2.5, 8], rotation: [0, 0, 0], args: [16, 5, 0.1] },
        { position: [-8, 2.5, 0], rotation: [0, Math.PI/2, 0], args: [16, 5, 0.1] },
        { position: [8, 2.5, 0], rotation: [0, Math.PI/2, 0], args: [16, 5, 0.1] }
      ],
      artworks: artworks.slice(4, 8),
      artworkPositions: [
        [-6, 1.5, -7.9],
        [0, 1.5, -7.9],
        [6, 1.5, -7.9],
        [0, 1.5, 7.9]
      ]
    },
    salle2: {
      walls: [
        { position: [0, 2.5, -8], rotation: [0, 0, 0], args: [16, 5, 0.1] },
        { position: [0, 2.5, 8], rotation: [0, 0, 0], args: [16, 5, 0.1] },
        { position: [-8, 2.5, 0], rotation: [0, Math.PI/2, 0], args: [16, 5, 0.1] },
        { position: [8, 2.5, 0], rotation: [0, Math.PI/2, 0], args: [16, 5, 0.1] }
      ],
      artworks: artworks.slice(8, 12),
      artworkPositions: [
        [-6, 1.5, -7.9],
        [2, 1.5, -7.9],
        [-2, 1.5, 7.9],
        [6, 1.5, 7.9]
      ]
    },
    salle3: {
      walls: [
        { position: [0, 2.5, -8], rotation: [0, 0, 0], args: [16, 5, 0.1] },
        { position: [0, 2.5, 8], rotation: [0, 0, 0], args: [16, 5, 0.1] },
        { position: [-8, 2.5, 0], rotation: [0, Math.PI/2, 0], args: [16, 5, 0.1] },
        { position: [8, 2.5, 0], rotation: [0, Math.PI/2, 0], args: [16, 5, 0.1] }
      ],
      artworks: artworks.slice(12, 16),
      artworkPositions: [
        [-5, 1.5, -7.9],
        [5, 1.5, -7.9],
        [-5, 1.5, 7.9],
        [5, 1.5, 7.9]
      ]
    },
    salle4: {
      walls: [
        { position: [0, 2.5, -8], rotation: [0, 0, 0], args: [16, 5, 0.1] },
        { position: [0, 2.5, 8], rotation: [0, 0, 0], args: [16, 5, 0.1] },
        { position: [-8, 2.5, 0], rotation: [0, Math.PI/2, 0], args: [16, 5, 0.1] },
        { position: [8, 2.5, 0], rotation: [0, Math.PI/2, 0], args: [16, 5, 0.1] }
      ],
      artworks: artworks.slice(16, 20),
      artworkPositions: [
        [-4, 1.5, -7.9],
        [4, 1.5, -7.9],
        [0, 1.5, 7.9],
        [-7.9, 1.5, 0]
      ]
    }
  };

  const config = roomConfigs[roomId] || roomConfigs.entree;

  return (
    <>
      {/* Sol */}
      <Plane args={[20, 20]} rotation={[-Math.PI/2, 0, 0]} position={[0, 0, 0]}>
        <meshPhongMaterial color="#8B4513" />
      </Plane>
      
      {/* Plafond */}
      <Plane args={[20, 20]} rotation={[Math.PI/2, 0, 0]} position={[0, 5, 0]}>
        <meshPhongMaterial color="#DEB887" />
      </Plane>

      {/* Murs */}
      {config.walls.map((wall, index) => (
        <Box
          key={index}
          args={wall.args}
          position={wall.position}
          rotation={wall.rotation}
        >
          <meshPhongMaterial color="#D2B48C" />
        </Box>
      ))}

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

      {/* Titre de la salle */}
      <Text
        position={[0, 4, -7.5]}
        fontSize={0.5}
        color="#8B4513"
        anchorX="center"
        anchorY="middle"
      >
        {tSync(`Salle ${roomId}`)}
      </Text>
    </>
  );
}

// Composant principal
export default function VirtualMuseumTour({ currentRoom, onRoomChange }) {
  const router = useRouter();
  const { artworks } = useArtworks();
  const { tSync } = useTranslation();

  const handleArtworkClick = (artwork) => {
    router.push(`/artwork/${artwork.id || artwork._id}`);
  };

  return (
    <div className="w-full h-screen">
      <Suspense fallback={
        <div className="w-full h-screen bg-gradient-to-br from-amber-900 to-orange-900 flex items-center justify-center">
          <div className="text-center text-white">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-amber-300 mx-auto mb-6"></div>
            <h2 className="text-2xl font-bold">{tSync('Chargement de la visite 3D...')}</h2>
          </div>
        </div>
      }>
        <Canvas
          camera={{ position: [0, 2, 8], fov: 75 }}
          gl={{ antialias: true, alpha: false }}
        >
          {/* Éclairage */}
          <ambientLight intensity={0.4} />
          <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
          <pointLight position={[-10, 10, -10]} intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={0.5} />

          {/* Contrôles de caméra */}
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            maxPolarAngle={Math.PI/2}
            minDistance={3}
            maxDistance={15}
          />

          {/* Salle du musée */}
          <MuseumRoom
            roomId={currentRoom}
            artworks={artworks}
            onArtworkClick={handleArtworkClick}
          />
        </Canvas>
      </Suspense>
    </div>
  );
}