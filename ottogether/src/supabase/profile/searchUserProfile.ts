/* User의 프로필 정보 + 좋아요 정보를 통합해서 검색하는 함수 */

import { supabase } from "../supabase";

export const searchUserProfile = async ( keyword: string ) => {
  try {
    /* 닉네임 기준 검색 */
    const { data: profiles, error: profileError } = await supabase
      .from("profile")
      .select("*")
      .ilike("nickname", `%${keyword}%`);

    if (profileError) {
      console.error('프로필 불러오기 실패:', profileError.message);
      throw profileError;
    }

    // 해당하는 유저 정보가 없을 경우
    if ( !profiles.length ) return { profiles: [], reviewData: [], quotesData: [] };
    // 해당하는 유저가 있을 경우 user_id 확인
    const userIds = profiles.map(p => p.user_id);


    /* review 데이터 조회 */
    const { data: reviewData, error: reviewError } = await supabase
      .from("review")
      .select("*")
      .in("user_id", userIds);
    
    /* quotes 데이터 조회 */
    const { data: quotesData, error: quoteError } = await supabase
      .from("quotes")
      .select("*")
      .in("user_id", userIds);

    // 데이터 불러오기 실패 시 fallback
    if (reviewError) {
      console.error('리뷰 좋아요 데이터 불러오기 실패:', reviewError.message);
      throw reviewError;
    }
    if (quoteError) {
      console.error('quotes 좋아요 데이터 불러오기 실패:', quoteError.message);
      throw quoteError;
    }

    return {
      profiles,
      reviewData: reviewData ?? [],
      quotesData: quotesData ?? [],
    };

  } catch (err) {
    console.error('유저 검색 실패:', err);
    return { profiles: [], reviewData: [], quotesData: [] };
  }
}