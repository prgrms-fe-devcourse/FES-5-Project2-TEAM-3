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

const TMDB_HEADER_INFO = {
              Authorization: `Bearer ${import.meta.env.VITE_TMDB_ACCESS_TOKEN}`,
              accept: "application/json",
            }

function SearchMovie({ keyword, filters }:SearchProps) {
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
            headers: TMDB_HEADER_INFO,
          }
        );
        if (!res.ok) throw new Error("TMDB 요청 실패");
        const data = await res.json();
        
        const filtered = await applyFilters({
          initialContentsList: data.results,
          filters,
          category: 'movie'
        });
        
        const filteredMovies = filtered.filter((movie): movie is MovieData => movie !== null)

        const filteredWithProvider = await Promise.all(
            filteredMovies.map(async (movie: MovieData) => {
            try {
              const providerRes = await fetch(
                `/api/tmdb/movie/${movie.id}/watch/providers`,
                {
                  headers: TMDB_HEADER_INFO
                },
              );

              const providerData = await providerRes.json();
              const krProviders = providerData.results?.KR?.flatrate;
              const providerLogoPath = krProviders?.[0]?.logo_path ?? null;

              return {
                ...movie,
                provider_logo_path: providerLogoPath,
              };
            } catch ( err ) {
              console.error(`Provider 정보 가져오기 실패: ${movie.title}`, err);
              return { ...movie, provider_logo_path: null };
            }
          })
        );
        setMovieList(filteredWithProvider);
      } catch (err) {
        console.error('영화 검색 결과 불러오기 실패:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchMovies();
  }, [keyword, filters]);

  return (
    <section className={S["movie-result-container"]}>
      { isLoading && 
        <div className={S.loader}>
          <div className={S["loading-spinner"]}></div>
          <p className={S["loading-message"]}>검색 결과를 불러오고 있어요 🔍</p> 
        </div>
      }
      { !isLoading && movieList.length === 0 &&
        <SearchNotFound />
      }
      {
        !isLoading &&
        <div className={S["movie-list"]}>
          {
            movieList.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))
          }
        </div>
      } 
    </section>
  )
}


export default SearchMovie