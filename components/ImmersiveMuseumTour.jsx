'use client';

import { Suspense, useState, useEffect, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  PointerLockControls, 
  Box, 
  Plane, 
  Text, 
  Stars,
  Sky,
  Html
} from '@react-three/drei';
import { Physics } from '@react-three/cannon';
import * as THREE from 'three';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/contexts/TranslationContext';
import { useArtworks } from '@/contexts/ArtworkContext';
import { ArrowLeft, Info, Eye, Maximize } from 'lucide-react';

// Hook pour les contrôles du joueur
function usePlayerControls() {
  const [movement, setMovement] = useState({
    forward: false,
    backward: false,
    left: false,
    right: false,
    jump: false,
    run: false,
    fly: false
  });

  useEffect(() => {
    const handleKeyDown = (e) => {
      switch(e.code) {
        case 'KeyW': setMovement(m => ({ ...m, forward: true })); break;
        case 'KeyS': setMovement(m => ({ ...m, backward: true })); break;
        case 'KeyA': setMovement(m => ({ ...m, left: true })); break;
        case 'KeyD': setMovement(m => ({ ...m, right: true })); break;
        case 'Space': setMovement(m => ({ ...m, jump: true, fly: true })); break;
        case 'ShiftLeft': setMovement(m => ({ ...m, run: true })); break;
      }
    };

    const handleKeyUp = (e) => {
      switch(e.code) {
        case 'KeyW': setMovement(m => ({ ...m, forward: false })); break;
        case 'KeyS': setMovement(m => ({ ...m, backward: false })); break;
        case 'KeyA': setMovement(m => ({ ...m, left: false })); break;
        case 'KeyD': setMovement(m => ({ ...m, right: false })); break;
        case 'Space': setMovement(m => ({ ...m, jump: false, fly: false })); break;
        case 'ShiftLeft': setMovement(m => ({ ...m, run: false })); break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return movement;
}

// Composant Player avec mouvement FPS simple
function Player() {
  const { camera } = useThree();
  const controls = usePlayerControls();
  const velocity = useRef(new THREE.Vector3(0, 0, 0));
  const position = useRef(new THREE.Vector3(0, 2, 10));

  useFrame((state, delta) => {
    const frontVector = new THREE.Vector3(0, 0, Number(controls.backward) - Number(controls.forward));
    const sideVector = new THREE.Vector3(Number(controls.left) - Number(controls.right), 0, 0);
    
    const direction = new THREE.Vector3();
    const speed = controls.run ? 12 : 6;
    
    direction
      .subVectors(frontVector, sideVector)
      .normalize()
      .multiplyScalar(speed * delta)
      .applyEuler(camera.rotation);
    
    // Mouvement horizontal
    position.current.add(direction);
    
    // Saut/Vol
    if (controls.jump || controls.fly) {
      position.current.y += speed * delta;
    }
    
    // Gravité simple
    if (!controls.fly && !controls.jump) {
      position.current.y = Math.max(2, position.current.y - 9.8 * delta);
    }
    
    // Limites du musée (permettre de s'approcher plus près des murs)
    position.current.x = Math.max(-49, Math.min(49, position.current.x));
    position.current.z = Math.max(-49, Math.min(49, position.current.z));
    position.current.y = Math.max(0.5, Math.min(15, position.current.y));
    
    camera.position.copy(position.current);
  });

  return null;
}

// Composant pour les murs du musée
function MuseumWalls() {
  return (
    <>
      {/* Sol */}
      <Plane 
        args={[100, 100]} 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, 0, 0]}
        receiveShadow
      >
        <meshStandardMaterial color="#8B4513" />
      </Plane>
      
      {/* Plafond */}
      <Plane 
        args={[100, 100]} 
        rotation={[Math.PI / 2, 0, 0]} 
        position={[0, 8, 0]}
      >
        <meshStandardMaterial color="#DEB887" />
      </Plane>

      {/* Murs */}
      <Box args={[100, 8, 0.5]} position={[0, 4, -50]}>
        <meshStandardMaterial color="#D2B48C" />
      </Box>
      <Box args={[100, 8, 0.5]} position={[0, 4, 50]}>
        <meshStandardMaterial color="#D2B48C" />
      </Box>
      <Box args={[0.5, 8, 100]} position={[-50, 4, 0]}>
        <meshStandardMaterial color="#D2B48C" />
      </Box>
      <Box args={[0.5, 8, 100]} position={[50, 4, 0]}>
        <meshStandardMaterial color="#D2B48C" />
      </Box>
    </>
  );
}

// Composant pour une œuvre avec cadre
function ArtworkFrame({ artwork, position, rotation = [0, 0, 0], onSelect }) {
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  
  return (
    <group position={position} rotation={rotation}>
      {/* Cadre */}
      <Box 
        args={[3.2, 4.2, 0.2]}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(artwork);
        }}
        castShadow
      >
        <meshStandardMaterial 
          color={hovered ? "#f59e0b" : "#8b4513"} 
          metalness={0.3}
          roughness={0.7}
        />
      </Box>
      
      {/* Image de l'œuvre */}
      <Plane args={[2.8, 3.8]} position={[0, 0, 0.11]}>
        <meshStandardMaterial>
          {artwork.imageUrl && (
            <primitive 
              object={new THREE.TextureLoader().load(artwork.imageUrl)} 
              attach="map" 
            />
          )}
        </meshStandardMaterial>
      </Plane>
      
      {/* Plaque descriptive */}
      <Box args={[2.5, 0.3, 0.05]} position={[0, -2.5, 0.15]}>
        <meshStandardMaterial color="#8B4513" />
      </Box>
      
      {/* Texte de l'œuvre */}
      <Text
        position={[0, -2.5, 0.2]}
        fontSize={0.15}
        color="white"
        anchorX="center"
        anchorY="middle"
        maxWidth={2.2}
      >
        {artwork.title?.fr || 'Sans titre'}
      </Text>
      
      {/* Éclairage spot */}
      <spotLight
        position={[0, 3, 1]}
        angle={0.3}
        penumbra={0.5}
        intensity={2}
        color="#FFA500"
        target-position={[0, 0, 0]}
        castShadow
      />
      
      {/* Info au survol */}
      {hovered && (
        <Html position={[0, 3, 0]} center>
          <div className="bg-black/80 text-white px-3 py-2 rounded-lg text-center max-w-60">
            <h3 className="font-bold text-sm mb-1">{artwork.title?.fr}</h3>
            <p className="text-xs opacity-80">{artwork.period}</p>
            <p className="text-xs text-amber-300 mt-1">Cliquez pour voir les détails</p>
          </div>
        </Html>
      )}
    </group>
  );
}

