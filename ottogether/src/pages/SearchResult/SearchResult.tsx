import S from './SearchResult.module.css'
import { useEffect, useMemo, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom";
import FilterPanel from "../../components/Search/FilterPanel"
import SearchBar from '../../components/Search/SearchBar';
import { genreListTotal, ottListTotal } from '../../lib/data';
import { isDefaultFilter } from '../../util/isDefaultFilter';
import SearchTab from '../../components/Search/SearchTab';

function SearchResult() {
  const navigate = useNavigate();

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
      if ( inputKeyword.trim() === '' ) {
        alert('검색어를 입력해주세요.');
        e.currentTarget.focus();
        return;
      }
      setSearchKeyword(inputKeyword);
      const newParams = new URLSearchParams(searchParams);
      newParams.set("query", inputKeyword);
      navigate(`/search?${newParams.toString()}`)
      setInputKeyword('');
    }
  };

  /* 필터 상태 초기화 */
  const isNoFilter = isDefaultFilter(
    selectedOtt, 
    selectedGenres, 
    ratingRange[0], 
    ratingRange[1], 
    releaseRange[0], 
    releaseRange[1]
  );

  /* OTT 플랫폼 Toggle */
  const handleToggleOtt = (ottList:string[]) => {
    setSelectedOtt(ottList);
  };
  /* Genre Toggle */
  const handleChangeGenres = (genreList: string[]) => {
    setSelectedGenres(genreList);
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

  /* filters memoization */
  const filters = useMemo(() => ({
    ottList: selectedOtt,
    genreList: selectedGenres,
    ratingRange,
    releaseRange,
  }), [selectedOtt, selectedGenres, ratingRange, releaseRange]);

  return (
    <div className={S.container}>
      <SearchBar
        keyword={inputKeyword}
        onChange={setInputKeyword}
        onEnter={handleSearchKeyDown}
        onRightIconClick={()=>setIsFilterOpen(true)}
        isFiltered={!isNoFilter}
        />
      <h2>검색어 : {searchKeyword}</h2>
      <FilterPanel
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        selectedOtt={selectedOtt}
        onToggleOtt={handleToggleOtt}
        selectedGenres={selectedGenres}
        onToggleGenre={handleChangeGenres}
        ratingMin={ratingRange[0]}
        ratingMax={ratingRange[1]}
        onRatingChange={(min, max) => setRatingRange([min, max])}
        releaseFrom={releaseRange[0]}
        releaseTo={releaseRange[1]}
        onReleaseChange={(from, to) => setReleaseRange([from, to])}
        onApply={applyFilter}
      />
      <SearchTab
        keyword={searchKeyword}
        filters={filters}
      />
    </div>
  )
}
export default SearchResult