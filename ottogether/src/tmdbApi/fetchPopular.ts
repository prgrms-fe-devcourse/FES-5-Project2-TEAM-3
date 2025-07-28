const BASE_URL = 'https://api.themoviedb.org/3';
const TOKEN = import.meta.env.VITE_TMDB_ACCESS_TOKEN;

export async function fetchPopularMovies() {
  const res = await fetch(`${BASE_URL}/movie/popular?language=ko-KR`, {
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${TOKEN}`,
    },
  });

  if (!res.ok) throw new Error('TMDB불러오기 실패');

  const data = await res.json();
  return data.results;
}
