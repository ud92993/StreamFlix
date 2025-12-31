'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function HomePage() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [activeNav, setActiveNav] = useState('home');
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const response = await fetch('/api/movies?limit=200');
      const data = await response.json();
      
      if (data.success) {
        setMovies(data.data);
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredMovies = searchTerm 
    ? movies.filter(m => m.title.toLowerCase().includes(searchTerm.toLowerCase()))
    : movies;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a]">
        <div className="text-center">
          <div className="mb-4 h-16 w-16 animate-spin rounded-full border-4 border-gray-800 border-t-[#E50914]"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  const featuredMovie = filteredMovies[0];
  const recommendedMovies = filteredMovies.slice(0, 12);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a]">
      {/* Left Sidebar - Centered Icons */}
      <aside className="fixed left-0 top-0 z-50 hidden h-full w-20 flex-col items-center justify-center gap-8 border-r border-white/5 bg-black/50 backdrop-blur-xl lg:flex">
        {/* Logo en haut */}
        <div className="absolute top-8 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#E50914] to-[#b20710] shadow-lg shadow-[#E50914]/30">
          <svg className="h-7 w-7 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
          </svg>
        </div>

        {/* Navigation Icons - Centrés */}
        <nav className="flex flex-col items-center gap-6">
          {/* Home */}
          <button
            onClick={() => setActiveNav('home')}
            className={`group relative flex h-12 w-12 items-center justify-center rounded-xl transition-all ${
              activeNav === 'home'
                ? 'bg-[#E50914]/20 shadow-lg shadow-[#E50914]/30'
                : 'hover:bg-white/10'
            }`}
          >
            <svg className={`h-6 w-6 transition-all ${activeNav === 'home' ? 'text-[#E50914] drop-shadow-[0_0_8px_rgba(229,9,20,0.8)]' : 'text-white/70'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </button>

          {/* Search */}
          <button
            onClick={() => {
              setActiveNav('search');
              setShowSearch(!showSearch);
            }}
            className={`group relative flex h-12 w-12 items-center justify-center rounded-xl transition-all ${
              activeNav === 'search'
                ? 'bg-[#E50914]/20 shadow-lg shadow-[#E50914]/30'
                : 'hover:bg-white/10'
            }`}
          >
            <svg className={`h-6 w-6 transition-all ${activeNav === 'search' ? 'text-[#E50914] drop-shadow-[0_0_8px_rgba(229,9,20,0.8)]' : 'text-white/70'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          {/* Bookmark / My List */}
          <button
            onClick={() => setActiveNav('bookmark')}
            className={`group relative flex h-12 w-12 items-center justify-center rounded-xl transition-all ${
              activeNav === 'bookmark'
                ? 'bg-[#E50914]/20 shadow-lg shadow-[#E50914]/30'
                : 'hover:bg-white/10'
            }`}
          >
            <svg className={`h-6 w-6 transition-all ${activeNav === 'bookmark' ? 'text-[#E50914] drop-shadow-[0_0_8px_rgba(229,9,20,0.8)]' : 'text-white/70'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </button>

          {/* Categories */}
          <button
            onClick={() => setActiveNav('categories')}
            className={`group relative flex h-12 w-12 items-center justify-center rounded-xl transition-all ${
              activeNav === 'categories'
                ? 'bg-[#E50914]/20 shadow-lg shadow-[#E50914]/30'
                : 'hover:bg-white/10'
            }`}
          >
            <svg className={`h-6 w-6 transition-all ${activeNav === 'categories' ? 'text-[#E50914] drop-shadow-[0_0_8px_rgba(229,9,20,0.8)]' : 'text-white/70'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
        </nav>

        {/* User Profile en bas */}
        <Link
          href="/login"
          className="absolute bottom-8 flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 transition-all hover:bg-white/20"
        >
          <svg className="h-6 w-6 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </Link>
      </aside>

      {/* Search Sidebar - Slide from right */}
      <div className={`fixed right-0 top-0 z-50 h-full w-96 transform bg-black/95 backdrop-blur-xl transition-transform duration-300 ${showSearch ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex h-full flex-col p-8">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">Search</h2>
            <button
              onClick={() => setShowSearch(false)}
              className="rounded-full p-2 transition-colors hover:bg-white/10"
            >
              <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="relative mb-8">
            <input
              type="text"
              placeholder="Search movies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-white/20 bg-white/10 px-5 py-4 pl-12 text-white placeholder-white/60 backdrop-blur-xl transition-all focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-[#E50914]/50"
              autoFocus
            />
            <svg className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Search Results */}
          <div className="flex-1 overflow-y-auto">
            {searchTerm && (
              <div className="space-y-4">
                {filteredMovies.slice(0, 8).map((movie) => (
                  <Link
                    key={movie._id}
                    href={`/movie/${movie._id}`}
                    onClick={() => setShowSearch(false)}
                    className="flex gap-4 rounded-xl p-3 transition-colors hover:bg-white/10"
                  >
                    <img
                      src={movie.poster}
                      alt={movie.title}
                      className="h-24 w-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-white line-clamp-2">{movie.title}</h3>
                      <p className="mt-1 text-sm text-gray-400">{movie.year}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Overlay for search */}
      {showSearch && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={() => setShowSearch(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 lg:ml-20">
        {/* Hero Section with Floating Pills */}
        {featuredMovie && (
          <div className="relative h-[700px] overflow-hidden">
            <div className="absolute inset-0">
              <img
                src={featuredMovie.poster}
                alt={featuredMovie.title}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
            </div>

            {/* Floating Pills on Hero */}
            <div className="absolute left-12 top-8 z-10 flex gap-3">
              <button
                onClick={() => setActiveTab('all')}
                className={`rounded-full px-6 py-3 text-sm font-bold backdrop-blur-xl transition-all ${
                  activeTab === 'all'
                    ? 'bg-[#E50914] text-white shadow-lg shadow-[#E50914]/40'
                    : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setActiveTab('movies')}
                className={`rounded-full px-6 py-3 text-sm font-bold backdrop-blur-xl transition-all ${
                  activeTab === 'movies'
                    ? 'bg-[#E50914] text-white shadow-lg shadow-[#E50914]/40'
                    : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
                }`}
              >
                Movies
              </button>
              <button
                onClick={() => setActiveTab('tvshows')}
                className={`rounded-full px-6 py-3 text-sm font-bold backdrop-blur-xl transition-all ${
                  activeTab === 'tvshows'
                    ? 'bg-[#E50914] text-white shadow-lg shadow-[#E50914]/40'
                    : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
                }`}
              >
                TV Shows
              </button>
              <button
                onClick={() => setActiveTab('livetv')}
                className={`rounded-full px-6 py-3 text-sm font-bold backdrop-blur-xl transition-all ${
                  activeTab === 'livetv'
                    ? 'bg-[#E50914] text-white shadow-lg shadow-[#E50914]/40'
                    : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
                }`}
              >
                Live TV
              </button>
            </div>
            
            {/* Content Overlay */}
            <div className="relative flex h-full items-center px-12 lg:px-20">
              <div className="max-w-2xl">
                <h1 className="mb-6 text-6xl font-bold text-white drop-shadow-2xl lg:text-7xl">
                  {featuredMovie.title}
                </h1>
                
                <div className="mb-6 flex flex-wrap items-center gap-4 text-sm font-semibold text-gray-200">
                  <span className="flex items-center gap-2">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    {featuredMovie.year}
                  </span>
                  {featuredMovie.duration && featuredMovie.duration !== 'N/A' && (
                    <>
                      <span>•</span>
                      <span>{featuredMovie.duration}</span>
                    </>
                  )}
                  <span>•</span>
                  <span className="rounded-md bg-[#E50914] px-2 py-1 font-bold">HD</span>
                </div>
                
                <p className="mb-8 line-clamp-3 text-lg leading-relaxed text-gray-100 drop-shadow-lg">
                  {featuredMovie.description}
                </p>
                
                <div className="flex flex-wrap gap-4">
                  <Link
                    href={`/movie/${featuredMovie._id}`}
                    className="group flex items-center gap-3 rounded-full bg-white px-8 py-4 font-bold text-black shadow-2xl shadow-white/30 transition-all hover:scale-105 hover:shadow-white/50"
                  >
                    <svg className="h-6 w-6 transition-transform group-hover:scale-110" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                    </svg>
                    Play Now
                  </Link>
                  <button className="flex items-center gap-3 rounded-full border-2 border-white/40 bg-white/10 px-8 py-4 font-bold text-white backdrop-blur-xl transition-all hover:bg-white/20">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    My List
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recommended Row */}
        <div className="px-12 py-16">
          <h2 className="mb-8 text-3xl font-bold text-white">Recommended</h2>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {recommendedMovies.map((movie, index) => (
              <Link key={movie._id} href={`/movie/${movie._id}`} className="group">
                <div className={`relative overflow-hidden rounded-2xl transition-all duration-500 hover:scale-105 ${
                  index === 3 
                    ? 'ring-4 ring-[#E50914] shadow-2xl shadow-[#E50914]/60' 
                    : 'hover:shadow-2xl hover:shadow-[#E50914]/40'
                }`}>
                  <div className="relative aspect-[2/3]">
                    <img
                      src={movie.poster}
                      alt={movie.title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3 className="mb-1 text-sm font-bold text-white line-clamp-2">
                          {movie.title}
                        </h3>
                        <p className="text-xs text-gray-300">{movie.year}</p>
                      </div>
                    </div>
                  </div>
                  {index === 3 && (
                    <div className="absolute right-3 top-3 rounded-full bg-[#E50914] p-2 shadow-lg shadow-[#E50914]/60">
                      <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}