import { fetchMoviesByGenre } from "./fetchMoviesByGenre";
import {fetchTvSeriesByGenre} from "./fetchTvSeriesByGenre";
import type { MovieData } from "./movie.type";

export async function fetchContentsByGenre(
  genreId: number
): Promise<MovieData[]> {
  const [movies, tvShows] = await Promise.all([
    fetchMoviesByGenre(genreId),
    fetchTvSeriesByGenre(genreId), // 이미 MovieData[]로 변환됨
  ]);

  // 영화 + TV 통합 후 날짜순 정렬
  const combined = [...movies, ...tvShows];
  combined.sort((a, b) => {
    return new Date(b.release_date).getTime() - new Date(a.release_date).getTime();
  });

  return combined;
}
