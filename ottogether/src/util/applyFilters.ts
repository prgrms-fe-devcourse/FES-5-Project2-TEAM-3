/* 검색 결과에 Filter를 적용 */

import { genreListTotal, ottListTotal } from "../lib/data";
import { ottNameMap } from "../lib/ottNameMap";
import { getAvgRating } from "../supabase/review/getAvgRating";
import type { MovieData } from "../tmdbApi/movie.type"
import { getGenreId, type GenreCategory } from "./getGenreId"

interface searchFilter {
  initialContentsList: MovieData[],
  filters: {
    ottList: string[];
    genreList: string[];
    ratingRange: [number, number];
    releaseRange: [string, string];
  }, 
  category: GenreCategory,
}

export const applyFilters = async ( {
  initialContentsList, 
  filters, 
  category
}: searchFilter): Promise<MovieData[]> => {

  const { ottList, genreList, ratingRange, releaseRange } = filters;
  const [ ratingMin, ratingMax ] = ratingRange;
  const [ releaseFrom, releaseTo ] = releaseRange;

  // 필터 조건 사전 검사 : 빈 배열 리턴
  if (ottList.length === 0 || genreList.length === 0) return [];
  const isAllOttSelected = ottList.length === ottListTotal.length;
  const isAllGenreSelected = genreList.length === genreListTotal.length;

  const genreIds = getGenreId(genreList, category);
  const mappedOttList = ottList.map(name => ottNameMap[name] ?? name);

  /* Supabase Review 테이블에서 평균 별점 가져오기 */
  const avgRatingList = await getAvgRating();

  /* 필터링 적용 */
  const filtered = await Promise.all(initialContentsList.map(
    async (content) => {
      
      /* ott 필터링 조건 적용 */
      if ( !isAllOttSelected ) {
        const providerRes = await fetch(
          `https://api.themoviedb.org/3/${category}/${content.id}/watch/providers`,
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_TMDB_ACCESS_TOKEN}`,
              accept: "application/json",
            }
          }
        );
        
        // 한국에서 서비스 중인 OTT 정보 필터링
        const providerData = await providerRes.json();
        const krProviders = providerData.results?.KR?.flatrate?.map((p: any) => p.provider_name) ?? [];
        
        if (
          mappedOttList.length > 0 &&
          !mappedOttList.some((ott) => krProviders.includes(ott))
        ) return null;
      }
      
      /* 장르 필터링 조건 적용 */
      if ( !isAllGenreSelected ) {
        if (
          genreIds.length > 0 &&
          !genreIds.some((id) => content.genre_ids.includes(id))
        ) return null;
      }
      
      /* 별점 필터링 조건 적용 */
      // 별점 데이터가 없으면 0 적용 (임시)
      const avgRating = avgRatingList[content.id] ?? 0;

      if (avgRating === null) return null;
      if ( ratingMin !== 0 && avgRating < ratingMin ) return null;
      if ( ratingMax !== 5 && avgRating > ratingMax ) return null;
      // if (!(ratingMin === 0 && ratingMax === 5)) {
      //   if (
      //     avgRating === null || 
      //     avgRating < ratingMin || 
      //     avgRating > ratingMax
      //   ) return null;
      // }

      /* 상영일 필터링 조건 적용 */
      if (!(releaseFrom === '' && releaseTo === '')) {
        if (
          content.release_date === null ||
          content.release_date === undefined ||
          ( releaseFrom && content.release_date < releaseFrom ) ||
          ( releaseTo && content.release_date > releaseTo )
        ) return null;
      }
      return { ...content, avgRating };
    }
  ));

  const finalList = filtered.filter(content => content !== null);
  return finalList;
}