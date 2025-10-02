'use client';

import { useState, useEffect } from 'react';
import { Camera, Grid3x3, Loader2 } from 'lucide-react';
import Link from 'next/link';
import ArtworkCard from '@/components/ArtworkCard';

export default function HomePage() {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchArtworks();
  }, []);

  const fetchArtworks = async () => {
    try {
      setLoading(true);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-amber-600 mx-auto mb-4" />
          <p className="text-gray-600">Chargement des œuvres...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">❌ {error}</p>
          <button
            onClick={fetchArtworks}
            className="bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition-all"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-amber-900 mb-4">
          Bienvenue au MCN
        </h1>
        <p className="text-xl text-gray-700">
          Explorez le patrimoine africain à travers le digital
        </p>
      </div>

      {/* Action Cards */}
      <div className="grid md:grid-cols-2 gap-6 mb-16">
        <Link href="/scan">
          <div className="bg-gradient-to-br from-amber-600 to-orange-700 text-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 cursor-pointer">
            <Camera className="w-16 h-16 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Scanner une œuvre</h2>
            <p className="text-amber-100">
              Scannez le QR code près d'une œuvre pour découvrir son histoire
            </p>
          </div>
        </Link>

        <Link href="/collection">
          <div className="bg-gradient-to-br from-red-600 to-pink-700 text-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 cursor-pointer">
            <Grid3x3 className="w-16 h-16 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Parcourir la collection</h2>
            <p className="text-pink-100">
              Explorez toutes les œuvres du musée depuis chez vous
            </p>
          </div>
        </Link>
      </div>

      {/* Featured Artworks */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-amber-900">
            Œuvres en vedette
          </h2>
          <Link 
            href="/collection"
            className="text-amber-700 hover:text-amber-900 font-semibold"
          >
            Voir tout →
          </Link>
        </div>
        
        {artworks.length > 0 ? (
          <div className="grid md:grid-cols-4 gap-6">
            {artworks.slice(0, 4).map((artwork) => (
              <ArtworkCard key={artwork.id || artwork._id} artwork={artwork} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-8">
            Aucune œuvre disponible pour le moment
          </p>
        )}
      </section>

      {/* About Section */}
      <section className="mt-16 bg-white rounded-2xl p-8 shadow-lg">
        <h2 className="text-3xl font-bold text-amber-900 mb-4">
          À propos du Musée
        </h2>
        <p className="text-gray-700 text-lg leading-relaxed mb-4">
          Le Musée des Civilisations Noires est l'un des plus grands espaces 
          culturels du Sénégal et d'Afrique. Il abrite une richesse patrimoniale 
          inestimable dédiée à la préservation et à la valorisation des civilisations 
          africaines.
        </p>
        <p className="text-gray-700 text-lg leading-relaxed">
          Grâce à cette plateforme digitale, nous rendons accessible notre 
          collection au monde entier, offrant une expérience enrichie et interactive 
          autour de nos œuvres exceptionnelles.
        </p>
      </section>
    </div>
  );
}