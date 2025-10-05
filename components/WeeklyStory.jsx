'use client';

import { Calendar, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useTranslation } from '@/contexts/TranslationContext';

export default function WeeklyStory() {
  const { tSync, currentLang } = useTranslation();

  // Story de la semaine
  const weeklyStory = {
    id: 'story-week-1',
    title: {
      fr: "Le Royaume du Bénin : Un Empire d'Art et de Pouvoir",
      en: "The Benin Kingdom: An Empire of Art and Power",
      wo: "Royaume du Bénin: Empire bu Art ak Pouvoir"
    },
    description: {
      fr: "Découvrez l'histoire fascinante du Royaume du Bénin, célèbre pour ses bronzes d'exception et son organisation politique sophistiquée.",
      en: "Discover the fascinating history of the Benin Kingdom, famous for its exceptional bronzes and sophisticated political organization.",
      wo: "Gis histoire bu njool bu Royaume du Bénin, bu bari ngir bronzes yu gën am dëgg ak organisation politique bu xam."
    },
    image: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=800',
    date: '7 Octobre 2025',
    category: 'Histoire',
    badge: '🏛️'
  };

  const getLocalizedText = (obj) => {
    if (!obj) return '';
    if (typeof obj === 'string') return obj;
    return obj[currentLang] || obj.fr || obj.en || obj.wo || '';
  };

  return (
    <Link 
      href={`/stories/${weeklyStory.id}`}
      className="block bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={weeklyStory.image}
          alt={getLocalizedText(weeklyStory.title)}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        
        {/* Badge */}
        <div className="absolute top-4 left-4">
          <span className="bg-amber-600 text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1">
            <span>{weeklyStory.badge}</span>
            {weeklyStory.category}
          </span>
        </div>

        {/* Date */}
        <div className="absolute bottom-4 left-4 flex items-center gap-2 text-white text-sm">
          <Calendar className="w-4 h-4" />
          <span className="font-medium">{weeklyStory.date}</span>
        </div>
      </div>

      {/* Contenu */}
      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-amber-700 transition-colors">
          {getLocalizedText(weeklyStory.title)}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
          {getLocalizedText(weeklyStory.description)}
        </p>
        
        <div className="flex items-center gap-2 text-amber-700 font-semibold text-sm">
          <span>{tSync('Lire la suite')}</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
        </div>
      </div>
    </Link>
  );
}