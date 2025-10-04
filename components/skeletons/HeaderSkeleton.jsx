'use client';

export default function HeaderSkeleton() {
  return (
    <header className="bg-white shadow-sm border-b animate-pulse">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo skeleton */}
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gray-200 rounded-full mr-3"></div>
            <div className="h-6 bg-gray-200 rounded w-32"></div>
          </div>

          {/* Navigation desktop skeleton */}
          <nav className="hidden md:flex space-x-8">
            <div className="h-4 bg-gray-200 rounded w-16"></div>
            <div className="h-4 bg-gray-200 rounded w-20"></div>
            <div className="h-4 bg-gray-200 rounded w-16"></div>
          </nav>

          {/* Sélecteur de langue skeleton */}
          <div className="flex items-center">
            <div className="w-16 h-8 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    </header>
  );
}