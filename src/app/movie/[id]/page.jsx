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
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a]">
        <div className="text-center">
          <div className="mb-4 h-16 w-16 animate-spin rounded-full border-4 border-gray-700 border-t-[#E50914]"></div>
          <p className="text-gray-400">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#0a0a0a] px-4">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-[#1f1f1f]">
          <svg className="h-10 w-10 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="mb-3 text-3xl font-bold text-white">Film non trouvé</h1>
        <p className="mb-8 text-gray-400">Ce film n'existe pas ou a été supprimé</p>
        <Link
          href="/"
          className="flex items-center gap-2 rounded-lg bg-[#E50914] px-6 py-3 font-semibold text-white transition-all hover:bg-[#b20710]"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Retour à l'accueil
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gray-800 bg-[#0a0a0a]/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-8">
          <Link href="/" className="group flex items-center gap-2 text-white transition-colors hover:text-[#E50914]">
            <svg className="h-6 w-6 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="font-semibold">Retour</span>
          </Link>
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-[#E50914] to-[#b20710]">
              <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
              </svg>
            </div>
            <span className="hidden text-xl font-bold text-white sm:block">StreamFlix</span>
          </Link>
        </div>
      </header>

      {/* Hero with background */}
      <div className="relative h-[300px] md:h-[400px]">
        <div className="absolute inset-0">
          <img
            src={movie.poster}
            alt={movie.title}
            className="h-full w-full object-cover blur-xl opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/50 to-transparent" />
        </div>
      </div>

      {/* Content */}
      <main className="relative -mt-40 px-4 pb-20 md:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Lecteur vidéo */}
          <div className="mb-8">
            <div className="overflow-hidden rounded-2xl shadow-2xl">
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
            
            <div className="mt-4 flex items-start gap-3 rounded-xl border border-amber-900/30 bg-amber-950/10 p-4">
              <svg className="h-5 w-5 flex-shrink-0 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <p className="text-sm font-medium text-amber-400">Problème de lecture ?</p>
                <p className="mt-1 text-xs text-amber-300/80">
                  Désactivez votre bloqueur de publicités pour une lecture optimale.
                </p>
              </div>
            </div>
          </div>

          {/* Infos du film */}
          <div className="rounded-2xl border border-gray-800 bg-[#141414] p-6 md:p-8">
            <div className="flex flex-col gap-8 md:flex-row">
              {/* Petite affiche */}
              <div className="hidden flex-shrink-0 md:block">
                <img
                  src={movie.poster}
                  alt={movie.title}
                  className="h-80 w-56 rounded-xl object-cover shadow-2xl"
                />
              </div>

              {/* Détails */}
              <div className="flex-1 space-y-6">
                <div>
                  <h1 className="mb-4 text-3xl font-bold text-white md:text-4xl lg:text-5xl">
                    {movie.title}
                  </h1>
                  
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-2 rounded-full bg-[#1f1f1f] px-4 py-2 text-sm font-medium text-white">
                      <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {movie.year}
                    </span>
                    {Array.isArray(movie.genres) ? (
                      movie.genres.map(genre => (
                        <span key={genre} className="inline-flex items-center rounded-full bg-[#E50914]/20 px-4 py-2 text-sm font-medium text-[#E50914]">
                          {genre}
                        </span>
                      ))
                    ) : movie.genre && (
                      <span className="inline-flex items-center rounded-full bg-[#E50914]/20 px-4 py-2 text-sm font-medium text-[#E50914]">
                        {movie.genre}
                      </span>
                    )}
                    {movie.duration && movie.duration !== 'N/A' && (
                      <span className="inline-flex items-center gap-2 rounded-full bg-[#1f1f1f] px-4 py-2 text-sm font-medium text-white">
                        <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {movie.duration}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span className="font-medium">{movie.views?.toLocaleString() || 0} vues</span>
                </div>

                <div className="space-y-3 border-t border-gray-800 pt-6">
                  <h3 className="text-lg font-bold text-white">Synopsis</h3>
                  <p className="leading-relaxed text-gray-300">
                    {movie.description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-3 border-t border-gray-800 pt-6">
                  <button className="flex items-center gap-2 rounded-lg bg-[#E50914] px-6 py-3 font-semibold text-white shadow-lg shadow-[#E50914]/30 transition-all hover:bg-[#b20710] hover:shadow-xl hover:shadow-[#E50914]/40">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Ma liste
                  </button>
                  <button className="flex items-center gap-2 rounded-lg bg-white/10 px-6 py-3 font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                    Partager
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