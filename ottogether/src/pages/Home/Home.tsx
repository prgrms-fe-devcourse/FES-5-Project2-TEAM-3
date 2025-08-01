
import { fetchGenres, fetchMoviesByGenre, fetchPopularMovies } from "../../tmdbApi"
import MovieList from "../../components/movieCard/MovieList";
import SectionGroup, { useGenreSections } from "../../components/movieCard/SectionGroup";
import { useEffect, useState } from "react";
import Hero from "./Hero";
import S from "./Home.module.css";
import OttSelector from "../../components/Search/OttSelector";
import { ottListTotal } from "../../lib/data";


function Home() {

  const { sectionGroups, quotes } = useGenreSections()
  const [visibleIndex, setVisibleIndex] = useState(1);
  const [selectedOtt, setSelectedOtt] = useState<string[]>(ottListTotal);

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

  const handleToggleOtt = (ottList:string[]) => {
    setSelectedOtt(ottList);
  };

  return (
    <>
    <Hero />
    <div className={S.ottSelectorWrapper}>
    <OttSelector selected={selectedOtt} onToggle={handleToggleOtt} />
    </div>
    <MovieList title="최신킹기" fetchFn={fetchPopularMovies} />
      <div>
        {sectionGroups.slice(0, visibleIndex).map((group, idx) => (
          <div key={idx}>
            <SectionGroup genres={group} quote={quotes[idx]} />
          </div>
        ))}
        <div id="scroll-sentinel" className="scrollSentinel" />
      </div>
    </>
  );
}
export default Home

