'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Header() {
  const [currentLang, setCurrentLang] = useState('fr');

  const languages = [
    { code: 'fr', name: 'Français' },
    { code: 'en', name: 'English' },
    { code: 'wo', name: 'Wolof' },
  ];

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
                Musée des Civilisations Noires
              </h1>
              <p className="text-xs text-amber-200">Digital Experience</p>
            </div>
          </Link>

          <div className="flex gap-2">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setCurrentLang(lang.code)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                  currentLang === lang.code
                    ? 'bg-white text-amber-900'
                    : 'bg-amber-800 text-white hover:bg-amber-700'
                }`}
                title={lang.name}
              >
                {lang.code.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}