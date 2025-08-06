import type { MovieData } from "./movie.type";
import { type SeriesData, normalizeSeriesData } from "./series.type";

const BASE_URL = "https://api.themoviedb.org/3";
const TOKEN = import.meta.env.VITE_TMDB_ACCESS_TOKEN;

export async function fetchContentById(
  id: number,
  mediaType: "movie" | "tv"
): Promise<MovieData | null> {
  try {
    let url = "";

    if (mediaType === "movie") {
      url = `${BASE_URL}/movie/${id}?language=ko-KR`;
    } else if (mediaType === "tv") {
      url = `${BASE_URL}/tv/${id}?language=ko-KR`;
    } else {
      throw new Error("지원하지 않는 mediaType");
    }

    const res = await fetch(url, {
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${TOKEN}`,
      },
    });

    if (!res.ok) throw new Error(`${mediaType} 상세 정보 요청 실패`);

    const data = await res.json();

    if (mediaType === "movie") {
      return {
        ...(data as MovieData),
        media_type: "movie",
      };
    } else {
      return normalizeSeriesData(data as SeriesData);
    }
  } catch (error) {
    console.error("fetchContentById 오류:", error);
    return null;
  }
}