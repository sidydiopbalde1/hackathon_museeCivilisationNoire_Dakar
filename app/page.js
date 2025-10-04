'use client';

import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import ArtworkCard from '@/components/ArtworkCard';
import HeroCarousel from '@/components/HeroCarousel';
import { useTranslation } from '@/contexts/TranslationContext';

export default function HomePage() {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { tSync } = useTranslation();

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
          <p className="text-gray-600">{tSync('Chargement des œuvres...')}</p>
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
            {tSync('Réessayer')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Hero Carousel */}
      <HeroCarousel />


      {/* Featured Artworks */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-amber-900">
            {tSync('Œuvres en vedette')}
          </h2>
          <Link 
            href="/collection"
            className="text-amber-700 hover:text-amber-900 font-semibold"
          >
            {tSync('Voir tout')} →
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
            {tSync('Aucune œuvre disponible pour le moment')}
          </p>
        )}
      </section>

      {/* About Section */}
      <section className="mt-16 bg-white rounded-2xl p-8 shadow-lg">
        <h2 className="text-3xl font-bold text-amber-900 mb-4">
          {tSync('À propos du Musée')}
        </h2>
        <p className="text-gray-700 text-lg leading-relaxed mb-4">
          {tSync('Le Musée des Civilisations Noires est l\'un des plus grands espaces culturels du Sénégal et d\'Afrique. Il abrite une richesse patrimoniale inestimable dédiée à la préservation et à la valorisation des civilisations africaines.')}
        </p>
        <p className="text-gray-700 text-lg leading-relaxed">
          {tSync('Grâce à cette plateforme digitale, nous rendons accessible notre collection au monde entier, offrant une expérience enrichie et interactive autour de nos œuvres exceptionnelles.')}
        </p>
      </section>
    </div>
  );
}