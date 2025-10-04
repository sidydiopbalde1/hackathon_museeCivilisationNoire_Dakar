'use client';

export default function BottomNavSkeleton() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg md:hidden animate-pulse z-50">
      <div className="grid grid-cols-3 h-16">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex flex-col items-center justify-center p-2">
            {/* Icône skeleton */}
            <div className="w-6 h-6 bg-gray-200 rounded mb-1"></div>
            {/* Texte skeleton */}
            <div className="h-3 bg-gray-200 rounded w-12"></div>
          </div>
        ))}
      </div>
    </nav>
  );
}