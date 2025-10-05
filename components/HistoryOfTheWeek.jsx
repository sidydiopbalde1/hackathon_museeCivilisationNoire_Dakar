'use client';

import { Calendar, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useTranslation } from '@/contexts/TranslationContext';

export default function HistoryOfTheWeek() {
  const { tSync, currentLang } = useTranslation();

  // Données de l'histoire de la semaine
  const historyOfWeek = {
    title: {
      fr: "La Légende du Royaume du Bénin",
      en: "The Legend of the Benin Kingdom",
      wo: "Légende bi ci Royaume du Bénin"
    },
    description: {
      fr: "Découvrez l'histoire fascinante du Royaume du Bénin, l'une des civilisations les plus avancées d'Afrique de l'Ouest.",
      en: "Discover the fascinating history of the Benin Kingdom, one of the most advanced civilizations in West Africa.",
      wo: "Gis histoire bu njool bu Royaume du Bénin, benn ci civilisations yu gën am dëgg ci Afrique de l'Ouest."
    },
    image: "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=600",
    date: "Semaine du 7 Octobre 2025",
    category: "Histoire",
    link: "/histoire/royaume-benin"
  };

  const getLocalizedText = (obj) => {
    if (!obj) return '';
    if (typeof obj === 'string') return obj;
    return obj[currentLang] || obj.fr || obj.en || obj.wo || '';
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
      {/* Image */}
      <div className="relative h-40 overflow-hidden">
        <img
          src={historyOfWeek.image}
          alt={getLocalizedText(historyOfWeek.title)}
          className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        {/* Badge catégorie */}
        <div className="absolute top-3 left-3">
          <span className="bg-amber-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
            {historyOfWeek.category}
          </span>
        </div>

        {/* Date */}
        <div className="absolute bottom-3 left-3 flex items-center gap-2 text-white text-xs">
          <Calendar className="w-4 h-4" />
          <span>{historyOfWeek.date}</span>
        </div>
      </div>

      {/* Contenu */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
          {getLocalizedText(historyOfWeek.title)}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {getLocalizedText(historyOfWeek.description)}
        </p>
        
        <Link
          href={historyOfWeek.link}
          className="inline-flex items-center gap-2 text-amber-700 hover:text-amber-900 font-semibold text-sm group"
        >
          {tSync('Lire la suite')}
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}