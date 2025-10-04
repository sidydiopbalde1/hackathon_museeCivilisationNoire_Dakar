'use client';

export default function HeroCarouselSkeleton() {
  return (
    <div className="relative w-full h-[500px] md:h-[600px] overflow-hidden rounded-2xl shadow-2xl mb-12 animate-pulse">
      {/* Image skeleton */}
      <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300"></div>
      
      {/* Contenu du slide skeleton */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center px-4 max-w-4xl">
          {/* Titre skeleton */}
          <div className="h-8 md:h-12 lg:h-16 bg-white/20 rounded-lg mb-4 w-3/4 mx-auto"></div>
          {/* Sous-titre skeleton */}
          <div className="h-4 md:h-6 lg:h-8 bg-white/15 rounded-lg w-1/2 mx-auto"></div>
        </div>
      </div>

      {/* Boutons de navigation skeleton */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 rounded-full"></div>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 rounded-full"></div>

      {/* Indicateurs skeleton */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="w-3 h-3 rounded-full bg-white/30"></div>
        ))}
      </div>
    </div>
  );
}