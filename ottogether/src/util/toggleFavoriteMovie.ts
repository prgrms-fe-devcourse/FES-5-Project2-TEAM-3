// src/util/toggleFavoriteMovie.ts

import { supabase } from "../supabase/supabase";

export async function toggleFavoriteMovie(userId: string, movieId: number, mediaType : 'movie' | 'tv') {
  const { data: existing, error: fetchError } = await supabase
    .from("favorite_movies")
    .select("*")
    .eq("user_id", userId)
    .eq("movie_id", movieId)
		.eq('media_type', mediaType)
    .maybeSingle();

  if (fetchError) {
    console.error("좋아요 조회 실패:", fetchError.message);
    return { error: fetchError };
  }

  if (existing) {
    const { error: deleteError } = await supabase
      .from("favorite_movies")
      .delete()
      .eq("id", existing.id)
			.eq('media_type', mediaType);

    if (deleteError) {
      console.error("좋아요 취소 실패:", deleteError.message);
      return { error: deleteError };
    }

    return { liked: false };
  } else {
    const { error: insertError } = await supabase
      .from("favorite_movies")
      .insert([{ user_id: userId, movie_id: movieId, media_type : mediaType }]);

    if (insertError) {
      console.error("좋아요 등록 실패:", insertError.message);
      return { error: insertError };
    }

    return { liked: true };
  }
}


export async function isMovieLiked(userId: string, movieId: number, mediaType : 'movie' | 'tv'): Promise<boolean> {
  const { data } = await supabase
    .from("favorite_movies")
    .select("id")
    .eq("user_id", userId)
    .eq("movie_id", movieId)
		.eq('media_type', mediaType)
    .maybeSingle();

  return !!data;
}