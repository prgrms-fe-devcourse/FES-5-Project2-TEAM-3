import S from './SearchMovie.module.css';
import { useEffect, useState } from 'react';
import type { MovieData } from '../../tmdbApi/movie.type';
import { applyFilters } from '../../util/applyFilters';
import SearchNotFound from './SearchNotFound';
import MovieCard from '../movieCard/MovieCard';

interface SearchProps {
  keyword: string;
  filters: {
    ottList: string[];
    genreList: string[];
    ratingRange: [number, number];
    releaseRange: [string, string];
  }
}

function SearchMovie({ keyword, filters}:SearchProps) {
  const [ movieList, setMovieList ] = useState<MovieData[]>([]);
  const [ isLoading, setIsLoading ] = useState<boolean>(false);

  useEffect(() => {
    const fetchMovies = async () => {
      if (!keyword.trim()) return;

      try {
        setIsLoading(true);
        const res = await fetch(
          `/api/tmdb/search/movie?query=${encodeURIComponent(keyword)}&language=ko-KR&include_adult=false`,
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_TMDB_ACCESS_TOKEN}`,
              accept: "application/json",
            },
          }
        );
        if (!res.ok) throw new Error("TMDB 요청 실패");
        const data = await res.json();

        const filtered = await applyFilters({
          initialContentsList: data.results,
          filters,
          category: 'movie'
        });

        setMovieList(filtered.filter(movie => movie !== null));
      } catch (err) {
        console.error('영화 검색 결과 불러오기 실패:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchMovies();
  }, [keyword, filters]);

  console.log(movieList);
  return (
    <section className={S["movie-result-container"]}>
      { isLoading && <p>로딩 중...</p> }
      { !isLoading && movieList.length === 0 &&
        <SearchNotFound />
      }
      <div className={S["movie-list"]}>
        {
          movieList.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))
        }
      </div>
    </section>
  )
}


export default SearchMovie