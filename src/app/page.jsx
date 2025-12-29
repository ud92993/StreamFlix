'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

export default function HomePage() {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('all');

  const GENRES = ['all', 'Action', 'Drame', 'Comédie', 'SF', 'Horreur', 'Animation', 'Romance', 'Thriller', 'Documentaire'];

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const response = await fetch('/api/movies?limit=100');
      const data = await response.json();
      
      if (data.success) {
        setMovies(data.data);
        setFilteredMovies(data.data);
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = movies;

    if (selectedGenre !== 'all') {
      filtered = filtered.filter(movie => movie.genre === selectedGenre);
    }

    if (searchTerm) {
      filtered = filtered.filter(movie =>
        movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        movie.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredMovies(filtered);
  }, [searchTerm, selectedGenre, movies]);

  const handleSearch = useCallback((term) => {
    setSearchTerm(term);
  }, []);

  const handleGenreChange = useCallback((genre) => {
    setSelectedGenre(genre);
  }, []);

  const moviesByGenre = {};
  movies.forEach(movie => {
    if (!moviesByGenre[movie.genre]) {
      moviesByGenre[movie.genre] = [];
    }
    moviesByGenre[movie.genre].push(movie);
  });

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

  return (
    <div className="min-h-screen bg-netflix-black">
      {/* Header amélioré */}
      <header className="sticky top-0 z-50 border-b border-netflix-gray/20 bg-netflix-black/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-8">
          <Link href="/" className="flex items-center gap-3 transition-transform hover:scale-105">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-netflix-red shadow-lg shadow-netflix-red/30">
              <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white">StreamFlix</h1>
          </Link>
          <Link
            href="/admin/login"
            className="rounded-lg bg-netflix-gray px-4 py-2 text-sm font-medium text-white transition-all hover:bg-netflix-gray/80"
          >
            Admin
          </Link>
        </div>
      </header>

      {/* Barre de recherche améliorée */}
      <div className="sticky top-[73px] z-40 border-b border-netflix-gray/20 bg-netflix-black/95 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 py-6 md:px-8">
          <div className="mb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher un film..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full rounded-lg border border-netflix-gray/30 bg-netflix-darkGray px-4 py-3 pl-12 text-white placeholder-netflix-lightGray transition-all focus:border-netflix-red focus:outline-none focus:ring-2 focus:ring-netflix-red/50"
              />
              <svg
                className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-netflix-lightGray"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Filtres par genre */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {GENRES.map((genre) => (
              <button
                key={genre}
                onClick={() => handleGenreChange(genre)}
                className={`flex-shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  selectedGenre === genre
                    ? 'bg-netflix-red text-white shadow-lg shadow-netflix-red/30'
                    : 'bg-netflix-gray text-netflix-lightGray hover:bg-netflix-gray/80'
                }`}
              >
                {genre === 'all' ? 'Tous les films' : genre}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Contenu */}
      <main className="pb-20 pt-8">
        {searchTerm || selectedGenre !== 'all' ? (
          <div className="mx-auto max-w-7xl px-4 md:px-8">
            <h2 className="mb-6 text-2xl font-bold text-white">
              {searchTerm 
                ? `Résultats pour "${searchTerm}"` 
                : `Films ${selectedGenre}`}
              <span className="ml-2 text-lg text-netflix-lightGray">({filteredMovies.length})</span>
            </h2>
            
            {filteredMovies.length > 0 ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                {filteredMovies.map(movie => (
                  <Link key={movie._id} href={`/movie/${movie._id}`}>
                    <div className="group relative cursor-pointer overflow-hidden rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-black/50">
                      <div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-netflix-gray">
                        <img
                          src={movie.poster}
                          alt={movie.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                          <div className="absolute bottom-0 left-0 right-0 p-3">
                            <h3 className="mb-1 text-sm font-bold text-white line-clamp-2">
                              {movie.title}
                            </h3>
                            <div className="flex items-center gap-2 text-xs text-netflix-lightGray">
                              <span className="rounded bg-netflix-red/80 px-2 py-0.5">{movie.year}</span>
                              <span>{movie.genre}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="flex min-h-[300px] items-center justify-center rounded-lg border border-netflix-gray/30 bg-netflix-darkGray/50">
                <div className="text-center">
                  <p className="text-xl text-netflix-lightGray">Aucun film trouvé</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div>
            {movies.length > 0 && (
              <div className="mb-12">
                <div className="mx-auto max-w-7xl px-4 md:px-8">
                  <h2 className="mb-6 text-2xl font-bold text-white">Nouveautés</h2>
                </div>
                <div className="flex gap-4 overflow-x-auto px-4 pb-4 scrollbar-hide md:px-8">
                  {movies.slice(0, 10).map(movie => (
                    <Link key={movie._id} href={`/movie/${movie._id}`} className="w-48 flex-shrink-0">
                      <div className="group relative cursor-pointer overflow-hidden rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-black/50">
                        <div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-netflix-gray">
                          <img
                            src={movie.poster}
                            alt={movie.title}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {Object.entries(moviesByGenre).map(([genre, genreMovies]) => (
              <div key={genre} className="mb-12">
                <div className="mx-auto max-w-7xl px-4 md:px-8">
                  <h2 className="mb-6 text-2xl font-bold text-white">{genre}</h2>
                </div>
                <div className="flex gap-4 overflow-x-auto px-4 pb-4 scrollbar-hide md:px-8">
                  {genreMovies.map(movie => (
                    <Link key={movie._id} href={`/movie/${movie._id}`} className="w-48 flex-shrink-0">
                      <div className="group relative cursor-pointer overflow-hidden rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-black/50">
                        <div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-netflix-gray">
                          <img
                            src={movie.poster}
                            alt={movie.title}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}

            {movies.length === 0 && (
              <div className="mx-auto max-w-7xl px-4 md:px-8">
                <div className="flex min-h-[300px] items-center justify-center rounded-lg border border-netflix-gray/30 bg-netflix-darkGray/50">
                  <div className="text-center">
                    <p className="mb-4 text-xl font-medium text-white">Aucun film disponible</p>
                    <p className="text-netflix-lightGray">Ajoutez des films via le dashboard admin</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-netflix-gray/20 bg-netflix-darkGray py-8">
        <div className="mx-auto max-w-7xl px-4 text-center text-sm text-netflix-lightGray md:px-8">
          <p>© 2024 StreamFlix - Tous droits réservés</p>
        </div>
      </footer>
    </div>
  );
}