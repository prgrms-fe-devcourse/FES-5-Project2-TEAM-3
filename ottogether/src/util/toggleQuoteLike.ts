import { supabase } from "../supabase/supabase";

export async function toggleQuoteLike(
  quoteId: number,
  userId: string,
  currentLikeCount: number
): Promise<{ liked: boolean; error: any }> {
  const { data: existingLike, error: selectError } = await supabase
    .from("quotes_like")
    .select("*")
    .eq("quote_id", quoteId)
    .eq("user_id", userId)
    .single();

  if (selectError && selectError.code !== "PGRST116") {
    console.error("좋아요 확인 중 에러:", selectError);
    return { liked: false, error: selectError };
  }

  if (existingLike) {

    const { error: deleteError } = await supabase
      .from("quotes_like")
      .delete()
      .eq("quote_id", quoteId)
      .eq("user_id", userId);

    if (deleteError) {
      console.error("좋아요 삭제 중 에러:", deleteError);
      return { liked: true, error: deleteError };
    }
    await supabase
      .from("quotes")
      .update({ likes: currentLikeCount - 1 })
      .eq("id", quoteId);

    return { liked: false, error: null };
  } else {

    const { error: insertError } = await supabase.from("quotes_like").insert([
      {
        quote_id: quoteId,
        user_id: userId,
      },
    ]);

    if (insertError) {
      console.error("좋아요 추가 중 에러:", insertError);
      return { liked: false, error: insertError };
    }
    await supabase
      .from("quotes")
      .update({ likes: currentLikeCount + 1 })
      .eq("id", quoteId);

    return { liked: true, error: null };
  }
}
