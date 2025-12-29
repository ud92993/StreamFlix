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
      <div className="flex min-h-screen flex-col items-center justify-center bg-netflix-black">
        <h1 className="mb-4 text-4xl font-bold text-netflix-red">Film non trouvé</h1>
        <Link href="/" className="rounded bg-netflix-red px-6 py-3 text-white">
          Retour
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-netflix-black">
      <header className="bg-netflix-darkGray">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <Link href="/" className="text-white hover:text-netflix-red">
            ← Retour
          </Link>
          <h1 className="text-2xl font-bold text-netflix-red">StreamFlix</h1>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="aspect-video w-full overflow-hidden rounded-lg bg-black">
              <iframe
                src={`https://uqload.bz/embed-${movie.embedId}.html`}
                title={movie.title}
                className="h-full w-full"
                frameBorder="0"
                allowFullScreen
              />
            </div>
            <div className="mt-4 rounded bg-netflix-gray p-4">
              <p className="text-sm text-netflix-lightGray">
                ⚠️ Si le lecteur ne s&apos;affiche pas, désactivez votre bloqueur de pub.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <img
              src={movie.poster}
              alt={movie.title}
              className="w-full rounded-lg"
            />

            <div className="rounded-lg bg-netflix-darkGray p-6">
              <h1 className="mb-4 text-3xl font-bold text-white">{movie.title}</h1>
              
              <div className="mb-4 flex gap-4 text-netflix-lightGray">
                <span>📅 {movie.year}</span>
                <span>🎬 {movie.genre}</span>
                {movie.duration !== 'N/A' && <span>⏱️ {movie.duration}</span>}
              </div>

              <div className="mb-4 text-sm text-netflix-lightGray">
                👁️ {movie.views || 0} vues
              </div>

              <div className="border-t border-netflix-gray pt-4">
                <h3 className="mb-2 text-lg font-bold text-white">Synopsis</h3>
                <p className="text-netflix-lightGray">{movie.description}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
