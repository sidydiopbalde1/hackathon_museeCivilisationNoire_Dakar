'use client';

import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import ArtworkCard from '@/components/ArtworkCard';
import HeroCarousel from '@/components/HeroCarousel';
import EventsCarousel from '@/components/EventsCarousel';
import WeeklyStory from '@/components/WeeklyStory';
import HistoryOfTheWeek from '@/components/HistoryOfTheWeek';
import HomePageSkeleton from '@/components/skeletons/HomePageSkeleton';
import { useTranslation } from '@/contexts/TranslationContext';
import StoriesCarousel from '@/components/StoriesCarousel';

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

        {/* Colonne de droite : Story de la semaine + Histoire de la semaine (3 colonnes) */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          {/* Story de la Semaine */}
          <div>
            <h2 className="text-lg font-bold text-amber-900 mb-4 px-1">
              {tSync('Stories de la semaine')}
            </h2>
          <StoriesCarousel />
          </div>

          {/* Histoire de la Semaine */}
            <WeeklyStory />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Featured Artworks */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-amber-900">
              {tSync('Œuvres en vedette')}
            </h2>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/musee-immersif"
                className="flex items-center gap-2 bg-gradient-to-r from-amber-600 to-orange-700 text-white px-5 py-2.5 rounded-xl font-semibold hover:from-amber-700 hover:to-orange-800 transition-all duration-200 shadow-lg hover:shadow-xl text-sm"
              >
                🎮 {tSync('Exploration FPS')}
              </Link>
              <Link
                href="/collection"
                className="flex items-center gap-2 bg-gradient-to-r from-amber-600 to-orange-700 text-white px-5 py-2.5 rounded-xl font-semibold hover:from-amber-700 hover:to-orange-800 transition-all duration-200 shadow-lg hover:shadow-xl text-sm"
              >
                {tSync('Collection')}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>

          {artworks.length > 0 ? (
            <div className="grid md:grid-cols-4 gap-6">
              {artworks.slice(0, 4).map((artwork) => (
                <ArtworkCard key={artwork.id || artwork._id} artwork={artwork} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-xl">
              <div className="text-6xl mb-4">🏛️</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                {tSync('Collection en construction')}
              </h3>
              <p className="text-gray-500 mb-6">
                {tSync('Les œuvres seront bientôt disponibles')}
              </p>
              <Link
                href="/collection"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-600 to-orange-700 text-white px-6 py-3 rounded-xl font-semibold hover:from-amber-700 hover:to-orange-800 transition-all"
              >
                {tSync('Explorer maintenant')}
              </Link>
            </div>
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