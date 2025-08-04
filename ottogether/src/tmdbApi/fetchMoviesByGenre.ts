import type { MovieData } from "./movie.type";

export async function fetchMoviesByGenre(genreId: number): Promise<MovieData[]> {
  try {
    const res = await fetch(
  `https://api.themoviedb.org/3/discover/movie?with_genres=${genreId}&language=ko&sort_by=popularity.desc`,
  {
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_TMDB_ACCESS_TOKEN}`,
      accept: "application/json",
        },
      }
    );

    if (!res.ok) throw new Error("장르별 영화 요청 실패");

    const data = await res.json();

    const movies: MovieData[] = data.results.map((movie: any) => ({
      id: movie.id,
      title: movie.title,
      media_type: 'movie',
      poster_path: movie.poster_path,
      release_date: movie.release_date,
      vote_average: movie.vote_average,
      genre_names: [], 
      provider_logo_path: null, 
    }));

    return movies;
  } catch (err) {
    console.error("장르별 영화 에러:", err);
    return [];
  }
}
