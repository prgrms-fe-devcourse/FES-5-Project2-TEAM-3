import { supabase } from '../supabase/supabase';

export async function toggleQuoteLike(
  quoteId: number,
  userId: string,
  currentLikes: number 
) {
  const { data: existingLike, error: fetchError } = await supabase
    .from('quotes_like')
    .select('*')
    .eq('user_id', userId)
    .eq('quote_id', quoteId)
    .maybeSingle(); 

  if (fetchError) {
    console.error('좋아요 조회 오류:', fetchError.message);
    return { error: fetchError };
  }

  if (existingLike?.id !== undefined && existingLike?.id !== null) {
    const { error: deleteError } = await supabase
      .from('quotes_like')
      .delete()
      .eq('id', existingLike.id);

    if (deleteError) {
      console.error('좋아요 취소 오류:', deleteError.message);
      return { error: deleteError };
    }

    const { error: updateError } = await supabase
      .from('quotes')
      .update({ likes: currentLikes - 1 })
      .eq('id', quoteId);

    return { liked: false, error: updateError };
  } else {
    const { error: insertError } = await supabase
      .from('quotes_like')
      .insert({ user_id: userId, quote_id: quoteId, created_at: new Date().toISOString() });

    if (insertError) {
      console.error('좋아요 삽입 오류:', insertError.message);
      return { error: insertError };
    }

    const { error: updateError } = await supabase
      .from('quotes')
      .update({ likes: currentLikes + 1 })
      .eq('id', quoteId);

    return { liked: true, error: updateError };
  }
}
