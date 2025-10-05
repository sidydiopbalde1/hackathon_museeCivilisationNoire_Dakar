'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const ArtworkContext = createContext({});

export function ArtworkProvider({ children }) {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchArtworks();
  }, []);

  const fetchArtworks = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/artworks');
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des œuvres');
      }

      const data = await response.json();
      setArtworks(data);
    } catch (err) {
      setError(err.message);
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  const addArtwork = async (artworkData) => {
    try {
      const response = await fetch('/api/artworks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(artworkData),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'ajout');
      }

      const newArtwork = await response.json();
      
      // Mettre à jour l'état local
      setArtworks(prev => [newArtwork, ...prev]);
      
      return newArtwork;
    } catch (error) {
      console.error('Erreur:', error);
      throw error;
    }
  };

  const updateArtwork = async (artworkId, artworkData) => {
    try {
      const response = await fetch(`/api/artworks/${artworkId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(artworkData),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la modification');
      }

      const updatedArtwork = await response.json();
      
      // Mettre à jour l'état local
      setArtworks(prev => 
        prev.map(artwork => 
          (artwork.id || artwork._id) === artworkId ? updatedArtwork : artwork
        )
      );
      
      return updatedArtwork;
    } catch (error) {
      console.error('Erreur:', error);
      throw error;
    }
  };

  const deleteArtwork = async (artworkId) => {
    try {
      const response = await fetch(`/api/artworks/${artworkId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression');
      }

      // Mettre à jour l'état local
      setArtworks(prev => 
        prev.filter(artwork => (artwork.id || artwork._id) !== artworkId)
      );
      
      return true;
    } catch (error) {
      console.error('Erreur:', error);
      throw error;
    }
  };

  const getArtworkById = (artworkId) => {
    return artworks.find(artwork => 
      (artwork.id || artwork._id) === artworkId
    );
  };

  const value = {
    artworks,
    loading,
    error,
    fetchArtworks,
    addArtwork,
    updateArtwork,
    deleteArtwork,
    getArtworkById
  };

  return (
    <ArtworkContext.Provider value={value}>
      {children}
    </ArtworkContext.Provider>
  );
}

export function useArtworks() {
  const context = useContext(ArtworkContext);
  if (!context) {
    throw new Error('useArtworks must be used within an ArtworkProvider');
  }
  return context;
}