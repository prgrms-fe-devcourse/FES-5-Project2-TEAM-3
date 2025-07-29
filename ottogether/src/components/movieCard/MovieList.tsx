


import { useEffect, useState } from "react";
import MovieCard from "./movieCard";
import S from "./MovieList.module.css"
import { getMovieProvider } from "../../tmdbApi/getMovieProvider";
import type { MovieData } from "../../tmdbApi/movie.type";

interface MovieListProps {
  title: string;
  fetchFn: () => Promise<MovieData[]>;
}

export default function MovieList({ title, fetchFn }: MovieListProps) {
  const [movies, setMovies] = useState<MovieData[]>([]);
  const [startIndex, setStartIndex] = useState(0);

    
  const itemsPerPage = 5;


  useEffect(() => {
    async function loadMovies() {
      try {
        const rawData = await fetchFn();
        const enrichedData = await getMovieProvider(rawData);
      setMovies(enrichedData);
      } catch (err) {
        console.error(err);
      }
    }
    loadMovies();
  }, [fetchFn]);


  const handleNext = () => {
  if (startIndex + itemsPerPage < movies.length) {
    setStartIndex(startIndex + itemsPerPage);
  }
};

const handlePrev = () => {
  if (startIndex - itemsPerPage >= 0) {
    setStartIndex(startIndex - itemsPerPage);
  }
};

  return (
    <section className={S["movie-list"]}>
      <div className={S["section-header"]}>
        <h2>{title}</h2>
      </div>
      <div className={S["slider-container"]}>
        <button className={S["arrow-button"]} onClick={handlePrev}>
          <img src="/src/assets/icons/arrow-left.svg" alt="prev" />
         </button>
        <div className={S["movie-grid"]}>
           {movies.slice(startIndex, startIndex + itemsPerPage).map((movie) => (
           <MovieCard key={movie.id} movie={movie} />
          ))
          }
         </div>
       <button className={S["arrow-button"]} onClick={handleNext}>
          <img src="/src/assets/icons/arrow-right.svg" alt="next" />
         </button>
         </div>
     </section>
  );
}
