import S from './MovieCardSkeleton.module.css'

function MovieCardSkeleton() {
  return (
    <div className={S["movie-card-skeleton"]}>
      <div className={S["skeleton-poster"]} />
      <div className={S["skeleton-date"]} />
      <div className={S["skeleton-title"]} />
      <div className={S["skeleton-rating"]} />
    </div>
  )
}
export default MovieCardSkeleton