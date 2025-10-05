'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Calendar, Clock, MapPin, Users, ArrowLeft, Share2, Bookmark, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useTranslation } from '@/contexts/TranslationContext';
import ReservationModal from '@/components/ReservationModal';

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedEvents, setRelatedEvents] = useState([]);
  const [showReservationModal, setShowReservationModal] = useState(false);
  const { tSync, currentLang } = useTranslation();

  useEffect(() => {
    if (params.id) {
      fetchEvent();
      fetchRelatedEvents();
    }
  }, [params.id]);

  const fetchEvent = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/events/${params.id}`);
      const data = await response.json();
      
      if (response.ok) {
        setEvent(data);
      } else {
        router.push('/events');
      }
    } catch (error) {
      console.error('Erreur chargement événement:', error);
      router.push('/events');
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedEvents = async () => {
    try {
      const response = await fetch('/api/events?status=upcoming&limit=3');
      if (response.ok) {
        const data = await response.json();
        setRelatedEvents(data.filter(e => e._id !== params.id && e.id !== params.id));
      }
    } catch (error) {
      console.error('Erreur chargement événements similaires:', error);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // Fonction pour obtenir le texte dans la langue appropriée
  const getLocalizedText = (obj) => {
    if (!obj) return '';
    if (typeof obj === 'string') return obj;
    return obj[currentLang] || obj.fr || obj.en || obj.wo || '';
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: getLocalizedText(event.title),
        text: getLocalizedText(event.description),
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert(tSync('Lien copié dans le presse-papiers'));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-amber-600" />
      </div>
    );
  }

  if (!event) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      {/* Bouton retour */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button
            onClick={() => router.push('/events')}
            className="flex items-center gap-2 text-gray-600 hover:text-amber-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-semibold">{tSync('Retour aux événements')}</span>
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative h-[500px] overflow-hidden">
        {event.imageUrl ? (
          <img
            src={event.imageUrl}
            alt={getLocalizedText(event.title)}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-amber-400 to-orange-600" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        
        {/* Badge catégorie */}
        <div className="absolute top-8 left-8">
          <span className="bg-amber-600 px-4 py-2 rounded-full text-white font-semibold">
            {tSync(event.category)}
          </span>
        </div>

        {/* Actions */}
        <div className="absolute top-8 right-8 flex gap-3">
          <button
            onClick={handleShare}
            className="bg-white/20 backdrop-blur-sm p-3 rounded-full hover:bg-white/30 transition-all"
          >
            <Share2 className="w-6 h-6 text-white" />
          </button>
          <button className="bg-white/20 backdrop-blur-sm p-3 rounded-full hover:bg-white/30 transition-all">
            <Bookmark className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Titre */}
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-5xl font-bold text-white mb-4">
              {getLocalizedText(event.title)}
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contenu principal */}
          <div className="lg:col-span-2 space-y-8">
            {/* Informations clés */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-start gap-4">
                  <div className="bg-amber-100 p-3 rounded-lg">
                    <Calendar className="w-6 h-6 text-amber-700" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">{tSync('Date')}</p>
                    <p className="font-semibold text-gray-900">{formatDate(event.date)}</p>
                  </div>
                </div>

                {event.time && (
                  <div className="flex items-start gap-4">
                    <div className="bg-amber-100 p-3 rounded-lg">
                      <Clock className="w-6 h-6 text-amber-700" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">{tSync('Horaire')}</p>
                      <p className="font-semibold text-gray-900">{event.time}</p>
                    </div>
                  </div>
                )}

                {event.location && (
                  <div className="flex items-start gap-4">
                    <div className="bg-amber-100 p-3 rounded-lg">
                      <MapPin className="w-6 h-6 text-amber-700" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">{tSync('Lieu')}</p>
                      <p className="font-semibold text-gray-900">{event.location}</p>
                    </div>
                  </div>
                )}

                {event.capacity && (
                  <div className="flex items-start gap-4">
                    <div className="bg-amber-100 p-3 rounded-lg">
                      <Users className="w-6 h-6 text-amber-700" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">{tSync('Capacité')}</p>
                      <p className="font-semibold text-gray-900">{event.capacity} {tSync('personnes')}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {tSync('À propos de cet événement')}
              </h2>
              <div className="prose prose-lg max-w-none text-gray-700">
                <p className="whitespace-pre-line">{getLocalizedText(event.description)}</p>
              </div>
            </div>

            {/* Programme (si disponible) */}
            {event.program && event.program.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  {tSync('Programme')}
                </h2>
                <div className="space-y-4">
                  {event.program.map((item, index) => (
                    <div key={index} className="flex gap-4 pb-4 border-b border-gray-100 last:border-0">
                      <div className="flex-shrink-0 w-20 text-amber-700 font-semibold">
                        {item.time}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                        <p className="text-gray-600 text-sm">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Carte de réservation */}
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <div className="mb-6">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-4xl font-bold text-amber-600">{event.price}</span>
                </div>
                <p className="text-gray-600 text-sm">{tSync('Par personne')}</p>
              </div>

              <button 
                onClick={() => setShowReservationModal(true)}
                className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-4 rounded-lg transition-all mb-4"
              >
                {tSync('Réserver maintenant')}
              </button>

              <p className="text-center text-sm text-gray-500">
                {tSync('Places limitées - Réservation recommandée')}
              </p>

              {event.tags && event.tags.length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <p className="text-sm text-gray-500 mb-3">{tSync('Tags')}</p>
                  <div className="flex flex-wrap gap-2">
                    {event.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-sm"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Événements similaires */}
        {relatedEvents.length > 0 && (
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              {tSync('Événements similaires')}
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedEvents.slice(0, 3).map((relatedEvent) => (
                <Link
                  key={relatedEvent._id || relatedEvent.id}
                  href={`/events/${relatedEvent._id || relatedEvent.id}`}
                  className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300"
                >
                  <div className="relative h-48">
                    {relatedEvent.imageUrl ? (
                      <img
                        src={relatedEvent.imageUrl}
                        alt={getLocalizedText(relatedEvent.title)}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-amber-400 to-orange-600" />
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">
                      {getLocalizedText(relatedEvent.title)}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">{formatDate(relatedEvent.date)}</p>
                    <span className="text-amber-600 font-semibold">{relatedEvent.price}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modal de réservation */}
      <ReservationModal 
        event={event}
        isOpen={showReservationModal}
        onClose={() => setShowReservationModal(false)}
      />
    </div>
  );
}