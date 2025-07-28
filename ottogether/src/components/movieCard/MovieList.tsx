


import { useEffect, useState } from "react";
import MovieCard from "./movieCard";
import S from "./MovieList.module.css"

interface MovieListProps {
  title: string;
  fetchFn: () => Promise<any[]>;
}

export default function MovieList({ title, fetchFn }: MovieListProps) {
  const [movies, setMovies] = useState<any[]>([]);
  const [startIndex, setStartIndex] = useState(0);

    
  const itemsPerPage = 5;


  useEffect(() => {
    async function loadMovies() {
      try {
        const data = await fetchFn();
        setMovies(data);
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
            <MovieCard
             key={movie.id}
             title={movie.title}
             posterPath={movie.poster_path}
             releaseDate={movie.release_date}
             rating={movie.vote_average}
             />
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
