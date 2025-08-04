import type { Genre } from "./movie.type";

export async function fetchGenres(): Promise<Genre[]> {
  const BASE_URL = "https://api.themoviedb.org/3";

  try {
    const res = await fetch(
      `${BASE_URL}/genre/movie/list?language=ko`,
      {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_TMDB_ACCESS_TOKEN}`,
          accept: "application/json",
        },
      }
    );

    if (!res.ok) throw new Error("장르 불러오기 실패");

    const data = await res.json();

    // 로맨스 장르(id: 10749) 제거
    const filteredGenres = data.genres.filter((genre: Genre) => genre.id !== 10749);

    return filteredGenres;
  } catch (err) {
    console.error("장르 요청 에러", err);
    return [];
  }
}



export default fetchGenres