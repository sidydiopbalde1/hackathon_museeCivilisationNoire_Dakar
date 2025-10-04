'use client';

export default function ArtworkCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden group animate-pulse">
      {/* Image skeleton */}
      <div className="relative h-48 bg-gradient-to-br from-gray-200 to-gray-300">
        {/* QR code skeleton */}
        <div className="absolute top-3 right-3 w-8 h-8 bg-white/20 rounded"></div>
      </div>
      
      {/* Contenu skeleton */}
      <div className="p-4">
        {/* Titre skeleton */}
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
        
        {/* Période skeleton */}
        <div className="h-4 bg-gray-150 rounded w-1/2 mb-3"></div>
        
        {/* Description skeleton */}
        <div className="space-y-2 mb-4">
          <div className="h-3 bg-gray-150 rounded w-full"></div>
          <div className="h-3 bg-gray-150 rounded w-4/5"></div>
          <div className="h-3 bg-gray-150 rounded w-2/3"></div>
        </div>
        
        {/* Bouton skeleton */}
        <div className="h-10 bg-gray-200 rounded-lg w-full"></div>
      </div>
    </div>
  );
}