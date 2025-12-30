import { NextResponse } from 'next/server';

// Mapping des genres TMDB vers nos genres
const GENRE_MAPPING = {
  28: 'Action',
  12: 'Aventure',
  16: 'Animation',
  35: 'Comédie',
  80: 'Crime',
  99: 'Documentaire',
  18: 'Drame',
  10751: 'Familial',
  14: 'Fantastique',
  36: 'Histoire',
  27: 'Horreur',
  10402: 'Musique',
  9648: 'Mystère',
  10749: 'Romance',
  878: 'Science-Fiction',
  10770: 'Téléfilm',
  53: 'Thriller',
  10752: 'Guerre',
  37: 'Western'
};

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');

    if (!query) {
      return NextResponse.json(
        { success: false, error: 'Query manquant' },
        { status: 400 }
      );
    }

    const apiKey = process.env.TMDB_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: 'TMDB API key non configurée' },
        { status: 500 }
      );
    }

    const searchResponse = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}&language=fr-FR`
    );

    const searchData = await searchResponse.json();

    if (!searchResponse.ok) {
      throw new Error('Erreur TMDB API');
    }

    const moviesWithDetails = await Promise.all(
      searchData.results.slice(0, 10).map(async (movie) => {
        try {
          const detailsResponse = await fetch(
            `https://api.themoviedb.org/3/movie/${movie.id}?api_key=${apiKey}&language=fr-FR`
          );
          const details = await detailsResponse.json();

          const runtime = details.runtime || 0;
          const hours = Math.floor(runtime / 60);
          const minutes = runtime % 60;
          const duration = runtime > 0 ? `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00` : 'N/A';

          // Convertir les IDs de genres TMDB en noms
          const genres = details.genres
            .map(g => GENRE_MAPPING[g.id])
            .filter(Boolean);

          return {
            id: movie.id,
            title: movie.title,
            year: movie.release_date ? new Date(movie.release_date).getFullYear() : null,
            description: movie.overview || 'Aucune description disponible',
            poster: movie.poster_path 
              ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
              : null,
            backdrop: movie.backdrop_path
              ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
              : null,
            duration: duration,
            genres: genres,
          };
        } catch (error) {
          console.error(`Erreur détails film ${movie.id}:`, error);
          return {
            id: movie.id,
            title: movie.title,
            year: movie.release_date ? new Date(movie.release_date).getFullYear() : null,
            description: movie.overview || 'Aucune description disponible',
            poster: movie.poster_path 
              ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
              : null,
            duration: 'N/A',
            genres: [],
          };
        }
      })
    );

    return NextResponse.json({
      success: true,
      data: moviesWithDetails
    });

  } catch (error) {
    console.error('Erreur TMDB search:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}