import S from './SearchResult.module.css'
import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom";
import FilterPanel from "../../components/Search/FilterPanel"
import SearchBar from '../../components/Search/SearchBar';
import { genreListTotal, ottListTotal } from '../../lib/data';
import { isDefaultFilter } from '../../util/isDefaultFilter';

function SearchResult() {

  // 검색어 Params
  const [ searchParams ] = useSearchParams();
  const query = searchParams.get('query');

  // 검색어 제어 state
  const [ inputKeyword, setInputKeyword ] = useState<string>('');
  const [ searchKeyword, setSearchKeyword ] = useState<string>(query ?? '');

  // 필터 제어 state
  const [ isFilterOpen, setIsFilterOpen ] = useState<boolean>(false);
  const [ selectedOtt, setSelectedOtt ] = useState<string[]>(ottListTotal);
  const [ selectedGenres, setSelectedGenres
   ] = useState<string[]>(genreListTotal);
  const [ ratingRange, setRatingRange ] = useState<[number, number]>([0, 5]);
  const [ releaseRange, setReleaseRange ] = useState<[string, string]>(['', '']);
  
  /* 검색어 갱신 */
  useEffect(() => {
    if (query !== null) {
      setSearchKeyword(query);
      setInputKeyword('');
    }
  }, [query]);

  /* 검색창에서 엔터 키 입력 시 핸들링 */
  const handleSearchKeyDown = (e:React.KeyboardEvent<HTMLInputElement>) => {
    if ( e.key === 'Enter' ) {
      setSearchKeyword(inputKeyword);
      setInputKeyword('');
    }
  };

  /* 필터 상태 초기화 */
  const isFiltered = !isDefaultFilter(
    selectedOtt, 
    selectedGenres, 
    ratingRange[0], 
    ratingRange[1], 
    releaseRange[0], 
    releaseRange[1]
  );
  
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
    setSelectedOtt(ottListTotal);
    setSelectedGenres(genreListTotal);
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
    });
  }


  return (
    <div className={S.container}>
      <SearchBar
        keyword={inputKeyword}
        onChange={setInputKeyword}
        onEnter={handleSearchKeyDown}
        onRightIconClick={()=>setIsFilterOpen(true)}
        isFiltered={isFiltered}
        />
      <h2>검색어 : {searchKeyword}</h2>
      <FilterPanel
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
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