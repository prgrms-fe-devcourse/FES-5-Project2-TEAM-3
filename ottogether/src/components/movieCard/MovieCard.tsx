import S from "./MovieCard.module.css"
import { useEffect, useState } from "react";
import { toggleFavoriteMovie, isMovieLiked } from "../../util/toggleFavoriteMovie";
import type { MovieData } from "../../tmdbApi/movie.type";
import { getUserInfo } from "../../supabase/auth/getUserInfo";

type MovieCardProps = {
  movie: MovieData;
};

function MovieCard({ movie }: MovieCardProps) {

  
  const {
    id,
    title,
    poster_path,
    release_date,
    vote_average,
    genre_names,
    provider_logo_path,
  } = movie;

  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const fetchLikedStatus = async () => {
      const userId = await getUserInfo("id");
      if (!userId) return;
      const liked = await isMovieLiked(userId, id);
      setLiked(liked);
    };

    fetchLikedStatus();
  }, [id]);

  const handleToggleLike = async () => {
    const userId = await getUserInfo("id");
    if (!userId) {
      alert("로그인이 필요합니다.");
      return;
    }

    const result = await toggleFavoriteMovie(userId, id);
    if (!result.error) {
      setLiked(result.liked);
    }
  };

  return (
    <div className={S["movie-card"]}>
      <div className={S["poster-wrapper"]}>
        <button
        onClick={handleToggleLike}
        className={S["heart-button"]}
        aria-label={liked ? "좋아요 취소" : "좋아요"}
      >
        {liked ? "❤️" : "🤍"}
      </button>

      <img
        src={poster_path ? `https://image.tmdb.org/t/p/w500${poster_path}` : "/default-poster.png"}
        alt={title}
      />
      </div>
      
      <div className={S["movie-info"]}>
        <p className={S["release-date"]}>{release_date}</p>
        <h3 className={S["title"]}>{title}</h3>
        <div className={S["rating"]}>
          <span>⭐</span>
          <span>{vote_average} / 10</span>
        </div>
        {genre_names && (
          <p className={S["genre"]}>{genre_names.join(", ")}</p>
        )}
      </div>
      {provider_logo_path && (
        <div className={S["provider-logo"]}>
          <img
            src={`https://image.tmdb.org/t/p/w45${provider_logo_path}`}
            alt="provider"
          />
        </div>
      )}
    </div>
  );
}

export default MovieCard