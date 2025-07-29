import S from "./MovieCard.module.css"


type MovieCardProps = {
  title: string;
  posterPath: string;
  releaseDate: string;
  rating: number;
  genreNames?: string[];
};

function MovieCard({ title, posterPath, releaseDate, rating, genreNames }: MovieCardProps) {
  return (
    <div className={S["movie-card"]}>
  <img src={`https://image.tmdb.org/t/p/w500${posterPath}`} alt={title} />
  <div className={S["movie-info"]}>
    <p className={S["release-date"]}>{releaseDate}</p>
    <h3 className={S["title"]}>{title}</h3>
    <div className={S["rating"]}>
      <span>⭐</span>
      <span>{rating} / 5</span>
    </div>
    {genreNames && <p className={S["genre"]}>{genreNames.join(', ')}</p>}
  </div>
</div>

  );
}

export default MovieCard