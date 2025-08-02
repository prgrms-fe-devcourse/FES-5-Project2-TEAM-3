import { fetchMoviesByGenre } from "./fetchMoviesByGenre";
import {fetchTvSeriesByGenre} from "./fetchTvSeriesByGenre";
import type { MovieData } from "./movie.type";

export async function fetchContentsByGenre(
  genreId: number
): Promise<MovieData[]> {
  const [movies, tvShows] = await Promise.all([
    fetchMoviesByGenre(genreId),
    fetchTvSeriesByGenre(genreId), 
  ]);


  const combined = [...movies, ...tvShows];
  combined.sort((a, b) => {
    return new Date(b.release_date).getTime() - new Date(a.release_date).getTime();
  });

  return combined;
}
