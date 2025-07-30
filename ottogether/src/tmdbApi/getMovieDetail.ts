import type { MovieData } from "./movie.type";


// const BASE_URL = 'https://api.themoviedb.org/3';
const BASE_URL = "/api/tmdb";

const TOKEN = import.meta.env.VITE_TMDB_ACCESS_TOKEN;

export async function getMovieDetail(id: number): Promise<MovieData | null> {
  try {
    const res = await fetch(`${BASE_URL}/movie/${id}?language=ko-KR`, {
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${TOKEN}`,
      },
    });

    if (!res.ok) throw new Error("영화 상세 정보 요청 실패");

    const data = await res.json();
    return data;
  } catch (err) {
    console.error("영화 상세 오류:", err);
    return null;
  }
}