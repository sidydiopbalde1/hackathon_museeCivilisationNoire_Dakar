'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar,Camera, Grid3x3, Home, User } from 'lucide-react';
import { useTranslation } from '@/contexts/TranslationContext';
import { useAuth } from '@/contexts/AuthContext';
import UserAvatar from './UserAvatar';

export default function Header() {
  const { currentLang, changeLanguage, tSync, languages } = useTranslation();
  const { isAuthenticated } = useAuth();

  return (
    <header className="bg-gradient-to-r from-amber-900 via-orange-800 to-red-900 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
              <span className="text-2xl">🏛️</span>
            </div>
            <div>
              <h1 className="text-xl font-bold">
                {tSync('Musée des Civilisations Noires')}
              </h1>
              <p className="text-xs text-amber-200">{tSync('Digital Experience')}</p>
            </div>
          </Link>

          {/* Navigation Desktop - Visible uniquement sur desktop */}
       {/* Navigation Desktop */}
<nav className="hidden md:flex items-center gap-6">
  <Link href="/" className="flex items-center gap-2 text-white hover:text-amber-200 transition-colors">
    <Home className="w-5 h-5" />
    <span className="font-medium">{tSync('Accueil')}</span>
  </Link>
  <Link href="/collection" className="flex items-center gap-2 text-white hover:text-amber-200 transition-colors">
    <Grid3x3 className="w-5 h-5" />
    <span className="font-medium">{tSync('Collection')}</span>
  </Link>
  <Link href="/events" className="flex items-center gap-2 text-white hover:text-amber-200 transition-colors">
    <Calendar className="w-5 h-5" />
    <span className="font-medium">{tSync('Événements')}</span>
  </Link>
  {/* <Link href="/scan" className="flex items-center gap-2 text-white hover:text-amber-200 transition-colors">
    <Camera className="w-5 h-5" />
    <span className="font-medium">{tSync('Scanner')}</span>
  </Link> */}
  {!isAuthenticated && (
    <Link href="/login" className="flex items-center gap-2 text-white hover:text-amber-200 transition-colors">
      <User className="w-5 h-5" />
      <span className="font-medium">{tSync('Connexion')}</span>
    </Link>
  )}
</nav>

          <div className="flex items-center gap-4">
            {isAuthenticated && <UserAvatar />}

            <div className="flex gap-2">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => changeLanguage(lang.code)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                  currentLang === lang.code
                    ? 'bg-white text-amber-900'
                    : 'bg-amber-800 text-white hover:bg-amber-700'
                }`}
                title={lang.name}
              >
                {lang.flag} {lang.code.toUpperCase()}
              </button>
            ))}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}