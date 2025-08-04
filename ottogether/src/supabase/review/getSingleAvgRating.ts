
import { supabase } from "../supabase";

export async function getSingleAvgRating(movieId: number): Promise<number | null> {
  const { data, error } = await supabase
    .from("review")
    .select("rating")
    .eq("movie_id", movieId);

  if (error || !data || data.length === 0) return null;

  const total = data.reduce((sum, item) => sum + item.rating, 0);
  const avg = total / data.length;

  return avg;
}
