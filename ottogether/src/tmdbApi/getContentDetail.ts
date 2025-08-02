import type { MovieData } from "./movie.type";
import { normalizeSeriesData, type SeriesData } from "./series.type";

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

export async function getContentDetail(
  mediaType: "movie" | "tv",
  id: number
): Promise<MovieData | null> {
  try {
    const res = await fetch(`${BASE_URL}/${mediaType}/${id}?api_key=${TMDB_API_KEY}&language=ko-KR`);
    if (!res.ok) {
      throw new Error("Failed to fetch content detail");
    }

    const data = await res.json();

    if (mediaType === "movie") {
      return {
        id: data.id,
        title: data.title,
        poster_path: data.poster_path,
        release_date: data.release_date,
        vote_average: data.vote_average,
        genre_ids: data.genres.map((g: any) => g.id),
        genre_names: data.genres.map((g: any) => g.name),
        provider_logo_path: null,
        backdrop_path: data.backdrop_path,
        overview: data.overview,
        media_type: "movie",
      };
    }

    if (mediaType === "tv") {
      const seriesData: SeriesData = {
        id: data.id,
        name: data.name,
        poster_path: data.poster_path,
        first_air_date: data.first_air_date,
        vote_average: data.vote_average,
        genre_ids: data.genres.map((g: any) => g.id),
        provider_logo_path: null,
        backdrop_path: data.backdrop_path,
        overview: data.overview,
      };
      return normalizeSeriesData(seriesData);
    }

    return null;
  } catch (error) {
    console.error("getContentDetail Error:", error);
    return null;
  }
}
