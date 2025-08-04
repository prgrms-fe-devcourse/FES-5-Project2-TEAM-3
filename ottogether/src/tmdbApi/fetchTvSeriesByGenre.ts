import type { MovieData } from "./movie.type";



export async function fetchTvSeriesByGenre(genreId: number): Promise<MovieData[]> {
  const BASE_URL = 'https://api.themoviedb.org/3';

  try {
    const res = await fetch(
      `${BASE_URL}/discover/tv?with_genres=${genreId}&language=ko&sort_by=popularity.desc`,
      {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_TMDB_ACCESS_TOKEN}`,
          accept: 'application/json',
        },
      }
    );

    if (!res.ok) throw new Error('장르별 TV 프로그램 요청 실패');

    const data = await res.json();

    const series: MovieData[] = data.results.map((item: any) => ({
      id: item.id,
      title: item.name,
      media_type: 'tv',
      poster_path: item.poster_path,
      release_date: item.first_air_date,
      vote_average: item.vote_average,
      genre_ids: item.genre_ids,
      genre_names: [],
      provider_logo_path: null,
      backdrop_path: item.backdrop_path,
      overview: item.overview,
    }));

    return series;
  } catch (err) {
    console.error('⚠️ TV 프로그램 에러:', err);
    return [];
  }
}
