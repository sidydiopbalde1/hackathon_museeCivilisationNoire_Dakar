'use client';

import { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';

export default function StoryViewer({ story, allStories, onClose }) {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(
    allStories.findIndex(s => s.id === story.id)
  );
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);

  const currentStory = allStories[currentStoryIndex];
  const currentItem = currentStory?.items[currentItemIndex];

  useEffect(() => {
    if (!currentItem || isPaused) return;

    const duration = currentItem.duration || 5000;
    const interval = 50;
    let elapsed = 0;

    const timer = setInterval(() => {
      elapsed += interval;
      const newProgress = (elapsed / duration) * 100;
      setProgress(newProgress);

      if (elapsed >= duration) {
        goToNext();
      }
    }, interval);

    return () => clearInterval(timer);
  }, [currentItemIndex, currentStoryIndex, isPaused]);

  const goToNext = () => {
    // Passer à l'item suivant
    if (currentItemIndex < currentStory.items.length - 1) {
      setCurrentItemIndex(prev => prev + 1);
      setProgress(0);
    } 
    // Passer à la story suivante
    else if (currentStoryIndex < allStories.length - 1) {
      setCurrentStoryIndex(prev => prev + 1);
      setCurrentItemIndex(0);
      setProgress(0);
    } 
    // Fermer si c'est la dernière
    else {
      onClose();
    }
  };

  const goToPrevious = () => {
    // Retour à l'item précédent
    if (currentItemIndex > 0) {
      setCurrentItemIndex(prev => prev - 1);
      setProgress(0);
    } 
    // Retour à la story précédente
    else if (currentStoryIndex > 0) {
      setCurrentStoryIndex(prev => prev - 1);
      const prevStory = allStories[currentStoryIndex - 1];
      setCurrentItemIndex(prevStory.items.length - 1);
      setProgress(0);
    }
  };

  const goToStory = (storyIndex) => {
    setCurrentStoryIndex(storyIndex);
    setCurrentItemIndex(0);
    setProgress(0);
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      {/* Header avec barres de progression */}
      <div className="absolute top-0 left-0 right-0 p-4 z-10">
        {/* Barres de progression */}
        <div className="flex gap-1 mb-4">
          {currentStory.items.map((item, index) => (
            <div key={item.id} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-white transition-all duration-100"
                style={{
                  width: index === currentItemIndex 
                    ? `${progress}%` 
                    : index < currentItemIndex 
                      ? '100%' 
                      : '0%'
                }}
              />
            </div>
          ))}
        </div>

        {/* Info auteur */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={currentStory.author.avatar}
              alt={currentStory.author.name}
              className="w-10 h-10 rounded-full border-2 border-white"
            />
            <span className="text-white font-semibold">
              {currentStory.author.name}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="p-2 text-white hover:bg-white/20 rounded-full transition-all"
            >
              {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 text-white hover:bg-white/20 rounded-full transition-all"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Navigation entre stories */}
      {currentStoryIndex > 0 && (
        <button
          onClick={() => goToStory(currentStoryIndex - 1)}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 text-white rounded-full hover:bg-black/70 transition-all z-10"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}
      
      {currentStoryIndex < allStories.length - 1 && (
        <button
          onClick={() => goToStory(currentStoryIndex + 1)}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 text-white rounded-full hover:bg-black/70 transition-all z-10"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}

      {/* Contenu de la story */}
      <div 
        className="relative w-full max-w-lg h-full max-h-[90vh] cursor-pointer"
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const middle = rect.width / 2;
          
          if (x < middle) {
            goToPrevious();
          } else {
            goToNext();
          }
        }}
      >
        {currentItem?.type === 'image' && (
          <div className="relative w-full h-full flex items-center justify-center">
            <img
              src={currentItem.url}
              alt={currentItem.caption || ''}
              className="max-w-full max-h-full object-contain"
            />
            
            {/* Caption */}
            {currentItem.caption && (
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                <p className="text-white text-lg text-center">
                  {currentItem.caption}
                </p>
              </div>
            )}
          </div>
        )}

        {currentItem?.type === 'video' && (
          <video
            src={currentItem.url}
            className="w-full h-full object-contain"
            autoPlay
            muted={!isPaused}
          />
        )}
      </div>

      {/* Indicateurs de stories en bas */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {allStories.map((s, index) => (
          <button
            key={s.id}
            onClick={(e) => {
              e.stopPropagation();
              goToStory(index);
            }}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentStoryIndex 
                ? 'bg-white w-8' 
                : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
}