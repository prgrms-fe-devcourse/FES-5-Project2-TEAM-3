import { useEffect, useState } from "react";
import { fetchPopularMovies, getMovieDetail } from "../../tmdbApi";
import S from "./Hero.module.css";
import type { MovieData } from "../../tmdbApi/movie.type";
import { useNavigate } from "react-router-dom";



function Hero() {
  const [movies, setMovies] = useState<number[]>([]); 
  const [current, setCurrent] = useState(0);
  const [movie, setMovie] = useState<null | {
    id: number; 
    title: string;
    overview: string | null;
    backdrop_path: string | null;
    media_type: 'movie';
  }>(null);

  const navigate = useNavigate();

  useEffect(() => {
    async function loadMovies() { 
      const popular = await fetchPopularMovies();

      const valid = popular.filter(
      (m : MovieData) => m.title && m.overview && m.overview.trim().length > 0 );

      const ids = valid.map((m: MovieData) => m.id);
      setMovies(ids);
    }
    loadMovies();
  }, []);


  useEffect(() => {
    if (movies.length === 0) return;

    async function loadDetail() {
      const id = movies[current];
      const detail = await getMovieDetail(id);
      if (detail) {
        setTimeout(()=>{
          setMovie({
          id: detail.id,
          title: detail.title,
          overview: detail.overview,
          backdrop_path: detail.backdrop_path,
          media_type: "movie",
        });
        },300)
      }
    }

    loadDetail();

    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % movies.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [movies, current]);

  if (!movie) return null;


 return (
    <section className={S.hero}
    onClick={() => { if (movie) {
    navigate(`/media/${movie.media_type}/${movie.id}`);}}}
    >
      {movie.backdrop_path && (
        <img
          className={S.backdrop}
          src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
          alt={movie.title}
        />
      )}
      <div className={S.overlay}>
        <h1 className={S.title}>{movie.title}</h1>
        <p className={S.overview}>{movie.overview}</p>
      </div>
    </section>
  );

}


export default Hero