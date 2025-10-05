'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { Heart, Share2, ArrowLeft, Loader2, X } from 'lucide-react';
import AudioPlayer from '@/components/AudioPlayer';
import QRCodeGenerator from '@/components/QRCodeGenerator';
import { useTranslation } from '@/contexts/TranslationContext';
import { useAuth } from '@/contexts/AuthContext';

// Composant de chargement pour la vue 3D
const Loading3D = () => {
  const { tSync } = useTranslation();
  return (
    <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
        <p className="text-gray-500">{tSync('Chargement de la vue 3D...')}</p>
      </div>
    </div>
  );
};

// Import dynamique des composants pour éviter les erreurs SSR
const Artwork3DViewer = dynamic(() => import('@/components/Artwork3DViewer'), {
  ssr: false,
  loading: () => <Loading3D />
});


export default function ArtworkDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { tSync, currentLang } = useTranslation();
  const { user, isAuthenticated } = useAuth();
  const [artwork, setArtwork] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [view3D, setView3D] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  
  const isAdmin = isAuthenticated && user?.role === 'admin';

  useEffect(() => {
    if (params.id) {
      fetchArtwork();
    }
  }, [params.id]);

  const fetchArtwork = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/artworks/${params.id}`);
      
      if (!response.ok) {
        throw new Error(tSync('Œuvre non trouvée'));
      }

      const data = await response.json();
      setArtwork(data);
    } catch (error) {
      console.error(tSync('Erreur:'), error);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = () => {
    setShowShareModal(true);
  };

  const shareOnSocialMedia = (platform) => {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(artwork.title[currentLang]);
    const text = encodeURIComponent(`${tSync('Découvrez')} ${artwork.title[currentLang]} ${tSync('au Musée des Civilisations Noires')}`);
    
    let shareUrl = '';
    
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${text}%20${url}`;
        break;
      case 'instagram':
        // Instagram ne permet pas le partage direct via URL, on copie le lien
        navigator.clipboard.writeText(window.location.href);
        alert(tSync('Lien copié dans le presse-papier !'));
        setShowShareModal(false);
        return;
      default:
        return;
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=400');
    setShowShareModal(false);
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-amber-600 mx-auto mb-4" />
          <p className="text-gray-600">{tSync('Chargement de l\'œuvre...')}</p>
        </div>
      </div>
    );
  }

  if (!artwork) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {tSync('Œuvre non trouvée')}
        </h1>
        <button
          onClick={() => router.push('/')}
          className="text-amber-700 hover:text-amber-900 font-semibold"
        >
          {tSync('Retour à l\'accueil')}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <button
        onClick={() => router.back()}
        className="mb-6 text-amber-700 hover:text-amber-900 flex items-center gap-2 font-semibold transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        {tSync('Retour')}
      </button>

      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Toggle 2D/3D */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setView3D(false)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                !view3D 
                  ? 'bg-amber-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              📷 {tSync('Vue 2D')}
            </button>
            <button
              onClick={() => setView3D(true)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                view3D 
                  ? 'bg-amber-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              🎮 {tSync('Vue 3D')}
            </button>
            <p className="text-gray-500 text-sm ml-4">
              {view3D ? tSync('Cliquez et glissez pour explorer en 3D') : tSync('Image haute qualité de l\'œuvre')}
            </p>
          </div>
        </div>

        {/* Affichage conditionnel 2D/3D */}
        <div className="relative h-96 w-full">
          {view3D ? (
            <Artwork3DViewer artwork={artwork} />
          ) : (
            <Image
              src={artwork.imageUrl}
              alt={artwork.title[currentLang]}
              fill
              className="object-cover"
              priority
            />
          )}
        </div>

        <div className="p-8">
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
                className="p-3 bg-amber-100 text-amber-700 rounded-full hover:bg-amber-200 transition-all"
              >
                <Share2 className="w-6 h-6" />
              </button>
              {isAdmin && (
                <QRCodeGenerator artwork={artwork} iconOnly={true} className="p-3 bg-amber-100 text-amber-700 rounded-full hover:bg-amber-200 transition-all" />
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-amber-50 p-4 rounded-xl">
              <p className="text-sm text-gray-600 mb-1">{tSync('Période')}</p>
              <p className="font-semibold text-gray-900">{artwork.period}</p>
            </div>
            <div className="bg-amber-50 p-4 rounded-xl">
              <p className="text-sm text-gray-600 mb-1">{tSync('Origine')}</p>
              <p className="font-semibold text-gray-900">{artwork.origin}</p>
            </div>
            <div className="bg-amber-50 p-4 rounded-xl">
              <p className="text-sm text-gray-600 mb-1">{tSync('Matériau')}</p>
              <p className="font-semibold text-gray-900">{artwork.material}</p>
            </div>
            <div className="bg-amber-50 p-4 rounded-xl">
              <p className="text-sm text-gray-600 mb-1">{tSync('Dimensions')}</p>
              <p className="font-semibold text-gray-900">{artwork.dimensions}</p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {tSync('À propos de cette œuvre')}
            </h2>
            <p className="text-gray-700 leading-relaxed text-lg">
              {artwork.description[currentLang]}
            </p>
          </div>


          {/* Lecteur audio avec génération automatique */}
          <AudioPlayer
            artwork={artwork}
            currentLang={currentLang}
            title={`${artwork.title[currentLang]} - ${tSync('Description audio')}`}
          />
        </div>
      </div>

      {/* Modale de partage */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">{tSync('Partager cette œuvre')}</h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => shareOnSocialMedia('facebook')}
                className="flex items-center gap-3 p-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
              >
                <div className="w-6 h-6 flex items-center justify-center">
                  <span className="text-lg font-bold">f</span>
                </div>
                <span className="font-medium">Facebook</span>
              </button>
              
              <button
                onClick={() => shareOnSocialMedia('twitter')}
                className="flex items-center gap-3 p-4 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors"
              >
                <div className="w-6 h-6 flex items-center justify-center">
                  <span className="text-lg font-bold">𝕏</span>
                </div>
                <span className="font-medium">X (Twitter)</span>
              </button>
              
              <button
                onClick={() => shareOnSocialMedia('whatsapp')}
                className="flex items-center gap-3 p-4 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors"
              >
                <div className="w-6 h-6 flex items-center justify-center">
                  <span className="text-lg">📱</span>
                </div>
                <span className="font-medium">WhatsApp</span>
              </button>
              
              <button
                onClick={() => shareOnSocialMedia('instagram')}
                className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-colors"
              >
                <div className="w-6 h-6 flex items-center justify-center">
                  <span className="text-lg">📷</span>
                </div>
                <span className="font-medium">Instagram</span>
              </button>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="mb-3">
                <p className="text-sm text-gray-600 mb-2">{tSync('Lien de la page')} :</p>
                <div className="p-3 bg-gray-50 rounded-lg border">
                  <p className="text-sm text-gray-800 break-all">{typeof window !== 'undefined' ? window.location.href : ''}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert(tSync('Lien copié dans le presse-papier !'));
                  setShowShareModal(false);
                }}
                className="w-full p-3 bg-gray-100 text-gray-800 rounded-xl hover:bg-gray-200 transition-colors font-medium"
              >
                {tSync('Copier le lien')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}