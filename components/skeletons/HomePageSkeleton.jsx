'use client';

import HeroCarouselSkeleton from './HeroCarouselSkeleton';
import ArtworkCardSkeleton from './ArtworkCardSkeleton';
import HeaderSkeleton from './HeaderSkeleton';
import BottomNavSkeleton from './BottomNavSkeleton';
import AboutSectionSkeleton from './AboutSectionSkeleton';

export default function HomePageSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      {/* Header skeleton */}
      <HeaderSkeleton />

      <main className="pb-20 md:pb-8">
        {/* Hero Carousel skeleton */}
        <section className="px-4 pt-8">
          <div className="max-w-6xl mx-auto">
            <HeroCarouselSkeleton />
          </div>
        </section>

        {/* Action Cards (mobile only) skeleton */}
        <section className="px-4 mb-12 md:hidden">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-pulse">
              {[1, 2].map((i) => (
                <div key={i} className="bg-white p-6 rounded-xl shadow-lg">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
                    <div className="h-6 bg-gray-200 rounded w-32 mx-auto mb-2"></div>
                    <div className="h-4 bg-gray-150 rounded w-24 mx-auto"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Artworks skeleton */}
        <section className="px-4 mb-16">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
              <div className="h-6 bg-gray-200 rounded w-20 animate-pulse"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <ArtworkCardSkeleton key={i} />
              ))}
            </div>
          </div>
        </section>

        {/* About Section skeleton */}
        <AboutSectionSkeleton />
      </main>

      {/* Bottom Navigation skeleton */}
      <BottomNavSkeleton />
    </div>
  );
}