import type { MovieData } from "./movie.type";

export type SeriesData = {
  id: number;
  name: string;
  poster_path: string;
  first_air_date: string;
  vote_average: number;
  genre_ids: number[];
  provider_logo_path?: string | null;
  backdrop_path: string | null;
  overview: string | null;
	tagline : string;
	media_type : "movie" | "tv";
	original_language : string,
}

export function normalizeSeriesData(series: SeriesData): MovieData {
  return {
    id: series.id,
    title: series.name,
    poster_path: series.poster_path,
    release_date: series.first_air_date,
    vote_average: series.vote_average,
    genre_ids: series.genre_ids,
    provider_logo_path: series.provider_logo_path ?? null,
    backdrop_path: series.backdrop_path ?? null,
    overview: series.overview ?? null,
		tagline : series.tagline,
		media_type : series.media_type,
		original_language : series.original_language,
  };
}


