'use client';

export default function AboutSectionSkeleton() {
  return (
    <section className="py-16 bg-amber-50 animate-pulse">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          {/* Titre skeleton */}
          <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4"></div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Image skeleton */}
          <div className="w-full h-80 bg-gray-200 rounded-xl"></div>
          
          {/* Contenu texte skeleton */}
          <div className="space-y-6">
            {/* Paragraphe 1 */}
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-11/12"></div>
              <div className="h-4 bg-gray-200 rounded w-4/5"></div>
              <div className="h-4 bg-gray-200 rounded w-9/10"></div>
            </div>
            
            {/* Paragraphe 2 */}
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}