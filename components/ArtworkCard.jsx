import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Clock, Edit, Trash2, QrCode } from 'lucide-react';
import { useState } from 'react';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import QRCodeGenerator from '@/components/QRCodeGenerator';
import { useTranslation } from '@/contexts/TranslationContext';

export default function ArtworkCard({ artwork, isAdmin, onDelete, onEdit }) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { tSync, currentLang } = useTranslation();

  const handleDeleteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(artwork.id || artwork._id);
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCloseModal = () => {
    if (!isDeleting) {
      setShowDeleteModal(false);
    }
  };

  const handleEdit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onEdit) {
      onEdit(artwork.id || artwork._id);
    }
  };

  const handleQRClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };
  return (
    <Link href={`/artwork/${artwork.id}`}>
      <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all cursor-pointer transform hover:scale-105">
        <div className="relative h-48 w-full">
          <Image
            src={artwork.imageUrl}
            alt={artwork.title?.fr || artwork.title_fr || 'Artwork'}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          
          {isAdmin && (
            <div className="absolute top-2 right-2 flex gap-2">
              <div onClick={handleQRClick}>
                <QRCodeGenerator 
                  artwork={artwork} 
                  iconOnly={true}
                  className="!bg-amber-600 hover:!bg-amber-700 !p-2 !text-white !rounded-lg shadow-lg transition-all duration-200 hover:scale-110"
                />
              </div>
              
              <button
                onClick={handleEdit}
                className="bg-amber-600 hover:bg-amber-700 text-white p-2 rounded-lg shadow-lg transition-all duration-200 hover:scale-110"
                title="Modifier cette œuvre"
              >
                <Edit className="w-4 h-4" />
              </button>
              
              <button
                onClick={handleDeleteClick}
                className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg shadow-lg transition-all duration-200 hover:scale-110"
                title={tSync('Supprimer cette œuvre')}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
        
        <div className="p-4">
          <h3 className="font-bold text-gray-900 mb-2 line-clamp-1">
            {artwork.title?.fr || artwork.title_fr}
          </h3>
          
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            <span className="line-clamp-1">{artwork.origin}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="w-4 h-4 flex-shrink-0" />
            <span className="line-clamp-1">{artwork.period}</span>
          </div>
        </div>
      </div>
      
      {/* Modal de confirmation de suppression */}
      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
        artworkTitle={artwork.title?.[currentLang] || artwork.title?.fr || artwork.title_fr}
        isLoading={isDeleting}
      />
    </Link>
  );
}