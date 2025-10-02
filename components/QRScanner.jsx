'use client';

import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Camera, X, AlertCircle, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function QRScanner({ onClose }) {
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const html5QrCodeRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    startScanner();

    return () => {
      stopScanner();
    };
  }, []);

  const startScanner = async () => {
    try {
      const html5QrCode = new Html5Qrcode('qr-reader');
      html5QrCodeRef.current = html5QrCode;

      await html5QrCode.start(
        { facingMode: 'environment' }, // Caméra arrière sur mobile
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
        },
        onScanSuccess,
        onScanFailure
      );

      setScanning(true);
      setError(null);
    } catch (err) {
      console.error('Scanner error:', err);
      setError('Impossible d\'accéder à la caméra. Veuillez vérifier les permissions.');
    }
  };

  const stopScanner = async () => {
    if (html5QrCodeRef.current) {
      try {
        await html5QrCodeRef.current.stop();
        html5QrCodeRef.current.clear();
      } catch (err) {
        console.error('Error stopping scanner:', err);
      }
    }
  };

  const onScanSuccess = (decodedText) => {
    console.log('QR Code détecté:', decodedText);
    
    // Vérifier si c'est un code MCN valide (MCN001, MCN002, etc.)
    if (decodedText.startsWith('MCN')) {
      setSuccess(`Œuvre ${decodedText} détectée !`);
      
      // Arrêter le scan
      stopScanner();
      
      // Rediriger après 1 seconde
      setTimeout(() => {
        router.push(`/artwork/${decodedText}`);
      }, 1000);
    } else {
      // Si le QR code contient une URL complète
      const urlMatch = decodedText.match(/\/artwork\/(MCN\d+)/);
      if (urlMatch) {
        const artworkId = urlMatch[1];
        setSuccess(`Œuvre ${artworkId} détectée !`);
        stopScanner();
        setTimeout(() => {
          router.push(`/artwork/${artworkId}`);
        }, 1000);
      } else {
        setError('QR Code non reconnu. Utilisez un QR code MCN.');
      }
    }
  };

  const onScanFailure = (error) => {
    // Ignorer les erreurs normales de scan (pas de QR code détecté)
    if (!error.includes('NotFoundException')) {
      console.warn('Scan error:', error);
    }
  };

  const handleClose = async () => {
    await stopScanner();
    onClose();
  };

  const simulateScan = async () => {
    await stopScanner();
    setSuccess('Mode démo : redirection vers MCN001...');
    setTimeout(() => {
      router.push('/artwork/MCN001');
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-95 z-50 flex flex-col items-center justify-center p-4">
      {/* Header */}
      <div className="w-full max-w-md mb-6 flex justify-between items-center">
        <h2 className="text-white text-xl font-bold">Scanner un QR Code</h2>
        <button
          onClick={handleClose}
          className="text-white hover:text-gray-300 transition-colors p-2"
        >
          <X className="w-8 h-8" />
        </button>
      </div>

      {/* Scanner Area */}
      <div className="w-full max-w-md bg-white rounded-2xl overflow-hidden shadow-2xl mb-6">
        <div id="qr-reader" className="w-full"></div>
      </div>

      {/* Success Message */}
      {success && (
        <div className="max-w-md bg-green-100 border border-green-400 text-green-700 px-6 py-4 rounded-lg flex items-start gap-3 mb-4">
          <CheckCircle className="w-6 h-6 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">{success}</p>
            <p className="text-sm">Redirection en cours...</p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="max-w-md bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg flex items-start gap-3 mb-4">
          <AlertCircle className="w-6 h-6 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Erreur</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Instructions */}
      {scanning && !error && !success && (
        <div className="text-center text-white mb-6">
          <Camera className="w-12 h-12 mx-auto mb-3 animate-pulse" />
          <p className="text-lg mb-2">Pointez votre caméra vers le QR code</p>
          <p className="text-sm text-gray-400">
            Le scan se fera automatiquement
          </p>
        </div>
      )}

      {/* Demo Button */}
      <button
        onClick={simulateScan}
        className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-4 rounded-xl font-semibold transition-all shadow-lg"
      >
        🎬 Mode Démo (Scanner MCN001)
      </button>

      {/* Help Text */}
      <p className="text-gray-400 text-sm mt-4 text-center max-w-md">
        Assurez-vous d'avoir autorisé l'accès à la caméra dans les paramètres de votre navigateur
      </p>
    </div>
  );
}