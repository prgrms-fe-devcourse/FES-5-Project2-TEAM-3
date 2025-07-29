import { useEffect, useState } from "react";
import { fetchGenres, fetchMoviesByGenre } from "../../tmdbApi";
import MovieList from "./MovieList";
import type { Genre } from "../../tmdbApi/movie.type";

interface SectionGroupProps {
  genres: Genre[];
}

function SectionGroup({ genres }: SectionGroupProps) {
    
  return (
    <>
      {genres.map((g) => (
        <MovieList key={g.id} title={`${g.name} 영화`} fetchFn={() => fetchMoviesByGenre(g.id)} />       
      ))}
    </>
  );
}


export function useGenreSections() {
  const [sectionGroups, setSectionGroups] = useState<Genre[][]>([]);

  useEffect(() => {
    fetchGenres().then((allGenres) => {
      const shuffled = [...allGenres].sort(() => Math.random() - 0.5);
      const grouped = chunkGenres(shuffled, 3);
      setSectionGroups(grouped);
    });
  }, []);

  return { sectionGroups };
}

function chunkGenres(genres: Genre[], size: number): Genre[][] {
  const result: Genre[][] = [];
  for (let i = 0; i < genres.length; i += size) {
    result.push(genres.slice(i, i + size));
  }
  return result;
}

 export default SectionGroup


