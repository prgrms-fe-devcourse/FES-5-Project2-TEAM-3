/* Supabase Review getAvgRating */
/* Review 테이블에서 movie_id별 별점 평균 정보를 가져옵니다. */

import { supabase } from "../supabase";

export async function getAvgRating(): Promise<Record<number, number>> {
  const { data, error } = await supabase
    .from('review')
    .select('movie_id, rating')
    .order('movie_id', { ascending: true });

  if (error) {
    console.error("리뷰 별점 불러오기 실패", error);
    return {};
  }

  const ratingMap: Record<number, { total: number; count: number }> = {};

  for ( const review of data ) {
    const { movie_id, rating } = review;

    if ( movie_id === null || movie_id === undefined ) continue;
    
    if (!ratingMap[movie_id]) {
      ratingMap[movie_id] = { total: 0, count: 0 };
    }

    ratingMap[movie_id].total += rating;
    ratingMap[movie_id].count += 1;
  }

  const avgRatingMap: Record<number, number> = {};
  for ( const id in ratingMap ) {
    const { total, count } = ratingMap[+id];
    ( count === 0 ) ? avgRatingMap[+id] = 0
      : avgRatingMap[+id] = total / count;
  }

  return avgRatingMap;
}