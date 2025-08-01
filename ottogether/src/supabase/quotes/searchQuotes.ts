import { supabase } from "../supabase"

export const searchQuotes = async (keyword: string) => {

  try {
    const { data, error } = await supabase
      .from('quotes')
      .select('*')
      .like('content', `%${keyword}%`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('quotes 검색 실패:', error.message);
      return [];
    }

    return data;
  } catch (err) {
    console.error('quotes 불러오기 실패:', err);
    return [];
  }
}