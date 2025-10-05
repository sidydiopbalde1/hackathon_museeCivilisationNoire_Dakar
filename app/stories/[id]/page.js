'use client';

import { useParams, useRouter } from 'next/navigation';
import { Calendar, ArrowLeft, Share2, Clock } from 'lucide-react';
import { useTranslation } from '@/contexts/TranslationContext';

export default function StoryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { tSync, currentLang } = useTranslation();

  // Données complètes de la story
  const story = {
    id: 'story-week-1',
    title: {
      fr: "Le Royaume du Bénin : Un Empire d'Art et de Pouvoir",
      en: "The Benin Kingdom: An Empire of Art and Power",
      wo: "Royaume du Bénin: Empire bu Art ak Pouvoir"
    },
    subtitle: {
      fr: "Une civilisation qui a marqué l'histoire de l'Afrique de l'Ouest",
      en: "A civilization that marked the history of West Africa",
      wo: "Civilization bu toppatoo ci histoire bi Afrique de l'Ouest"
    },
    date: '7 Octobre 2025',
    readTime: '8 min',
    category: 'Histoire',
    mainImage: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=1200',
    
    content: {
      fr: `
Le Royaume du Bénin, situé dans l'actuel Nigéria, fut l'un des empires les plus sophistiqués d'Afrique de l'Ouest. Fondé au XIIe siècle, il atteignit son apogée entre les XVe et XVIIe siècles.

## L'Art du Bronze

Le Royaume du Bénin est mondialement célèbre pour ses bronzes exceptionnels. Ces sculptures en bronze et laiton, créées par la guilde des artisans Igun Eronmwon, représentaient des scènes de la vie royale, des batailles, et des cérémonies importantes.

Les plaques de bronze ornaient les murs du palais royal et servaient à la fois d'œuvres d'art et de documents historiques. Chaque plaque racontait une histoire, préservant ainsi la mémoire collective du royaume.

## Organisation Politique

Le royaume était dirigé par l'Oba, un roi-prêtre considéré comme divin. Le pouvoir était exercé à travers une administration complexe comprenant:

- Les chefs de palais (Eghaevbo n'Ore)
- Les chefs de ville (Eghaevbo n'Ogbe)  
- Les guildes d'artisans spécialisés
- Un système judiciaire structuré

## Commerce et Prospérité

Le Royaume du Bénin contrôlait les routes commerciales vitales, échangeant l'ivoire, le poivre, l'huile de palme et les textiles avec les Portugais dès le XVe siècle. Cette prospérité économique permit le développement des arts et de l'architecture.

## Héritage Culturel

Aujourd'hui, l'héritage du Royaume du Bénin continue d'inspirer. Les bronzes, dispersés dans les musées du monde entier, sont au cœur de débats sur la restitution du patrimoine africain.
      `,
      en: `
The Benin Kingdom, located in present-day Nigeria, was one of the most sophisticated empires in West Africa. Founded in the 12th century, it reached its peak between the 15th and 17th centuries.

## The Art of Bronze

The Benin Kingdom is world-famous for its exceptional bronzes. These bronze and brass sculptures, created by the Igun Eronmwon artisan guild, depicted scenes of royal life, battles, and important ceremonies.

The bronze plaques adorned the walls of the royal palace and served both as works of art and historical documents. Each plaque told a story, thus preserving the collective memory of the kingdom.

## Political Organization

The kingdom was ruled by the Oba, a priest-king considered divine. Power was exercised through a complex administration including:

- Palace chiefs (Eghaevbo n'Ore)
- Town chiefs (Eghaevbo n'Ogbe)
- Specialized artisan guilds
- A structured judicial system

## Trade and Prosperity

The Benin Kingdom controlled vital trade routes, exchanging ivory, pepper, palm oil and textiles with the Portuguese from the 15th century. This economic prosperity enabled the development of arts and architecture.

## Cultural Heritage

Today, the legacy of the Benin Kingdom continues to inspire. The bronzes, scattered in museums around the world, are at the heart of debates on the restitution of African heritage.
      `,
      wo: `
Royaume du Bénin, ci Nigéria bu lebu, mooy benn ci empires yu gën am dëgg ci Afrique de l'Ouest. Benn ci XIIe siècle, dafa dem ci apogée ci XVe ak XVIIe siècle.

## Art bu Bronze

Royaume du Bénin bari na ngir bronzes yu gën am dëgg. Sculptures yi ci bronze ak laiton, artisans Igun Eronmwon la koy def, dañuy wonе scenes bu vie royale, batailles, ak ceremonies yu gën am dëgg.

Plaques yi ci bronze dañuy orne murs yi palais royal yi te dañuy liggéey ni œuvres d'art ak documents historiques. Plaque bu nekk mooy histoire benn, ci loolu dañuy preserve mémoire collective bu royaume bi.
      `
    },
    
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800',
        caption: 'Bronzes du Royaume du Bénin'
      },
      {
        url: 'https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=800',
        caption: 'Sculptures traditionnelles'
      },
      {
        url: 'https://images.unsplash.com/photo-1577643816920-65b43ba99fba?w=800',
        caption: 'Architecture du palais royal'
      }
    ]
  };

  const getLocalizedText = (obj) => {
    if (!obj) return '';
    if (typeof obj === 'string') return obj;
    return obj[currentLang] || obj.fr || obj.en || obj.wo || '';
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: getLocalizedText(story.title),
        text: getLocalizedText(story.subtitle),
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert(tSync('Lien copié dans le presse-papiers'));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      {/* Bouton retour */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 text-gray-600 hover:text-amber-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-semibold">{tSync('Retour à l\'accueil')}</span>
          </button>
        </div>
      </div>

      <article className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-amber-600 text-white px-4 py-1.5 rounded-full text-sm font-bold">
              {story.category}
            </span>
            <div className="flex items-center gap-4 text-gray-500 text-sm">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {story.date}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {story.readTime}
              </span>
            </div>
            <button
              onClick={handleShare}
              className="ml-auto p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Share2 className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {getLocalizedText(story.title)}
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            {getLocalizedText(story.subtitle)}
          </p>
        </header>

        {/* Image principale */}
        <div className="relative h-96 rounded-2xl overflow-hidden mb-12 shadow-2xl">
          <img
            src={story.mainImage}
            alt={getLocalizedText(story.title)}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Contenu */}
        <div className="prose prose-lg max-w-none mb-12">
          <div className="text-gray-800 leading-relaxed whitespace-pre-line">
            {getLocalizedText(story.content)}
          </div>
        </div>

        {/* Galerie d'images */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            {tSync('Galerie')}
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {story.gallery.map((image, index) => (
              <div key={index} className="relative h-64 rounded-xl overflow-hidden group">
                <img
                  src={image.url}
                  alt={image.caption}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                  <p className="text-white text-sm font-medium">{image.caption}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="bg-gradient-to-r from-amber-600 to-orange-700 rounded-2xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-4">
            {tSync('Envie d\'en savoir plus ?')}
          </h3>
          <p className="mb-6 text-amber-50">
            {tSync('Visitez le musée pour découvrir notre collection complète')}
          </p>
          <button 
            onClick={() => router.push('/collection')}
            className="bg-white text-amber-700 px-8 py-3 rounded-xl font-bold hover:bg-amber-50 transition-all"
          >
            {tSync('Explorer la collection')}
          </button>
        </div>
      </article>
    </div>
  );
}