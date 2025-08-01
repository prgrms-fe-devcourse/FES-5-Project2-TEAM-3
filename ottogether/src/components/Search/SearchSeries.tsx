import S from './SearchMovie.module.css';
import { useEffect, useState } from 'react';
import type { MovieData } from '../../tmdbApi/movie.type';
import { normalizeSeriesData } from '../../tmdbApi/series.type';
import { applyFilters } from '../../util/applyFilters';
import SearchNotFound from './SearchNotFound';
import MovieCard from '../movieCard/MovieCard';
import SearchLoading from './SearchLoading';

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

function SearchSeries({ keyword, filters }:SearchProps) {
  const [ seriesList, setSeriesList ] = useState<MovieData[]>([]);
  const [ isLoading, setIsLoading ] = useState<boolean>(false);

  useEffect(() => {
    const fetchSeries = async () => {
      if (!keyword.trim()) return;

      try {
        setIsLoading(true);
        const res = await fetch(
          `/api/tmdb/search/tv?query=${encodeURIComponent(keyword)}&language=ko-KR&include_adult=false`,
          {
            headers: TMDB_HEADER_INFO,
          }
        );
        if (!res.ok) throw new Error("TMDB 요청 실패");
        const data = await res.json();

        // MovieData 형식으로 변환
        const normalizedList = data.results.map(normalizeSeriesData);

        const filtered = await applyFilters({
          initialContentsList: normalizedList,
          filters,
          category: 'tv'
        });
        
        const filteredSeries = filtered.filter((series): series is MovieData => series !== null)

        const filteredWithProvider = await Promise.all(
            filteredSeries.map(async (series: MovieData) => {
            try {
              const providerRes = await fetch(
                `/api/tmdb/tv/${series.id}/watch/providers`,
                {
                  headers: TMDB_HEADER_INFO
                },
              );

              const providerData = await providerRes.json();
              const krProviders = providerData.results?.KR?.flatrate;
              const providerLogoPath = krProviders?.[0]?.logo_path ?? null;

              return {
                ...series,
                provider_logo_path: providerLogoPath,
              };
            } catch ( err ) {
              console.error(`Provider 정보 가져오기 실패: ${series.title}`, err);
              return { ...series, provider_logo_path: null };
            }
          })
        );
        setSeriesList(filteredWithProvider);
      } catch (err) {
        console.error('영화 검색 결과 불러오기 실패:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchSeries();
  }, [keyword, filters]);

  return (
    <section className={S["movie-result-container"]}>
      { isLoading && 
        <SearchLoading />
      }
      { !isLoading && seriesList.length === 0 &&
        <SearchNotFound />
      }
      {
        !isLoading &&
        <div className={S["movie-list"]}>
          {
            seriesList.map((series) => (
              <MovieCard key={series.id} movie={series} />
            ))
          }
        </div>
      } 
    </section>
  )
}


export default SearchSeries