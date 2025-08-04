import type { MovieData } from "./movie.type";
import { type SeriesData, normalizeSeriesData } from "./series.type";

const BASE_URL = "https://api.themoviedb.org/3";
const TOKEN = import.meta.env.VITE_TMDB_ACCESS_TOKEN;

export async function fetchContentById(id: number): Promise<MovieData | null> {
  try {
    // 영화 먼저 요청
    let res = await fetch(`${BASE_URL}/movie/${id}?language=ko-KR`, {
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${TOKEN}`,
      },
    });

    if (res.ok) {
      const data = await res.json();
      return {
        ...(data as MovieData),
        media_type: "movie",
      };
    }

    // 실패하면 드라마(tv) 요청
    res = await fetch(`${BASE_URL}/tv/${id}?language=ko-KR`, {
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${TOKEN}`,
      },
    });

    if (res.ok) {
      const data = await res.json();
      return normalizeSeriesData(data as SeriesData);
    }

    throw new Error("영화/드라마 상세 정보 요청 실패");
  } catch (error) {
    console.error("fetchContentById 오류:", error);
    return null;
  }
}