// Composant principal du musée immersif
function MuseumScene({ artworks, onArtworkSelect, nightMode }) {
  const artworkPositions = [
    // Mur du fond
    { pos: [-15, 3, -49.5], rot: [0, 0, 0] },
    { pos: [-5, 3, -49.5], rot: [0, 0, 0] },
    { pos: [5, 3, -49.5], rot: [0, 0, 0] },
    { pos: [15, 3, -49.5], rot: [0, 0, 0] },
    
    // Mur gauche
    { pos: [-49.5, 3, -15], rot: [0, Math.PI/2, 0] },
    { pos: [-49.5, 3, -5], rot: [0, Math.PI/2, 0] },
    { pos: [-49.5, 3, 5], rot: [0, Math.PI/2, 0] },
    { pos: [-49.5, 3, 15], rot: [0, Math.PI/2, 0] },
    
    // Mur droite
    { pos: [49.5, 3, -15], rot: [0, -Math.PI/2, 0] },
    { pos: [49.5, 3, -5], rot: [0, -Math.PI/2, 0] },
    { pos: [49.5, 3, 5], rot: [0, -Math.PI/2, 0] },
    { pos: [49.5, 3, 15], rot: [0, -Math.PI/2, 0] },
  ];

  return (
    <>
      {/* Environnement */}
      {nightMode ? (
        <>
          <Stars />
          <fog attach="fog" args={["#2C1810", 20, 80]} />
        </>
      ) : (
        <>
          <Sky sunPosition={[100, 20, 100]} />
          <fog attach="fog" args={["#F5DEB3", 30, 100]} />
        </>
      )}

      {/* Éclairage ambiant avec couleurs chaudes */}
      <ambientLight intensity={nightMode ? 0.2 : 0.4} color="#FFA500" />
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={nightMode ? 0.5 : 1} 
        color="#FFD700"
        castShadow 
      />

      {/* Structure du musée */}
      <MuseumWalls />

      {/* Œuvres d'art */}
      {artworks.slice(0, artworkPositions.length).map((artwork, index) => (
        <ArtworkFrame
          key={artwork.id || index}
          artwork={artwork}
          position={artworkPositions[index].pos}
          rotation={artworkPositions[index].rot}
          onSelect={onArtworkSelect}
        />
      ))}

      {/* Sol physique invisible */}
      <mesh position={[0, -0.5, 0]} visible={false}>
        <boxGeometry args={[100, 1, 100]} />
        <meshStandardMaterial />
      </mesh>
    </>
  );
}

