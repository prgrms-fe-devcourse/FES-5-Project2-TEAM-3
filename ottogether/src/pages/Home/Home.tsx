
import { fetchGenres, fetchMoviesByGenre, fetchPopularMovies } from "../../tmdbApi"
import MovieList from "../../components/movieCard/MovieList";
import SectionGroup, { useGenreSections } from "../../components/movieCard/SectionGroup";
import { useEffect, useState } from "react";





function Home() {

  const { sectionGroups } = useGenreSections()
  const [visibleIndex, setVisibleIndex] = useState(1);
  

  useEffect(() => {
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      setVisibleIndex((prev) => prev + 1);
    }
  });

  const sentinel = document.querySelector("#scroll-sentinel");
  if (sentinel) observer.observe(sentinel);
  return () => observer.disconnect();
}, []);

  return (
    <>
      <MovieList title="Featured Movie" fetchFn={fetchPopularMovies} />
      <div>
        {sectionGroups.slice(0, visibleIndex).map((group, idx) => (
          <div key={idx}>
            <SectionGroup genres={group} />
          </div>
        ))}
        <div id="scroll-sentinel" className="scrollSentinel" />
      </div>
    </>
  );
}
export default Home

