'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import translationService from '@/lib/translationService';

const TranslationContext = createContext();

export function TranslationProvider({ children }) {
  const [currentLang, setCurrentLang] = useState('fr');
  const [isTranslating, setIsTranslating] = useState(false);

  // Fonction de traduction
  const t = useCallback(async (text) => {
    if (currentLang === 'fr') return text;
    
    setIsTranslating(true);
    try {
      const translation = await translationService.translate(text, currentLang);
      return translation;
    } catch (error) {
      console.error('Erreur de traduction:', error);
      return text;
    } finally {
      setIsTranslating(false);
    }
  }, [currentLang]);

  // Changer de langue
  const changeLanguage = useCallback((lang) => {
    setCurrentLang(lang);
  }, []);

  // Hook pour traduction synchrone (utilise le cache)
  const tSync = useCallback((text) => {
    if (currentLang === 'fr') return text;
    
    const cacheKey = translationService.getCacheKey(text, currentLang);
    const cached = translationService.cache.get(cacheKey);
    
    if (cached) {
      return cached;
    }
    
    // Si pas en cache, lancer la traduction async et retourner le fallback
    translationService.translate(text, currentLang);
    return translationService.getFallbackTranslation(text, currentLang);
  }, [currentLang]);

  const value = {
    currentLang,
    changeLanguage,
    t,
    tSync,
    isTranslating,
    languages: [
      { code: 'fr', name: 'Français', flag: '🇫🇷' },
      { code: 'en', name: 'English', flag: '🇬🇧' },
      { code: 'wo', name: 'Wolof', flag: '🇸🇳' }
    ]
  };

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  );
}

// Hook personnalisé
export function useTranslation() {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
}

export default TranslationContext;