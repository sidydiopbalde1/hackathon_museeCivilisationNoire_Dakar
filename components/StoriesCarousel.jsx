'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import StoryViewer from './StoryViewer';

export default function StoriesCarousel({ vertical = false }) {
  const [selectedStory, setSelectedStory] = useState(null);
  const [viewerOpen, setViewerOpen] = useState(false);

  // Données des stories
  const stories = [
    {
      id: 1,
      author: {
        name: 'Musée MCN',
        avatar: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=200',
        isMuseum: true
      },
      items: [
        {
          id: 1,
          type: 'image',
          url: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=800',
          caption: 'Nouvelle exposition de masques sacrés',
          duration: 5000
        },
        {
          id: 2,
          type: 'image',
          url: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800',
          caption: 'Découvrez nos textiles traditionnels',
          duration: 5000
        }
      ],
      hasNew: true
    },
    {
      id: 2,
      author: {
        name: 'Dakar',
        avatar: 'https://images.unsplash.com/photo-1577643816920-65b43ba99fba?w=800',
        isCity: true
      },
      items: [
        {
          id: 1,
          type: 'image',
          url: 'https://images.unsplash.com/photo-1577643816920-65b43ba99fba?w=800',
          caption: 'La ville de Dakar vous accueille',
          duration: 5000
        }
      ],
      hasNew: true
    },
    {
      id: 3,
      author: {
        name: 'Artiste de la semaine',
        avatar: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=200',
        isArtist: true
      },
      items: [
        {
          id: 1,
          type: 'image',
          url: 'https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=800',
          caption: 'Portrait de l\'artiste sculpteur Moussa Diop',
          duration: 5000
        },
        {
          id: 2,
          type: 'image',
          url: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=800',
          caption: 'Ses œuvres les plus récentes',
          duration: 5000
        }
      ],
      hasNew: true
    },
    {
      id: 4,
      author: {
        name: 'Œuvre de la semaine',
        avatar: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=200',
        isArtwork: true
      },
      items: [
        {
          id: 1,
          type: 'image',
          url: 'https://images.unsplash.com/photo-1577643816920-65b43ba99fba?w=800',
          caption: 'Masque cérémonial du XIXe siècle',
          duration: 5000
        }
      ],
      hasNew: false
    },
    {
      id: 1,
      author: {
        name: 'Musée MCN',
        avatar: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=200',
        isMuseum: true
      },
      items: [
        {
          id: 1,
          type: 'image',
          url: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=800',
          caption: 'Nouvelle exposition de masques sacrés',
          duration: 5000
        },
        {
          id: 2,
          type: 'image',
          url: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800',
          caption: 'Découvrez nos textiles traditionnels',
          duration: 5000
        }
      ],
      hasNew: true
    },
  ];

  const handleStoryClick = (story) => {
    setSelectedStory(story);
    setViewerOpen(true);
  };

  return (
    <>
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {/* Ajouter votre story */}
        {/* <div className="flex flex-col items-center gap-2 cursor-pointer flex-shrink-0">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center border-2 border-white shadow-lg hover:scale-105 transition-transform">
              <Plus className="w-8 h-8 text-gray-600" />
            </div>
          </div>
          <span className="text-xs text-gray-700 font-medium max-w-[80px] text-center truncate">
            Ajouter
          </span>
        </div> */}

        {/* Stories des autres */}
        {stories.map((story) => (
          <div
            key={story.id}
            onClick={() => handleStoryClick(story)}
            className="flex flex-col items-center gap-2 cursor-pointer flex-shrink-0"
          >
            <div className="relative">
              {/* Cercle avec gradient si nouvelle story */}
              <div className={`w-20 h-20 rounded-full p-[3px] ${
                story.hasNew
                  ? 'bg-gradient-to-tr from-amber-500 via-orange-500 to-pink-500'
                  : 'bg-gray-300'
              }`}>
                <div className="w-full h-full rounded-full border-4 border-white overflow-hidden bg-white">
                  <img
                    src={story.author.avatar}
                    alt={story.author.name}
                    className="w-full h-full object-cover hover:scale-110 transition-transform"
                  />
                </div>
              </div>
              
              {/* Badge pour type */}
              {story.author.isMuseum && (
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-amber-600 rounded-full flex items-center justify-center border-2 border-white">
                  <span className="text-white text-xs">🏛️</span>
                </div>
              )}
              {story.author.isCity && (
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center border-2 border-white">
                  <span className="text-white text-xs">🏙️</span>
                </div>
              )}
              {story.author.isArtist && (
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center border-2 border-white">
                  <span className="text-white text-xs">🎨</span>
                </div>
              )}
              {story.author.isArtwork && (
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-600 rounded-full flex items-center justify-center border-2 border-white">
                  <span className="text-white text-xs">✨</span>
                </div>
              )}
            </div>
            <span className="text-xs text-gray-700 font-medium max-w-[80px] text-center truncate">
              {story.author.name}
            </span>
          </div>
        ))}
      </div>

      {/* Story Viewer */}
      {viewerOpen && selectedStory && (
        <StoryViewer
          story={selectedStory}
          allStories={stories}
          onClose={() => {
            setViewerOpen(false);
            setSelectedStory(null);
          }}
        />
      )}
    </>
  );
}