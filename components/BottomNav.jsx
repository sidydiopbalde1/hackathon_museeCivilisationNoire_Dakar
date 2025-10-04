'use client';

import { Home, Grid3x3, Camera, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from '@/contexts/TranslationContext';

export default function BottomNav() {
  const pathname = usePathname();
  const { tSync } = useTranslation();

  const navItems = [
    { href: '/', icon: Home, label: 'Accueil' },
    { href: '/collection', icon: Grid3x3, label: 'Collection' },
    { href: '/scan', icon: Camera, label: 'Scanner', isHighlight: true },
    { href: '/login', icon: User, label: 'Connexion' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40 md:hidden">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-around py-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            if (item.isHighlight) {
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex flex-col items-center gap-1 px-6 py-2 bg-gradient-to-r from-amber-600 to-orange-700 text-white rounded-xl transform -translate-y-2 shadow-lg hover:shadow-xl transition-all"
                >
                  <Icon className="w-7 h-7" />
                  <span className="text-xs font-bold">{tSync(item.label)}</span>
                </Link>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all ${
                  isActive
                    ? 'text-amber-700 bg-amber-50'
                    : 'text-gray-600 hover:text-amber-700'
                }`}
              >
                <Icon className="w-6 h-6" />
                <span className="text-xs font-semibold">{tSync(item.label)}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}