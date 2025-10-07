'use client';

import { useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { useSphere } from '@react-three/cannon';
import * as THREE from 'three';
import FPSControls from './FPSControls';
import usePlayerControls from './usePlayerControls';

const FPSPlayer = ({ position = [0, 1.6, 5], ...props }) => {
  const { camera } = useThree();
  const { 
    forward, 
    backward, 
    left, 
    right, 
    jump, 
    speed,
    fly
  } = usePlayerControls();

  const [ref, api] = useSphere(() => ({ 
    mass: 1, 
    type: "Dynamic", 
    position: position,
    args: [0.5], // Rayon du joueur
    ...props
  }));

  const velocity = useRef([0, 0, 0]);
  
  useEffect(() => {
    api.velocity.subscribe(v => velocity.current = v);
  }, [api.velocity]);
  
  useFrame(() => {
    // Copie la position de la sphère physique vers la caméra
    camera.position.copy(ref.current.position);
    
    // Calcul des vecteurs de direction
    const frontVector = new THREE.Vector3(0, 0, Number(backward) - Number(forward));
    const sideVector = new THREE.Vector3(Number(left) - Number(right), 0, 0);
    
    const direction = new THREE.Vector3();
    direction
      .subVectors(frontVector, sideVector)
      .normalize()
      .multiplyScalar(speed)
      .applyEuler(camera.rotation);
    
    if (fly) {
      // Mode vol libre
      api.velocity.set(direction.x, direction.y, direction.z);
    } else {
      // Mode marche normale
      api.velocity.set(direction.x, velocity.current[1], direction.z);
      
      // Saut uniquement si on est au sol
      if (jump && Math.abs(velocity.current[1]) < 0.1) {
        api.velocity.set(velocity.current[0], 8, velocity.current[2]);
      }
    }
  });

  return (
    <>
      <FPSControls />
      <mesh ref={ref} visible={false}>
        <sphereGeometry args={[0.5]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
    </>
  );
};

export default FPSPlayer;