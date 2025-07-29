import type { MovieData } from "./movie.type";

const BASE_URL = "https://api.themoviedb.org/3";
const TOKEN = import.meta.env.VITE_TMDB_ACCESS_TOKEN;

export async function getMovieProvider(movies: MovieData[]): Promise<MovieData[]> {
  return Promise.all(
    movies.map(async (movie) => {
      try {
        const res = await fetch(`${BASE_URL}/movie/${movie.id}/watch/providers`, {
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${TOKEN}`,
          },
        });

        const data = await res.json();
        const providerLogoPath = data?.results?.KR?.flatrate?.[0]?.logo_path || null;

        return {
          ...movie,
          provider_logo_path: providerLogoPath,
        };
      } catch (err) {
        console.warn("provider fetch error for", movie.title);
        return { ...movie, provider_logo_path: null };
      }
    })
  );
}
