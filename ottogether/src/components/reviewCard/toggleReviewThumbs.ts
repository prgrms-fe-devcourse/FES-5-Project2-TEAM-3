import { supabase } from "../../supabase/supabase"

export async function toggleReviewThumbs(reviewId: number, userId: string, type: "like" | "dislike") {
  const column_name = type === 'like' ? 'like_count' : 'dislike_count';

  try {
    const { data: existingReaction, error: selectError } = await supabase
      .from('review_like')
      .select('reaction_type')
      .eq('review_id', reviewId)
      .eq('user_id', userId)
      .maybeSingle();

    if (selectError && selectError.code !== "PGRST116") {
      throw selectError;
    }

    if (existingReaction) {
      if (existingReaction.reaction_type === type) {
        const { error } = await supabase
          .from('review_like')
          .delete()
          .eq('review_id', reviewId)
          .eq('user_id', userId);
        if (error) throw error;
        
        await supabase.rpc('decrement', {
          table_name: 'review',
          id_column: 'id',
          id_value: reviewId,
          column_name: column_name,
        });

        return { liked: false, error: null };

      } else {
        const { error } = await supabase
          .from('review_like')
          .update({ reaction_type: type })
          .eq('review_id', reviewId)
          .eq('user_id', userId);
        if (error) throw error;
        
        await supabase.rpc('decrement', {
          table_name: 'review',
          id_column: 'id',
          id_value: reviewId,
          column_name: existingReaction.reaction_type === 'like' ? 'like_count' : 'dislike_count',
        });
        await supabase.rpc('increment', {
          table_name: 'review',
          id_column: 'id',
          id_value: reviewId,
          column_name: column_name,
        });
        
        return { liked: true, error: null };
      }
    } else {
      const { error } = await supabase
        .from('review_like')
        .insert({ review_id: reviewId, user_id: userId, reaction_type: type });
      if (error) throw error;
      
      await supabase.rpc('increment', {
        table_name: 'review',
        id_column: 'id',
        id_value: reviewId,
        column_name: column_name,
      });

      return { liked: true, error: null };
    }
  } catch (error) {
    console.error("좋아요 토글 중 오류:", error);
    return { liked: null, error };
  }
}
export default toggleReviewThumbs