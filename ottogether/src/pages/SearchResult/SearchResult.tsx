import S from './SearchResult.module.css'
import { useState } from "react"
import { useSearchParams } from "react-router-dom";
import FilterPanel from "../../components/Search/FilterPanel"

function SearchResult() {

  const [ searchParams ] = useSearchParams();
  const query = searchParams.get('query');

  const [ selectedOtt, setSelectedOtt ] = useState<string[]>([]);
  const [ selectedGenres, setSelectedGenres
   ] = useState<string[]>([]);
  const [ ratingRange, setRatingRange ] = useState<[number, number]>([0, 5]);
  const [ releaseRange, setReleaseRange ] = useState<[string, string]>(['', '']);

  /* OTT 플랫폼 Toggle */
  const handleToggleOtt = (ott:string) => {
    setSelectedOtt(prev => 
      prev.includes(ott)
      ? prev.filter(o => o !== ott)
      : [...prev, ott]
    );
  };

  /* Genre Toggle */
  const handleToggleGenre = (e:React.ChangeEvent<HTMLInputElement>) => {
    const genre = e.target.value;
    setSelectedGenres(prev => 
      prev.includes(genre) 
      ? prev.filter(g => g !== genre)
      : [...prev, genre]
    )
  }

  /* clear filter */
  const clearFilter = () => {
    setSelectedOtt([]);
    setSelectedGenres([]);
    setRatingRange([0, 5]);
    setReleaseRange(['', '']);
  }

  /* apply filter */
  const applyFilter = () => {
    console.log({
      ott: selectedOtt,
      genres: selectedGenres,
      rating: ratingRange,
      release: releaseRange,
    })
  }

  return (
    <div className={S.container}>
      <h2>검색어 : {query}</h2>
      <FilterPanel
        selectedOtt={selectedOtt}
        onToggleOtt={handleToggleOtt}
        selectedGenres={selectedGenres}
        onToggleGenre={handleToggleGenre}
        ratingMin={ratingRange[0]}
        ratingMax={ratingRange[1]}
        onRatingChage={(min, max) => setRatingRange([min, max])}
        releaseFrom={releaseRange[0]}
        releaseTo={releaseRange[1]}
        onReleaseChange={(from, to) => setReleaseRange([from, to])}
        onClear={clearFilter}
        onApply={applyFilter}
      />
    </div>
  )
}
export default SearchResult