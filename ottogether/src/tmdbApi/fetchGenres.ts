import type { Genre } from "./movie.type";



export async function fetchGenres(): Promise<Genre[]> {
  try {
    const res = await fetch(
      // `https://api.themoviedb.org/3/genre/movie/list?language=ko`,
      `/api/tmdb/genre/movie/list?language=ko`,
      {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_TMDB_ACCESS_TOKEN}`,
          accept: "application/json",
        },
      }
    );

    if (!res.ok) throw new Error("장르 불러오기 실패");

    const data = await res.json();
    return data.genres; 
  } catch (err) {
    console.error("장르 요청 에러", err);
    return [];
  }
}


export default fetchGenres