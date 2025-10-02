import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Clock } from 'lucide-react';

export default function ArtworkCard({ artwork }) {
  return (
    <Link href={`/artwork/${artwork.id}`}>
      <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all cursor-pointer transform hover:scale-105">
        <div className="relative h-48 w-full">
          <Image
            src={artwork.imageUrl}
            alt={artwork.title?.fr || artwork.title_fr || 'Artwork'}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        
        <div className="p-4">
          <h3 className="font-bold text-gray-900 mb-2 line-clamp-1">
            {artwork.title?.fr || artwork.title_fr}
          </h3>
          
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            <span className="line-clamp-1">{artwork.origin}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="w-4 h-4 flex-shrink-0" />
            <span className="line-clamp-1">{artwork.period}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}