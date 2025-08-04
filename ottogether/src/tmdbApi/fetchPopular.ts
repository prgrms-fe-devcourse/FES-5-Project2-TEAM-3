
// const BASE_URL = 'https://api.themoviedb.org/3';
const BASE_URL = 'https://api.themoviedb.org/3';

export async function fetchPopularMovies() {
  try {
    const res = await fetch(`${BASE_URL}/movie/popular?language=ko`, {
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_TMDB_ACCESS_TOKEN}`,
        accept: 'application/json',
      },
    });

    if (!res.ok) throw new Error('TMDB 불러오기 실패');

    const data = await res.json();

    return data.results.map((item: any) => ({
      ...item,
      media_type: 'movie', // 여기 좋음
    }));
  } catch (err) {
    console.error('🔥 인기 영화 요청 실패:', err);
    return [];
  }
}
