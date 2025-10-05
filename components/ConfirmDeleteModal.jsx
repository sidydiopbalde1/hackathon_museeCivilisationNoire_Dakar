'use client';

import React from 'react';
import { AlertTriangle, X, Trash2 } from 'lucide-react';
import { useTranslation } from '@/contexts/TranslationContext';

export default function ConfirmDeleteModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  artworkTitle, 
  isLoading = false 
}) {
  const { tSync } = useTranslation();

  // Gérer la touche Échap pour fermer le modal
  useEscapeKey(onClose, isOpen);

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
        {/* Header avec icône d'alerte */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">
              {tSync('Confirmer la suppression')}
            </h2>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenu */}
        <div className="mb-6">
          <p className="text-gray-700 mb-4">
            {tSync('Êtes-vous sûr de vouloir supprimer cette œuvre ?')}
          </p>
          
          {artworkTitle && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-amber-800 font-semibold">
                "{artworkTitle}"
              </p>
            </div>
          )}
          
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm font-medium mb-1">
              ⚠️ {tSync('Attention')}
            </p>
            <p className="text-red-600 text-sm">
              {tSync('Cette action est irréversible. L\'œuvre sera définitivement supprimée de la base de données.')}
            </p>
          </div>
        </div>

        {/* Boutons d'action */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {tSync('Annuler')}
          </button>
          
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                {tSync('Suppression...')}
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                {tSync('Supprimer définitivement')}
              </>
            )}
          </button>
        </div>

        {/* Message d'aide */}
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            {tSync('Appuyez sur Échap pour annuler')}
          </p>
        </div>
      </div>
    </div>
  );
}

// Hook pour gérer la touche Échap
export function useEscapeKey(callback, isOpen) {
  React.useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape' && isOpen) {
        callback();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [callback, isOpen]);
}