'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Heart, Share2, ArrowLeft, Play, Pause, Loader2 } from 'lucide-react';

export default function ArtworkDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [artwork, setArtwork] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [currentLang, setCurrentLang] = useState('fr');

  useEffect(() => {
    fetchArtwork();
  }, [params.id]);

  const fetchArtwork = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/artwork/${params.id}`);
      
      if (!response.ok) {
        throw new Error('Œuvre non trouvée');
      }

      const data = await response.json();
      setArtwork(data);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: artwork.title[currentLang],
          text: `Découvrez ${artwork.title[currentLang]} au Musée des Civilisations Noires`,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Partage annulé');
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Lien copié dans le presse-papier !');
    }
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // TODO: Sauvegarder dans la DB
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-amber-600 mx-auto mb-4" />
          <p className="text-gray-600">Chargement de l'œuvre...</p>
        </div>
      </div>
    );
  }

  if (!artwork) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Œuvre non trouvée
        </h1>
        <button
          onClick={() => router.push('/')}
          className="text-amber-700 hover:text-amber-900 font-semibold"
        >
          Retour à l'accueil
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="mb-6 text-amber-700 hover:text-amber-900 flex items-center gap-2 font-semibold transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Retour
      </button>

      {/* Main Card */}
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Image */}
        <div className="relative h-96 w-full">
          <Image
            src={artwork.imageUrl}
            alt={artwork.title[currentLang]}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Title and Actions */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {artwork.title[currentLang]}
              </h1>
              <p className="text-lg text-gray-600">{artwork.id}</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={toggleFavorite}
                className={`p-3 rounded-full transition-all ${
                  isFavorite
                    ? 'bg-red-600 text-white'
                    : 'bg-red-100 text-red-600 hover:bg-red-200'
                }`}
              >
                <Heart className="w-6 h-6" fill={isFavorite ? 'currentColor' : 'none'} />
              </button>
              <button
                onClick={handleShare}
                className="p-3 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-all"
              >
                <Share2 className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Metadata Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-amber-50 p-4 rounded-xl">
              <p className="text-sm text-gray-600 mb-1">Période</p>
              <p className="font-semibold text-gray-900">{artwork.period}</p>
            </div>
            <div className="bg-amber-50 p-4 rounded-xl">
              <p className="text-sm text-gray-600 mb-1">Origine</p>
              <p className="font-semibold text-gray-900">{artwork.origin}</p>
            </div>
            <div className="bg-amber-50 p-4 rounded-xl">
              <p className="text-sm text-gray-600 mb-1">Matériau</p>
              <p className="font-semibold text-gray-900">{artwork.material}</p>
            </div>
            <div className="bg-amber-50 p-4 rounded-xl">
              <p className="text-sm text-gray-600 mb-1">Dimensions</p>
              <p className="font-semibold text-gray-900">{artwork.dimensions}</p>
            </div>
          </div>

          {/* Description */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              À propos de cette œuvre
            </h2>
            <p className="text-gray-700 leading-relaxed text-lg">
              {artwork.description[currentLang]}
            </p>
          </div>

          {/* Audio Player Placeholder */}
          <div className="bg-gradient-to-r from-amber-600 to-orange-700 text-white p-6 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-lg">Description audio</p>
                <p className="text-amber-100 text-sm">{artwork.title[currentLang]}</p>
              </div>
              <button className="p-4 bg-white text-amber-700 rounded-full hover:bg-gray-100 transition-all">
                <Play className="w-8 h-8" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}