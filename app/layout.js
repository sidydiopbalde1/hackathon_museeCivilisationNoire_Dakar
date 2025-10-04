import './globals.css';
import { Inter } from 'next/font/google';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import { TranslationProvider } from '@/contexts/TranslationContext';
import { AuthProvider } from '@/contexts/AuthContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Musée des Civilisations Noires',
  description: 'Explorez le patrimoine africain à travers une expérience digitale immersive',
  manifest: '/manifest.json',
};

export const viewport = {
  themeColor: '#D97706',
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <AuthProvider>
          <TranslationProvider>
            <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
              <Header />
              <main className="pb-24 md:pb-0">
                {children}
              </main>
              <BottomNav />
            </div>
          </TranslationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}