import { supabase } from "../supabase/supabase";
import type { Tables } from "../supabase/supabase.type";

type Quote = Tables<"quotes">;

type GetQuotesOptions = {
  sortBy?: "created_at" | "likes";
  order?: "asc" | "desc";
  author?: string;
};


export async function getQuotes( 
    options:GetQuotesOptions = {}
):Promise<Quote[] | null> {
    const {sortBy = "created_at", order = "desc", author} = options;

    let query = supabase.from("quotes").select("*")

    if(author){
        query = query.eq("author",author);
    };

    query = query.order(sortBy, {ascending: order === "asc"});

    const {data, error} = await query;

    if(error){
        console.log('error');
        return null
    }

    return data
}


















