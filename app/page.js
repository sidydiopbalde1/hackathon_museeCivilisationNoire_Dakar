'use client';

import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import ArtworkCard from '@/components/ArtworkCard';
import HeroCarousel from '@/components/HeroCarousel';
import EventsCarousel from '@/components/EventsCarousel';
import StoriesCarousel from '@/components/StoriesCarousel';
import HomePageSkeleton from '@/components/skeletons/HomePageSkeleton';
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
    return <HomePageSkeleton />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
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
    <>
      {/* Section Hero : Événements à gauche + Carousel au centre + Stories à droite */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 mb-8 px-4 lg:px-8 pt-8">
        {/* Carousel Événements Vertical - À gauche (3 colonnes) */}
        <div className="lg:col-span-3">
          <EventsCarousel />
        </div>

        {/* Hero Carousel - Au centre (6 colonnes) */}
        <div className="lg:col-span-6">
          <HeroCarousel />
        </div>

        {/* Stories Carousel - À droite (3 colonnes) */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl p-4 shadow-lg h-[200px]">
            <h2 className="text-lg font-bold text-amber-900 mb-4">
              {tSync('Histoires de la semaine')}
            </h2>
            <div className="flex flex-col gap-2 overflow-y-auto h-[420px]">
              <StoriesCarousel vertical={true} />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
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
    </>
  );
}