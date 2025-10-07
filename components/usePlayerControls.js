import { useEffect, useState } from "react";

const moveFieldByKey = (key) => {
  const keys = { 
    KeyW: "forward",
    KeyS: "backward",
    KeyA: "left",
    KeyD: "right", 
    Space: "jump",
    ShiftLeft: "speed",
    KeyF: "fly" // Touche F pour le mode vol
  };
  return keys[key];
};

const usePlayerControls = () => {
  const [movement, setMovement] = useState({
    forward: false,
    backward: false,
    left: false,
    right: false,
    jump: false,
    fly: false,
    speed: 5 // Vitesse de base plus adaptée au musée
  });

  useEffect(() => {        
    const handleKeyDown = (e) => {
      // Empêcher le comportement par défaut pour certaines touches
      if (['Space', 'KeyW', 'KeyA', 'KeyS', 'KeyD'].includes(e.code)) {
        e.preventDefault();
      }

      switch(e.code) {
        case "KeyW": // avant
        case "KeyA": // gauche           
        case "KeyS": // arrière           
        case "KeyD": // droite    
        case "Space": // saut/vol
        case "KeyF": // mode vol
          setMovement((m) => ({
            ...m, 
            [moveFieldByKey(e.code)]: true 
          }));
          return;
        case "ShiftLeft": // courir
          setMovement((m) => ({ 
            ...m, 
            speed: 12 // Vitesse de course
          }));
          return;              
        default: 
          return;
      }
    };

    const handleKeyUp = (e) => {
      switch(e.code) {
        case "KeyW": // avant
        case "KeyA": // gauche           
        case "KeyS": // arrière           
        case "KeyD": // droite    
        case "Space": // saut/vol
        case "KeyF": // mode vol
          setMovement((m) => ({
            ...m, 
            [moveFieldByKey(e.code)]: false 
          }));
          return;
        case "ShiftLeft": // arrêter de courir
          setMovement((m) => ({ 
            ...m, 
            speed: 5 // Retour à la vitesse normale
          }));
          return;
        default: 
          return;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return movement;
};

export default usePlayerControls;