'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

export default function MovieCard({ movie }) {
  const [imageError, setImageError] = useState(false);

  return (
    <Link href={`/movie/${movie._id}`}>
      <div className="group relative cursor-pointer transition-transform duration-300 hover:scale-105 hover:z-10">
        {/* Affiche du film */}
        <div className="relative aspect-[2/3] overflow-hidden rounded-md bg-netflix-gray">
          {!imageError ? (
            <Image
              src={movie.poster}
              alt={movie.title}
              fill
              className="object-cover transition-opacity duration-300 group-hover:opacity-80"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-netflix-gray text-netflix-lightGray">
              <svg className="h-16 w-16" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" />
              </svg>
            </div>
          )}
          
          {/* Overlay avec infos au survol */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h3 className="mb-1 text-lg font-bold text-white line-clamp-2">
                {movie.title}
              </h3>
              <div className="flex items-center gap-2 text-sm text-netflix-lightGray">
                <span>{movie.year}</span>
                <span>•</span>
                <span>{movie.genre}</span>
              </div>
              {movie.duration && movie.duration !== 'N/A' && (
                <div className="mt-1 text-xs text-netflix-lightGray">
                  {movie.duration}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}