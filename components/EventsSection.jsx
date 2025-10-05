'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, Clock, MapPin, ArrowRight, Loader2 } from 'lucide-react';
import { useTranslation } from '@/contexts/TranslationContext';

export default function EventsSection({ compact = false }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { tSync, currentLang } = useTranslation();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const limit = compact ? 3 : 3;
      const response = await fetch(`/api/events?status=upcoming&limit=${limit}`);
      if (response.ok) {
        const data = await response.json();
        setEvents(data);
      }
    } catch (error) {
      console.error('Erreur chargement événements:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <Loader2 className="w-8 h-8 animate-spin text-amber-600 mx-auto" />
      </div>
    );
  }

  if (events.length === 0) return null;

  // Mode compact pour la sidebar
  if (compact) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-lg h-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-amber-900">
            {tSync('Événements')}
          </h2>
        </div>

        <div className="space-y-4">
          {events.map((event, index) => (
            <div
              key={event.id || event._id}
              className="group border-b border-gray-200 pb-4 last:border-0 animate-float"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              {/* Badge catégorie */}
              <div className="inline-block bg-amber-600 text-white px-2 py-1 rounded-full text-xs font-semibold mb-2">
                {tSync(event.category)}
              </div>

              {/* Titre */}
              <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-amber-700 transition-colors">
                {event.title[currentLang]}
              </h3>

              {/* Date et heure */}
              <div className="space-y-1 mb-3">
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <Calendar className="w-3 h-3 text-amber-600" />
                  <span>{formatDate(event.date)}</span>
                </div>
                {event.time && (
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Clock className="w-3 h-3 text-amber-600" />
                    <span>{event.time}</span>
                  </div>
                )}
              </div>

              {/* Prix et lien */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-amber-600">
                  {event.price}
                </span>
                <Link
                  href={`/events/${event.id}`}
                  className="text-amber-700 hover:text-amber-900 text-xs font-semibold flex items-center gap-1"
                >
                  {tSync('Détails')}
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Lien vers tous les événements */}
        <Link 
          href="/events"
          className="block mt-6 text-center bg-amber-600 hover:bg-amber-700 text-white py-2 rounded-lg font-semibold transition-all"
        >
          {tSync('Voir tous les événements')}
        </Link>
      </div>
    );
  }

  // Mode normal (pleine largeur)
  return (
    <section className="my-16">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-amber-900">
          {tSync('Événements à venir')}
        </h2>
        <Link 
          href="/events"
          className="text-amber-700 hover:text-amber-900 font-semibold flex items-center gap-2"
        >
          {tSync('Voir tous les événements')}
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {events.map((event, index) => (
          <div
            key={event.id || event._id}
            className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 animate-float"
            style={{ animationDelay: `${index * 0.2}s` }}
          >
            {/* Image */}
            <div className="relative h-48 overflow-hidden">
              {event.imageUrl ? (
                <img
                  src={event.imageUrl}
                  alt={event.title[currentLang]}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center">
                  <Calendar className="w-16 h-16 text-white opacity-50" />
                </div>
              )}
              
              <div className="absolute top-3 right-3 bg-amber-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                {tSync(event.category)}
              </div>
            </div>

            {/* Contenu */}
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-amber-700 transition-colors">
                {event.title[currentLang]}
              </h3>

              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {event.description[currentLang]}
              </p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Calendar className="w-4 h-4 text-amber-600" />
                  <span>{formatDate(event.date)}</span>
                </div>
                
                {event.time && (
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Clock className="w-4 h-4 text-amber-600" />
                    <span>{event.time}</span>
                  </div>
                )}

                {event.location && (
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <MapPin className="w-4 h-4 text-amber-600" />
                    <span className="line-clamp-1">{event.location}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-amber-600">
                  {event.price}
                </span>
                <Link
                  href={`/events/${event.id}`}
                  className="text-amber-700 hover:text-amber-900 font-semibold text-sm flex items-center gap-1"
                >
                  {tSync('En savoir plus')}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-1000 pointer-events-none"></div>
          </div>
        ))}
      </div>
    </section>
  );
}