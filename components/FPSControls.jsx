'use client';

import { useEffect, useRef } from 'react';
import { extend, useThree } from '@react-three/fiber';
import { PointerLockControls as PointerLockControlsImpl } from 'three/examples/jsm/controls/PointerLockControls';

extend({ PointerLockControlsImpl });

const FPSControls = (props) => {
  const { camera, gl } = useThree();
  const controls = useRef();

  useEffect(() => {
    const handleClick = () => {
      if (controls.current) {
        controls.current.lock();
      }
    };

    // Instructions pour l'utilisateur
    const instructions = document.createElement('div');
    instructions.innerHTML = `
      <div style="
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0,0,0,0.8);
        color: white;
        padding: 20px;
        border-radius: 10px;
        text-align: center;
        font-family: Arial, sans-serif;
        z-index: 1000;
        pointer-events: none;
      ">
        <h3>Contrôles FPS</h3>
        <p>Cliquez pour capturer la souris</p>
        <p>WASD : Se déplacer</p>
        <p>Souris : Regarder autour</p>
        <p>SHIFT : Courir</p>
        <p>ESPACE : Sauter/Voler</p>
        <p>N : Jour/Nuit</p>
        <p>P : Mode Performance</p>
        <p>ESC : Libérer la souris</p>
      </div>
    `;
    
    const instructionsDiv = instructions.firstChild;
    document.body.appendChild(instructionsDiv);

    // Masquer les instructions après quelques secondes
    setTimeout(() => {
      if (instructionsDiv.parentNode) {
        instructionsDiv.parentNode.removeChild(instructionsDiv);
      }
    }, 5000);

    document.addEventListener('click', handleClick);
    
    return () => {
      document.removeEventListener('click', handleClick);
      if (instructionsDiv.parentNode) {
        instructionsDiv.parentNode.removeChild(instructionsDiv);
      }
    };
  }, []);

  return (
    <pointerLockControlsImpl
      ref={controls}
      args={[camera, gl.domElement]}
      {...props}
    />
  );
};

export default FPSControls;