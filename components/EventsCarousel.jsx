'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, Clock, MapPin, ChevronUp, ChevronDown, Loader2 } from 'lucide-react';
import { useTranslation } from '@/contexts/TranslationContext';

export default function EventsCarousel() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { tSync, currentLang } = useTranslation();

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    if (events.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % events.length);
    }, 5000); // Change toutes les 5 secondes

    return () => clearInterval(interval);
  }, [events]);

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events?status=upcoming&limit=5');
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
      month: 'short',
      year: 'numeric'
    });
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + events.length) % events.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % events.length);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-lg h-[500px] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
      </div>
    );
  }

  if (events.length === 0) return null;

  const currentEvent = events[currentIndex];

  return (
    <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden h-[500px] group">
      {/* Image de fond avec overlay */}
      <div className="absolute inset-0">
        {currentEvent.imageUrl ? (
          <img
            src={currentEvent.imageUrl}
            alt={currentEvent.title[currentLang]}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-amber-400 to-orange-600" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/30" />
      </div>

      {/* Contenu */}
      <div className="relative h-full flex flex-col justify-end p-6 text-white">
        {/* Badge catégorie */}
        <div className="absolute top-4 left-4 bg-amber-600 px-3 py-1 rounded-full text-xs font-semibold">
          {tSync(currentEvent.category)}
        </div>

        {/* Navigation verticale */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2">
          <button
            onClick={goToPrevious}
            className="bg-white/20 hover:bg-white/40 p-2 rounded-full backdrop-blur-sm transition-all"
          >
            <ChevronUp className="w-5 h-5" />
          </button>
          <button
            onClick={goToNext}
            className="bg-white/20 hover:bg-white/40 p-2 rounded-full backdrop-blur-sm transition-all"
          >
            <ChevronDown className="w-5 h-5" />
          </button>
        </div>

        {/* Indicateurs */}
        <div className="absolute top-4 right-4 flex flex-col gap-1">
          {events.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-1 transition-all ${
                index === currentIndex
                  ? 'h-8 bg-amber-500'
                  : 'h-4 bg-white/50 hover:bg-white/80'
              } rounded-full`}
            />
          ))}
        </div>

        {/* Informations de l'événement */}
        <div className="space-y-3 animate-fade-in">
          <h3 className="text-2xl font-bold leading-tight">
            {currentEvent.title[currentLang]}
          </h3>

          <p className="text-sm text-gray-200 line-clamp-2">
            {currentEvent.description[currentLang]}
          </p>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-amber-400" />
              <span>{formatDate(currentEvent.date)}</span>
            </div>

            {currentEvent.time && (
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>{currentEvent.time}</span>
              </div>
            )}

            {currentEvent.location && (
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-amber-400" />
                <span className="line-clamp-1">{currentEvent.location}</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-lg font-bold text-amber-400">
              {currentEvent.price}
            </span>
            <Link
              href={`/events/${currentEvent.id}`}
              className="bg-amber-600 hover:bg-amber-700 px-4 py-2 rounded-lg font-semibold text-sm transition-all"
            >
              {tSync('En savoir plus')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}