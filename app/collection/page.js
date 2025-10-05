'use client';

import { useState, useEffect } from 'react';
import ArtworkCard from '@/components/ArtworkCard';
import AddArtworkModal from '@/components/AddArtworkModal';
import EditArtworkModal from '@/components/EditArtworkModal';
import { Search, Filter, Loader2, Plus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useArtworks } from '@/contexts/ArtworkContext';
import Link from 'next/link';

export default function CollectionPage() {
  const [filteredArtworks, setFilteredArtworks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrigin, setSelectedOrigin] = useState('');
  const [origins, setOrigins] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingArtworkId, setEditingArtworkId] = useState(null);
  
  const { user, isAuthenticated } = useAuth();
  const { artworks, loading, addArtwork, deleteArtwork } = useArtworks();
  
  const isAdmin = isAuthenticated && user?.role === 'admin';

  useEffect(() => {
    filterArtworks();
  }, [searchQuery, selectedOrigin, artworks]);

  useEffect(() => {
    // Extraire les origines uniques quand les artworks changent
    const uniqueOrigins = [...new Set(artworks.map(art => art.origin))].sort();
    setOrigins(uniqueOrigins);
  }, [artworks]);

  const filterArtworks = () => {
    let filtered = artworks;

    if (searchQuery) {
      filtered = filtered.filter((artwork) => {
        const title = artwork.title?.fr || '';
        const origin = artwork.origin || '';
        const period = artwork.period || '';
        
        return (
          title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
          period.toLowerCase().includes(searchQuery.toLowerCase())
        );
      });
    }

    if (selectedOrigin) {
      filtered = filtered.filter(artwork => artwork.origin === selectedOrigin);
    }

    setFilteredArtworks(filtered);
  };

  const handleDeleteArtwork = async (artworkId) => {
    try {
      await deleteArtwork(artworkId);
    } catch (error) {
      alert('Erreur lors de la suppression de l\'œuvre');
    }
  };

  const handleAddArtwork = async (artworkData) => {
    try {
      await addArtwork(artworkData);
    } catch (error) {
      alert('Erreur lors de l\'ajout de l\'œuvre');
      throw error;
    }
  };

  const handleEditArtwork = (artworkId) => {
    setEditingArtworkId(artworkId);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingArtworkId(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-amber-600 mx-auto mb-4" />
          <p className="text-gray-600">Chargement de la collection...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-4xl font-bold text-amber-900">
            Collection complète
          </h1>
          {isAdmin && (
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-amber-600 to-orange-700 text-white px-6 py-3 rounded-xl font-semibold hover:from-amber-700 hover:to-orange-800 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Plus className="w-5 h-5" />
              Ajouter une œuvre
            </button>
          )}
        </div>
        <p className="text-gray-700 text-lg">
          Explorez les {artworks.length} œuvres exceptionnelles du musée
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-lg mb-8">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher par titre, origine ou période..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-gray-200 focus:border-amber-500 focus:outline-none text-gray-900"
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={selectedOrigin}
              onChange={(e) => setSelectedOrigin(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-gray-200 focus:border-amber-500 focus:outline-none text-gray-900 cursor-pointer"
            >
              <option value="">Toutes les origines</option>
              {origins.map(origin => (
                <option key={origin} value={origin}>{origin}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <p className="mb-6 text-gray-600">
        {filteredArtworks.length} résultat{filteredArtworks.length > 1 ? 's' : ''}
      </p>

      {filteredArtworks.length > 0 ? (
        <div className="grid md:grid-cols-3 gap-8">
          {filteredArtworks.map((artwork) => (
            <ArtworkCard 
              key={artwork.id || artwork._id} 
              artwork={artwork} 
              isAdmin={isAdmin}
              onDelete={handleDeleteArtwork}
              onEdit={handleEditArtwork}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-xl">
          <p className="text-gray-500 text-lg">Aucune œuvre trouvée</p>
        </div>
      )}

      {/* Add Artwork Modal */}
      <AddArtworkModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddArtwork}
      />

      {/* Edit Artwork Modal */}
      <EditArtworkModal
        isOpen={showEditModal}
        onClose={handleCloseEditModal}
        artworkId={editingArtworkId}
      />
    </div>
  );
}