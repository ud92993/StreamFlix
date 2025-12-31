'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function MoviePage() {
  const params = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetch(`/api/movies/${params.id}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) setMovie(data.data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#1a0b2e] via-[#2d1b4e] to-[#1a0b2e]">
        <div className="text-center">
          <div className="mb-4 h-16 w-16 animate-spin rounded-full border-4 border-purple-500/30 border-t-[#E50914]"></div>
          <p className="text-purple-200">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-[#1a0b2e] via-[#2d1b4e] to-[#1a0b2e] px-4">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-xl">
          <svg className="h-10 w-10 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="mb-3 text-3xl font-bold text-white">Film non trouvé</h1>
        <p className="mb-8 text-purple-200">Ce film n&apos;existe pas ou a été supprimé</p>
        <Link
          href="/"
          className="flex items-center gap-2 rounded-full bg-white px-8 py-4 font-bold text-purple-900 transition-all hover:scale-105"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Retour à l&apos;accueil
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a0b2e] via-[#2d1b4e] to-[#1a0b2e]">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-gradient-to-r from-purple-900/50 to-violet-900/50 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-6">
          <Link href="/" className="group flex items-center gap-3 text-white transition-all hover:text-purple-300">
            <svg className="h-6 w-6 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="font-bold">Back</span>
          </Link>
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#E50914] to-[#b20710] shadow-lg shadow-[#E50914]/50">
              <svg className="h-7 w-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
              </svg>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Background */}
      <div className="relative h-[400px] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={movie.poster}
            alt={movie.title}
            className="h-full w-full object-cover blur-2xl opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#1a0b2e]/50 to-[#1a0b2e]" />
        </div>
      </div>

      {/* Content */}
      <main className="relative -mt-60 px-8 pb-20">
        <div className="mx-auto max-w-7xl">
          {/* Player */}
          <div className="mb-10">
            <div className="overflow-hidden rounded-3xl shadow-2xl shadow-purple-900/50">
              <div className="relative aspect-video w-full bg-black">
                <iframe
                  src={`https://uqload.bz/embed-${movie.embedId}.html`}
                  title={movie.title}
                  className="h-full w-full"
                  frameBorder="0"
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                />
              </div>
            </div>
            
            {/* Warning */}
            <div className="mt-6 flex items-start gap-4 rounded-2xl border border-amber-400/30 bg-gradient-to-r from-amber-900/20 to-orange-900/20 p-5 backdrop-blur-xl">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-amber-400/20">
                <svg className="h-6 w-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-amber-300">Playback Issues?</p>
                <p className="mt-1 text-sm text-amber-200/80">
                  Disable your ad blocker for optimal streaming experience.
                </p>
              </div>
            </div>
          </div>

          {/* Movie Info */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl md:p-10">
            <div className="flex flex-col gap-10 md:flex-row">
              {/* Poster */}
              <div className="hidden flex-shrink-0 md:block">
                <div className="overflow-hidden rounded-2xl shadow-2xl shadow-purple-900/50 ring-2 ring-white/10">
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    className="h-96 w-64 object-cover"
                  />
                </div>
              </div>

              {/* Details */}
              <div className="flex-1 space-y-8">
                <div>
                  <h1 className="mb-6 text-4xl font-bold text-white md:text-5xl lg:text-6xl">
                    {movie.title}
                  </h1>
                  
                  <div className="flex flex-wrap gap-3">
                    <span className="flex items-center gap-2 rounded-full bg-white/20 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-xl">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                      {movie.year}
                    </span>
                    
                    {Array.isArray(movie.genres) ? (
                      movie.genres.map(genre => (
                        <span key={genre} className="rounded-full bg-[#E50914]/80 px-5 py-2.5 text-sm font-bold text-white backdrop-blur-xl">
                          {genre}
                        </span>
                      ))
                    ) : movie.genre && (
                      <span className="rounded-full bg-[#E50914]/80 px-5 py-2.5 text-sm font-bold text-white backdrop-blur-xl">
                        {movie.genre}
                      </span>
                    )}
                    
                    {movie.duration && movie.duration !== 'N/A' && (
                      <span className="flex items-center gap-2 rounded-full bg-white/20 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-xl">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {movie.duration}
                      </span>
                    )}

                    <span className="rounded-full bg-purple-500/80 px-5 py-2.5 text-sm font-bold text-white backdrop-blur-xl">
                      HD
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-purple-200">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span className="text-lg font-semibold">{movie.views?.toLocaleString() || 0} views</span>
                </div>

                <div className="space-y-4 border-t border-white/10 pt-8">
                  <h3 className="text-xl font-bold text-white">Overview</h3>
                  <p className="text-lg leading-relaxed text-purple-100">
                    {movie.description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-4 border-t border-white/10 pt-8">
                  <button className="group flex items-center gap-3 rounded-full bg-white px-8 py-4 font-bold text-purple-900 shadow-2xl shadow-white/30 transition-all hover:scale-105">
                    <svg className="h-6 w-6 transition-transform group-hover:scale-110" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                    Watch Again
                  </button>
                  <button className="flex items-center gap-3 rounded-full border-2 border-white/30 bg-white/10 px-8 py-4 font-bold text-white backdrop-blur-xl transition-all hover:bg-white/20">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add to List
                  </button>
                  <button className="flex items-center gap-3 rounded-full border-2 border-white/30 bg-white/10 px-8 py-4 font-bold text-white backdrop-blur-xl transition-all hover:bg-white/20">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                    Share
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}