// Interface utilisateur
function MuseumUI({ nightMode, onToggleNight, onExit, selectedArtwork, onCloseArtwork }) {
  const { tSync } = useTranslation();
  
  return (
    <>
      {/* Header */}
      <div className="absolute top-4 left-4 right-4 z-50 flex items-center justify-between">
        <button
          onClick={onExit}
          className="flex items-center gap-2 bg-black/80 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-black/90 transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
          {tSync('Quitter la visite')}
        </button>

        <div className="flex items-center gap-4">
          <button
            onClick={onToggleNight}
            className="bg-black/80 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-black/90 transition-all"
          >
            {nightMode ? '☀️ Jour' : '🌙 Nuit'}
          </button>
        </div>
      </div>

      {/* Instructions */}
      <div className="absolute bottom-4 left-4 z-50 bg-black/80 backdrop-blur-sm text-white p-4 rounded-lg max-w-sm">
        <h3 className="font-bold mb-2">{tSync('Contrôles')}</h3>
        <div className="text-sm space-y-1">
          <p><strong>WASD</strong> : Se déplacer</p>
          <p><strong>Souris</strong> : Regarder</p>
          <p><strong>Shift</strong> : Courir</p>
          <p><strong>Espace</strong> : Sauter/Voler</p>
          <p><strong>Clic</strong> : Sélectionner une œuvre</p>
        </div>
      </div>

      {/* Modal œuvre sélectionnée */}
      {selectedArtwork && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-amber-900">
                {selectedArtwork.title?.fr || 'Sans titre'}
              </h2>
              <button
                onClick={onCloseArtwork}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className="mb-4">
              <img 
                src={selectedArtwork.imageUrl} 
                alt={selectedArtwork.title?.fr}
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>
            
            <div className="space-y-2 text-sm">
              <p><strong>{tSync('Période')} :</strong> {selectedArtwork.period}</p>
              <p><strong>{tSync('Origine')} :</strong> {selectedArtwork.origin}</p>
              <p><strong>{tSync('Matériaux')} :</strong> {selectedArtwork.material}</p>
            </div>
            
            <button
              onClick={() => window.open(`/artwork/${selectedArtwork.id}`, '_blank')}
              className="w-full mt-4 bg-amber-600 hover:bg-amber-700 text-white py-2 rounded-lg transition-all"
            >
              <Eye className="w-4 h-4 inline mr-2" />
              {tSync('Voir en détail')}
            </button>
          </div>
        </div>
      )}
    </>
  );
}

// Composant principal
export default function ImmersiveMuseumTour() {
  const router = useRouter();
  const { artworks } = useArtworks();
  const [nightMode, setNightMode] = useState(false);
  const [selectedArtwork, setSelectedArtwork] = useState(null);

  return (
    <div className="w-full h-screen relative">
      <Canvas
        camera={{ fov: 75, position: [0, 2, 10] }}
        shadows
        gl={{ shadowMap: { enabled: true, type: THREE.PCFSoftShadowMap } }}
      >
        <Suspense fallback={null}>
          <Physics gravity={[0, -30, 0]}>
            <MuseumScene 
              artworks={artworks}
              onArtworkSelect={setSelectedArtwork}
              nightMode={nightMode}
            />
            <Player />
          </Physics>
        </Suspense>
        
        <PointerLockControls />
      </Canvas>

      <MuseumUI
        nightMode={nightMode}
        onToggleNight={() => setNightMode(!nightMode)}
        onExit={() => router.push('/')}
        selectedArtwork={selectedArtwork}
        onCloseArtwork={() => setSelectedArtwork(null)}
      />
    </div>
  );
}