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
      {/* Header */}
      <header className="bg-netflix-black/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <Link href="/">
            <h1 className="text-3xl font-bold text-netflix-red">StreamFlix</h1>
          </Link>
          <Link
            href="/admin/login"
            className="rounded-md bg-netflix-gray px-4 py-2 text-sm font-medium transition-colors hover:bg-netflix-gray/80"
          >
            Admin
          </Link>
        </div>
      </header>

      {/* Barre de recherche */}
      <div className="sticky top-0 z-30 bg-netflix-black/95 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="mb-4 flex items-center gap-4">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Rechercher un film..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full rounded-md bg-netflix-gray px-4 py-3 pl-12 text-white placeholder-netflix-lightGray focus:outline-none focus:ring-2 focus:ring-netflix-red"
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
                className={`flex-shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  selectedGenre === genre
                    ? 'bg-netflix-red text-white'
                    : 'bg-netflix-gray text-netflix-lightGray hover:bg-netflix-gray/80'
                }`}
              >
                {genre === 'all' ? 'Tous' : genre}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Contenu */}
      <main className="pb-20 pt-8">
        {searchTerm || selectedGenre !== 'all' ? (
          <div className="mx-auto max-w-7xl px-4">
            <h2 className="mb-6 text-2xl font-bold text-white">
              {searchTerm 
                ? `Résultats pour "${searchTerm}"` 
                : `Films ${selectedGenre}`}
              {' '}({filteredMovies.length})
            </h2>
            
            {filteredMovies.length > 0 ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {filteredMovies.map(movie => (
                  <Link key={movie._id} href={`/movie/${movie._id}`}>
                    <div className="group relative cursor-pointer transition-transform duration-300 hover:scale-105">
                      <div className="relative aspect-[2/3] overflow-hidden rounded-md bg-netflix-gray">
                        <img
                          src={movie.poster}
                          alt={movie.title}
                          className="h-full w-full object-cover transition-opacity duration-300 group-hover:opacity-80"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                          <div className="absolute bottom-0 left-0 right-0 p-4">
                            <h3 className="mb-1 text-sm font-bold text-white line-clamp-2">
                              {movie.title}
                            </h3>
                            <div className="flex items-center gap-2 text-xs text-netflix-lightGray">
                              <span>{movie.year}</span>
                              <span>•</span>
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
              <div className="py-20 text-center">
                <p className="text-xl text-netflix-lightGray">Aucun film trouvé</p>
              </div>
            )}
          </div>
        ) : (
          <div>
            {movies.length > 0 && (
              <div className="mb-12">
                <h2 className="mb-4 px-4 text-2xl font-bold text-white">🔥 Nouveautés</h2>
                <div className="flex gap-3 overflow-x-auto px-4 scrollbar-hide">
                  {movies.slice(0, 10).map(movie => (
                    <Link key={movie._id} href={`/movie/${movie._id}`} className="w-48 flex-shrink-0">
                      <div className="group relative cursor-pointer transition-transform duration-300 hover:scale-105">
                        <div className="relative aspect-[2/3] overflow-hidden rounded-md bg-netflix-gray">
                          <img
                            src={movie.poster}
                            alt={movie.title}
                            className="h-full w-full object-cover"
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
                <h2 className="mb-4 px-4 text-2xl font-bold text-white">{genre}</h2>
                <div className="flex gap-3 overflow-x-auto px-4 scrollbar-hide">
                  {genreMovies.map(movie => (
                    <Link key={movie._id} href={`/movie/${movie._id}`} className="w-48 flex-shrink-0">
                      <div className="group relative cursor-pointer transition-transform duration-300 hover:scale-105">
                        <div className="relative aspect-[2/3] overflow-hidden rounded-md bg-netflix-gray">
                          <img
                            src={movie.poster}
                            alt={movie.title}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}

            {movies.length === 0 && (
              <div className="py-20 text-center">
                <p className="text-xl text-netflix-lightGray">
                  Aucun film disponible. Ajoutez-en via le dashboard admin !
                </p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-netflix-gray bg-netflix-darkGray py-8">
        <div className="mx-auto max-w-7xl px-4 text-center text-sm text-netflix-lightGray">
          <p>© 2024 StreamFlix - Tous droits réservés</p>
        </div>
      </footer>
    </div>
  );
}