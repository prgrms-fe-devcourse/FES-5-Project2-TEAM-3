import { useEffect, useState } from "react";
import { fetchGenres, fetchMoviesByGenre } from "../../tmdbApi";
import MovieList from "./MovieList";
import type { Genre } from "../../tmdbApi/movie.type";
import QuoteCard from "../Quotes/QuoteCard";
import type { Tables } from "../review_/supabase.type";
import { getQuotes } from "../../util/getQuote";

interface SectionGroupProps {
  genres: Genre[];
  quote?: Tables<"quotes">;
}
function SectionGroup({ genres, quote }: SectionGroupProps) {
  return (
    <>
      {genres.map((g) => (
        <MovieList
          key={g.id}
          title={`${g.name} 영화`}
          fetchFn={() => fetchMoviesByGenre(g.id)}
        />
      ))}
      {quote && (
        <QuoteCard
          key={quote.id}
          id={quote.id}
          content={quote.content}
          person={quote.person}
          likes={quote.likes ?? 0}
          user_id={quote.user_id ?? ""}
        />
      )}
    </>
  );
}

export function useGenreSections() {
  const [sectionGroups, setSectionGroups] = useState<Genre[][]>([]);
  const [quotes, setQuotes] = useState<Tables<"quotes">[]>([]);

  useEffect(() => {

    fetchGenres().then(async (allGenres) => {
      const shuffledGenres = [...allGenres].sort(() => Math.random() - 0.5);
      const grouped = chunkGenres(shuffledGenres, 3);
      setSectionGroups(grouped);


      const quoteData = await getQuotes({ sortBy: "likes", order: "desc" });
      if (quoteData) {
        const shuffledQuotes = [...quoteData].sort(() => Math.random() - 0.5);
        setQuotes(shuffledQuotes.slice(0, grouped.length));
      }
    });
  }, []);

  return { sectionGroups, quotes };
}

function chunkGenres(genres: Genre[], size: number): Genre[][] {
  const result: Genre[][] = [];
  for (let i = 0; i < genres.length; i += size) {
    result.push(genres.slice(i, i + size));
  }
  return result;
}

export default SectionGroup;