import Image from "next/image";

/**
 * Récupère les données du film (exemple TMDB).
 * Adaptez l'URL / la clé TMDB selon votre configuration.
 */
async function getMovie(id) {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.TMDB_API_KEY}`,
    { next: { revalidate: 60 } }
  );
  if (!res.ok) {
    throw new Error("Failed to fetch movie data");
  }
  return res.json();
}

export default async function MoviePage({ params }) {
  const { id } = params;
  const movie = await getMovie(id);

  return (
    <main style={{ padding: "1rem", maxWidth: 960, margin: "0 auto" }}>
      <h1>{movie.title}</h1>

      <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
        <div style={{ minWidth: 200 }}>
          {movie.poster_path ? (
            <Image
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title || "Poster"}
              width={300}
              height={450}
              style={{ borderRadius: 6 }}
            />
          ) : (
            <div
              style={{
                width: 300,
                height: 450,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#eee",
                borderRadius: 6,
              }}
            >
              No poster available
            </div>
          )}
        </div>

        <section style={{ flex: 1 }}>
          <h2>Overview</h2>
          <p>{movie.overview}</p>

          <p>
            <strong>Release date:</strong> {movie.release_date || "N/A"}
          </p>

          {movie.tagline && (
            <p style={{ fontStyle: "italic", color: "#666" }}>
              {movie.tagline}
            </p>
          )}
        </section>
      </div>
    </main>
  );
}