'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function HomePage() {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const CATEGORIES = [
    { id: 'all', name: 'Tous', icon: 'M4 6h16M4 12h16M4 18h16' },
    { id: 'movies', name: 'Films', icon: 'M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z' },
    { id: 'tvshows', name: 'Séries TV', icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
  ];

  const GENRES = [
    'Action',
    'Aventure', 
    'Animation',
    'Comédie',
    'Crime',
    'Documentaire',
    'Drame',
    'Familial',
    'Fantastique',
    'Histoire',
    'Horreur',
    'Musique',
    'Mystère',
    'Romance',
    'Science-Fiction',
    'Thriller',
    'Guerre',
    'Western'
  ];

  const [selectedGenre, setSelectedGenre] = useState('all');

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const response = await fetch('/api/movies?limit=200');
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
      filtered = filtered.filter(movie => {
        if (Array.isArray(movie.genres)) {
          return movie.genres.includes(selectedGenre);
        }
        return movie.genre === selectedGenre;
      });
    }

    if (searchTerm) {
      filtered = filtered.filter(movie =>
        movie.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredMovies(filtered);
  }, [searchTerm, selectedGenre, movies]);

  // Grouper par genre
  const moviesByGenre = {};
  filteredMovies.forEach(movie => {
    const genres = Array.isArray(movie.genres) ? movie.genres : [movie.genre];
    genres.forEach(genre => {
      if (genre) {
        if (!moviesByGenre[genre]) {
          moviesByGenre[genre] = [];
        }
        moviesByGenre[genre].push(movie);
      }
    });
  });

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

  const featuredMovie = filteredMovies[0];

  return (
    <div className="flex min-h-screen bg-[#0a0a0a]">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-[#141414] transition-transform duration-300 lg:relative lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex items-center gap-3 border-b border-gray-800 px-6 py-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-[#E50914] to-[#b20710]">
              <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-white">StreamFlix</h1>
          </div>

          {/* Search */}
          <div className="border-b border-gray-800 p-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg bg-[#1f1f1f] px-4 py-2.5 pl-10 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#E50914]"
              />
              <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Categories */}
          <div className="border-b border-gray-800 p-4">
            <div className="space-y-1">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    setSidebarOpen(false);
                  }}
                  className={`flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-[#E50914] text-white shadow-lg shadow-[#E50914]/20'
                      : 'text-gray-400 hover:bg-[#1f1f1f] hover:text-white'
                  }`}
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={cat.icon} />
                  </svg>
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Genres */}
          <nav className="flex-1 overflow-y-auto p-4">
            <h3 className="mb-3 px-4 text-xs font-semibold uppercase tracking-wider text-gray-500">Genres</h3>
            <div className="space-y-1">
              <button
                onClick={() => setSelectedGenre('all')}
                className={`w-full rounded-lg px-4 py-2 text-left text-sm font-medium transition-all ${
                  selectedGenre === 'all'
                    ? 'bg-[#E50914] text-white'
                    : 'text-gray-400 hover:bg-[#1f1f1f] hover:text-white'
                }`}
              >
                Tous les genres
              </button>
              {GENRES.map((genre) => (
                <button
                  key={genre}
                  onClick={() => setSelectedGenre(genre)}
                  className={`w-full rounded-lg px-4 py-2 text-left text-sm font-medium transition-all ${
                    selectedGenre === genre
                      ? 'bg-[#E50914] text-white'
                      : 'text-gray-400 hover:bg-[#1f1f1f] hover:text-white'
                  }`}
                >
                  {genre}
                </button>
              ))}
            </div>
          </nav>

          {/* Admin */}
          <div className="border-t border-gray-800 p-4">
            <Link
              href="/admin/login"
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#1f1f1f] px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-[#2a2a2a]"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Admin
            </Link>
          </div>
        </div>
      </aside>

      {/* Overlay mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 overflow-x-hidden">
        {/* Header mobile */}
        <header className="sticky top-0 z-30 flex items-center gap-4 border-b border-gray-800 bg-[#0a0a0a]/95 px-4 py-4 backdrop-blur-md lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-white"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-xl font-bold text-white">StreamFlix</h1>
        </header>

        {/* Hero section */}
        {featuredMovie && (
          <div className="relative h-[500px] lg:h-[600px]">
            <div className="absolute inset-0">
              <img
                src={featuredMovie.poster}
                alt={featuredMovie.title}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/90 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
            </div>
            <div className="relative flex h-full items-end px-6 pb-16 lg:items-center lg:px-16 lg:pb-0">
              <div className="max-w-2xl">
                <div className="mb-4 inline-block rounded-full bg-[#E50914] px-4 py-1 text-xs font-bold uppercase tracking-wider text-white">
                  À la une
                </div>
                <h2 className="mb-4 text-4xl font-bold text-white drop-shadow-2xl lg:text-6xl">
                  {featuredMovie.title}
                </h2>
                <div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-gray-300">
                  <span className="flex items-center gap-1">
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    {featuredMovie.year}
                  </span>
                  <span>•</span>
                  <span>{Array.isArray(featuredMovie.genres) ? featuredMovie.genres.join(', ') : featuredMovie.genre}</span>
                  {featuredMovie.duration && featuredMovie.duration !== 'N/A' && (
                    <>
                      <span>•</span>
                      <span>{featuredMovie.duration}</span>
                    </>
                  )}
                </div>
                <p className="mb-6 line-clamp-3 text-gray-300 drop-shadow-lg">
                  {featuredMovie.description}
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href={`/movie/${featuredMovie._id}`}
                    className="group flex items-center gap-2 rounded-lg bg-[#E50914] px-8 py-3 font-bold text-white shadow-xl shadow-[#E50914]/30 transition-all hover:bg-[#b20710] hover:shadow-2xl hover:shadow-[#E50914]/40"
                  >
                    <svg className="h-5 w-5 transition-transform group-hover:scale-110" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                    </svg>
                    Regarder maintenant
                  </Link>
                  <button className="flex items-center gap-2 rounded-lg bg-white/10 px-6 py-3 font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Ma liste
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Content sections */}
        <div className="space-y-12 px-6 py-12 lg:px-16">
          {selectedGenre === 'all' ? (
            // Affichage par carrousels de genres
            <>
              {Object.entries(moviesByGenre).slice(0, 6).map(([genre, genreMovies]) => (
                <div key={genre}>
                  <div className="mb-6 flex items-center justify-between">
                    <h3 className="text-2xl font-bold text-white">{genre}</h3>
                    <button 
                      onClick={() => setSelectedGenre(genre)}
                      className="text-sm font-medium text-gray-400 transition-colors hover:text-[#E50914]"
                    >
                      Voir tout →
                    </button>
                  </div>
                  <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                    {genreMovies.slice(0, 10).map(movie => (
                      <Link key={movie._id} href={`/movie/${movie._id}`} className="group flex-shrink-0">
                        <div className="w-48 overflow-hidden rounded-xl bg-[#1f1f1f] transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-[#E50914]/20">
                          <div className="relative aspect-[2/3]">
                            <img
                              src={movie.poster}
                              alt={movie.title}
                              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                              <div className="absolute bottom-0 left-0 right-0 p-4">
                                <h4 className="mb-1 text-sm font-bold text-white line-clamp-2">
                                  {movie.title}
                                </h4>
                                <span className="text-xs text-gray-300">{movie.year}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </>
          ) : (
            // Affichage en grille pour un genre spécifique
            <div>
              <h3 className="mb-8 text-3xl font-bold text-white">
                {selectedGenre}
                <span className="ml-3 text-lg font-normal text-gray-400">
                  ({filteredMovies.length} films)
                </span>
              </h3>
              {filteredMovies.length > 0 ? (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                  {filteredMovies.map(movie => (
                    <Link key={movie._id} href={`/movie/${movie._id}`} className="group">
                      <div className="overflow-hidden rounded-xl bg-[#1f1f1f] transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-[#E50914]/20">
                        <div className="relative aspect-[2/3]">
                          <img
                            src={movie.poster}
                            alt={movie.title}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                            <div className="absolute bottom-0 left-0 right-0 p-3">
                              <h4 className="mb-1 text-sm font-bold text-white line-clamp-2">
                                {movie.title}
                              </h4>
                              <span className="text-xs text-gray-300">{movie.year}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="flex min-h-[400px] items-center justify-center rounded-xl border border-gray-800 bg-[#141414]">
                  <div className="text-center">
                    <svg className="mx-auto mb-4 h-16 w-16 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                    </svg>
                    <p className="text-gray-400">Aucun film trouvé</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}