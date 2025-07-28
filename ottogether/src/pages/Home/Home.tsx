
import { fetchPopularMovies } from "../../tmdbApi"
import MovieList from "../../components/movieCard/MovieList";





function Home() {
  return (
    <>
      <MovieList title="Featured Movie" fetchFn={fetchPopularMovies} />
    </>
  );
}
export default Home

