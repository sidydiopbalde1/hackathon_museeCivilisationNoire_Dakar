'use client';

import { useRouter } from 'next/navigation';
import { Camera, X } from 'lucide-react';
import { useState } from 'react';

export default function ScanPage() {
  const router = useRouter();
  const [scanning, setScanning] = useState(true);

  const simulateScan = () => {
    // Pour la démo, on redirige vers MCN001
    router.push('/artwork/MCN001');
  };

  const handleClose = () => {
    router.push('/');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-95 z-50 flex flex-col items-center justify-center p-4">
      {/* Header */}
      <div className="w-full max-w-md mb-6 flex justify-between items-center">
        <h2 className="text-white text-xl font-bold">Scanner un QR Code</h2>
        <button
          onClick={handleClose}
          className="text-white hover:text-gray-300 transition-colors"
        >
          <X className="w-8 h-8" />
        </button>
      </div>

      {/* Scanner Area */}
      <div className="w-full max-w-md bg-gray-800 rounded-2xl overflow-hidden shadow-2xl mb-6" style={{ height: '400px' }}>
        <div className="w-full h-full flex items-center justify-center">
          <Camera className="w-24 h-24 text-gray-600" />
        </div>
      </div>

      {/* Instructions */}
      <div className="text-center text-white mb-6">
        <Camera className="w-12 h-12 mx-auto mb-3 animate-pulse" />
        <p className="text-lg mb-2">Pointez votre caméra vers le QR code</p>
        <p className="text-sm text-gray-400">
          Le scan se fera automatiquement
        </p>
      </div>

      {/* Demo Button */}
      <button
        onClick={simulateScan}
        className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-4 rounded-xl font-semibold transition-all shadow-lg"
      >
        🎬 Mode Démo (Scanner MCN001)
      </button>

      <p className="text-gray-400 text-sm mt-4">
        Scanner QR réel à venir avec html5-qrcode
      </p>
    </div>
  );
}