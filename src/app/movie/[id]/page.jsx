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
      <div className="flex min-h-screen items-center justify-center bg-netflix-black">
        <div className="text-center">
          <div className="mb-4 h-16 w-16 animate-spin rounded-full border-4 border-netflix-lightGray border-t-netflix-red"></div>
          <p className="text-netflix-lightGray">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-netflix-black px-4">
        <h1 className="mb-4 text-4xl font-bold text-netflix-red">Film non trouvé</h1>
        <Link
          href="/"
          className="rounded-lg bg-netflix-red px-6 py-3 font-semibold text-white hover:bg-netflix-red/90"
        >
          Retour à l'accueil
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-netflix-black">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-netflix-gray/20 bg-netflix-black/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-8">
          <Link href="/" className="flex items-center gap-2 text-white transition-colors hover:text-netflix-red">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="font-semibold">Retour</span>
          </Link>
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-netflix-red shadow-lg shadow-netflix-red/30">
              <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
              </svg>
            </div>
            <span className="hidden text-xl font-bold text-white sm:block">StreamFlix</span>
          </Link>
        </div>
      </header>

      {/* Contenu */}
      <main className="mx-auto max-w-7xl px-4 py-8 md:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Lecteur vidéo */}
          <div className="lg:col-span-2">
            <div className="overflow-hidden rounded-xl shadow-2xl">
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
            
            <div className="mt-4 rounded-lg border border-amber-900/30 bg-amber-950/20 p-4">
              <p className="text-sm text-amber-300">
                Si le lecteur ne s'affiche pas, désactivez votre bloqueur de publicités.
              </p>
            </div>
          </div>

          {/* Informations */}
          <div className="space-y-6">
            {/* Affiche */}
            <div className="overflow-hidden rounded-xl shadow-2xl">
              <img
                src={movie.poster}
                alt={movie.title}
                className="w-full"
              />
            </div>

            {/* Détails */}
            <div className="space-y-4 rounded-xl border border-netflix-gray/30 bg-netflix-darkGray/50 p-6">
              <h1 className="text-3xl font-bold text-white">
                {movie.title}
              </h1>
              
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full border border-netflix-gray/30 bg-netflix-gray/30 px-3 py-1 text-sm text-white">
                  {movie.year}
                </span>
                <span className="rounded-full border border-netflix-gray/30 bg-netflix-gray/30 px-3 py-1 text-sm text-white">
                  {movie.genre}
                </span>
                {movie.duration && movie.duration !== 'N/A' && (
                  <span className="rounded-full border border-netflix-gray/30 bg-netflix-gray/30 px-3 py-1 text-sm text-white">
                    {movie.duration}
                  </span>
                )}
              </div>

              <div className="text-sm text-netflix-lightGray">
                {movie.views?.toLocaleString() || 0} vues
              </div>

              <div className="border-t border-netflix-gray/30 pt-4">
                <h3 className="mb-2 text-lg font-semibold text-white">Synopsis</h3>
                <p className="leading-relaxed text-netflix-lightGray">
                  {movie.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}