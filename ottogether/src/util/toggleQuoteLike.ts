import { supabase } from "../supabase/supabase";



export async function toggleQuoteLike(
  quoteId: number,
  userId: string
): Promise<{ liked: boolean; error: any }> {

  const { data: existingLike, error: selectError } = await supabase
    .from("quotes_like")
    .select("*")
    .eq("quote_id", quoteId)
    .eq("user_id", userId)
    .maybeSingle();

  if (selectError && selectError.code !== "PGRST116") {
    console.error("좋아요 상태 확인 중 오류:", selectError);
    return { liked: false, error: selectError };
  }


  if (existingLike) {
    const { error: deleteError } = await supabase
      .from("quotes_like")
      .delete()
      .eq("quote_id", quoteId)
      .eq("user_id", userId);
      

  if (deleteError) {
      console.error("좋아요 취소 중 오류:", deleteError);
      return { liked: true, error: deleteError };
    }
    await supabase.rpc('decrement', {
      table_name: 'quotes',
      id_column: 'id',
      id_value: quoteId,
      column_name: 'likes',
    });


    return { liked: false, error: null };
  }


  const { error: insertError } = await supabase.from("quotes_like").insert({
    quote_id: quoteId,
    user_id: userId,
  });

  if (insertError) {
    console.error("좋아요 추가 중 오류:", insertError);
    return { liked: false, error: insertError };
  }


    await supabase.rpc('increment', {
      table_name: 'quotes',
      id_column: 'id',
      id_value: quoteId,
      column_name: 'likes',
    });
    
    return { liked: true, error: null };
    
}
