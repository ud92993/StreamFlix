import { NextResponse } from 'next/server';

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

    // Recherche sur TMDB
    const searchResponse = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}&language=fr-FR`
    );

    const searchData = await searchResponse.json();

    if (!searchResponse.ok) {
      throw new Error('Erreur TMDB API');
    }

    // Pour chaque film, récupérer les détails complets (avec durée)
    const moviesWithDetails = await Promise.all(
      searchData.results.slice(0, 10).map(async (movie) => {
        try {
          // Récupérer les détails du film
          const detailsResponse = await fetch(
            `https://api.themoviedb.org/3/movie/${movie.id}?api_key=${apiKey}&language=fr-FR`
          );
          const details = await detailsResponse.json();

          // Convertir la durée en format HH:MM:SS
          const runtime = details.runtime || 0;
          const hours = Math.floor(runtime / 60);
          const minutes = runtime % 60;
          const duration = runtime > 0 ? `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00` : 'N/A';

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
            runtimeMinutes: runtime, // Pour info
          };
        } catch (error) {
          console.error(`Erreur détails film ${movie.id}:`, error);
          // Retourner le film sans détails en cas d'erreur
          return {
            id: movie.id,
            title: movie.title,
            year: movie.release_date ? new Date(movie.release_date).getFullYear() : null,
            description: movie.overview || 'Aucune description disponible',
            poster: movie.poster_path 
              ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
              : null,
            duration: 'N/A',
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