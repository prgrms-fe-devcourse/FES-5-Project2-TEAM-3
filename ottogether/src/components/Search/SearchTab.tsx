import S from './SearchTab.module.css';
import gsap from 'gsap';
import React from 'react';
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SearchMovie from './SearchMovie';
import SearchSeries from './SearchSeries';
import SearchQuote from './SearchQuote';
import SearchUser from './SearchUser';
import warningIcon from '../../assets/icons/warning.svg';
import SearchNotFound from './SearchNotFound';

const TAB_TYPES = ['total', 'movie', 'series', 'quote', 'user'] as const;
type TabType = typeof TAB_TYPES[number];

const TAB_LABELS: Record<TabType, string> = {
  total: "Total",
  movie: "Movies",
  series: "TV Show",
  quote: "Quotes",
  user: "Users"
};

interface SearchTabProbs {
  keyword: string;
  filters: {
    ottList: string[];
    genreList: string[];
    ratingRange: [number, number];
    releaseRange: [string, string];
  }
}

const SearchTab = React.memo(function SearchTab( { keyword, filters }:SearchTabProbs) {
  
  const location = useLocation();
  const navigate = useNavigate();

  const [ activeTab, setActiveTab ] = useState<TabType>('total');
  const [ hasResult, setHasResults ] = useState({
    movie: true,
    series: true,
    quote: true,
    user: true,
  })

  const isFirstRender = useRef<boolean>(true);
  
  // 검색 fetch 요청 제한 관련 변수
  const SEARCH_COOLDOWN_MS = 1000; // 1초간 동일 키워드 검색 제한
  const searchHistory = useRef<Map<string, number>>(new Map());
  const lastSearchTime = useRef<number>(0);
  const [ shouldFetch, setShouldFetch ] = useState<boolean>(true);

  // JSX references
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const indicatorRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  /* URL 쿼리에서 초기 상태 설정 */
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get('tab') as TabType | null;

    if (tabParam && TAB_TYPES.includes(tabParam)) {
      setActiveTab(tabParam);
    } else {
      setActiveTab('total');
    }
  }, [location.search]);

  /* 중복 fetch 요청 방지 */
  useEffect(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();
    const now = Date.now();
    const lastSearchedAt = searchHistory.current.get(normalizedKeyword);

    if(isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    // 전체 요청 속도 제한
    if (!isFirstRender.current && now - lastSearchTime.current < SEARCH_COOLDOWN_MS) {
      console.error('검색 제한: 요청 속도 너무 빠름');
      setShouldFetch(false);
      return;
    }

    // 만약 동일 단어를 검색한 적이 있고, 그 시간이 쿨다운 시간보다 짧은 시간 전이면 제한
    if (lastSearchedAt && now - lastSearchedAt < SEARCH_COOLDOWN_MS) {
      console.error(`검색 제한: (${keyword}) - ${now - lastSearchedAt}ms`);
      setShouldFetch(false);
      return;
    }

    // 통과
    lastSearchTime.current = now;
    searchHistory.current.set(normalizedKeyword, now);
    setShouldFetch(true);
  }, [keyword]);

  useEffect(() => {
    if (!shouldFetch) {
      const t = setTimeout(() => setShouldFetch(true), 2000);
      return () => clearTimeout(t);
    }
  }, [shouldFetch]);

  /* 탭 클릭 시 URL 쿼리 변경 */
  const handleTabClick = (tab: TabType) => {
    const params = new URLSearchParams(location.search);

    if ( tab === 'total' ) {
      params.delete('tab');
    } else {
      params.set('tab', tab);
    }

    navigate( { search: params.toString() });
  }

  /* 탭 이동 애니메이션 */
  useEffect(() => {
    // 탭 메뉴 슬라이딩
    const currentTab = tabRefs.current[activeTab];
    const indicator = indicatorRef.current;

    if ( currentTab && indicator ) {
      const { offsetLeft, offsetTop, offsetWidth, offsetHeight } = currentTab;
      const tabListOffsetTop = (currentTab.offsetParent as HTMLDivElement | null)?.offsetTop ?? 0;

      gsap.to(indicator, {
        left: offsetLeft,
        width: offsetWidth,
        top: offsetTop + offsetHeight - 2 - tabListOffsetTop,
        duration: 0.1,
        ease: 'power2.out',
      })
    }

    // 패널 슬라이딩
    const index = TAB_TYPES.indexOf(activeTab);
    if (panelRef.current) {
      gsap.to(panelRef.current, {
        xPercent: -100 * index,
        duration: 0.1,
        ease: 'power2.out',
      })
    }
  }, [activeTab]);

  /* 탭별로 표시될 화면 */
  const getPreviewCount = (width: number, type:'movie'|'card'):number => {
    if ( width >= 1320 ) {
      return ( type === 'movie' ) ? 4 : 3;
    } else if ( width >= 980 ) {
      return ( type === 'movie' ) ? 3 : 2;
    } else {
      return ( type === 'movie' ) ? 2 : 1;
    }
  }
  
  const [ moviePreviewCount, setMoviePreviewCount ] = useState(() => getPreviewCount(window.innerWidth, 'movie'));
  const [ cardPreviewCount, setCardPreviewCount ] = useState(() => getPreviewCount(window.innerWidth, 'card'));

  useEffect(() => {
    const handleResize = () => {
      setMoviePreviewCount(getPreviewCount(window.innerWidth, 'movie'));
      setCardPreviewCount(getPreviewCount(window.innerWidth, 'card'));
    };

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const resultPanel = (
      <>
        <div className={S["panel-item"]}>
          <div className={S["total-list"]}>
            {
              !hasResult.movie && !hasResult.series && !hasResult.quote && !hasResult.user &&
              <section className={S["not-found"]}>
                <SearchNotFound
                keyword={keyword}
               />
              </section> 
            }
            <section className={ !hasResult.movie ? S.hidden : '' }>
              <div className={S["section-title"]}>
                <h3>Movies</h3>
                <button
                  type='button'
                  aria-label='영화 탭으로 이동하여 전체 검색 결과 보기'
                  onClick={() => handleTabClick('movie')}
                >+ 더 보기</button>
              </div>
              { shouldFetch && 
              <SearchMovie
                keyword={keyword}
                filters={filters}
                previewCount={moviePreviewCount}
                onResult={(hasData: boolean) => setHasResults(prev => ({...prev, movie: hasData}))}
                shouldFetch={shouldFetch}
              />
              }
            </section>
            <section className={ !hasResult.series ? S.hidden : '' }>
              <div className={S["section-title"]}>
                <h3>TV Shows</h3>
                <button
                  type='button'
                  aria-label='시리즈 탭으로 이동하여 전체 검색 결과 보기'
                  onClick={() => handleTabClick('series')}
                >+ 더 보기</button>
              </div>
              { shouldFetch && 
              <SearchSeries
                keyword={keyword}
                filters={filters}
                previewCount={moviePreviewCount}
                onResult={(hasData: boolean) => setHasResults(prev => ({...prev, series: hasData}))}
                shouldFetch={shouldFetch}
              />
              }
            </section>
            <section className={ !hasResult.quote ? S.hidden : '' }>
              <div className={S["section-title"]}>
                <h3>Quotes</h3>
                <button
                  type='button'
                  aria-label='명대사 탭으로 이동하여 전체 검색 결과 보기'
                  onClick={() => handleTabClick('quote')}
                >+ 더 보기</button>
              </div>
              { shouldFetch && 
              <SearchQuote
                keyword={keyword}
                previewCount={cardPreviewCount}
                onResult={(hasData: boolean) => setHasResults(prev => ({...prev, quote: hasData}))}
                shouldFetch={shouldFetch}
              />
              }
            </section>
            <section className={ !hasResult.user ? S.hidden : '' }>
              <div className={S["section-title"]}>
                <h3>Users</h3>
                <button
                  type='button'
                  aria-label='회원 탭으로 이동하여 전체 검색 결과 보기'
                  onClick={() => handleTabClick('user')}
                >+ 더 보기</button>
              </div>
              { shouldFetch && 
              <SearchUser
                keyword={keyword}
                previewCount={cardPreviewCount}
                onResult={(hasData: boolean) => setHasResults(prev => ({...prev, user: hasData}))}
                shouldFetch={shouldFetch}
              />
              }
            </section>
          </div>
        </div>
        <div className={S["panel-item"]}>
          <div className={S["search-list"]}>
            { shouldFetch && 
            <SearchMovie
              keyword={keyword}
              filters={filters}
              shouldFetch={shouldFetch}
            />
            }
          </div>
        </div>
        <div className={S["panel-item"]}>
          <div className={S["search-list"]}>
            { shouldFetch && 
            <SearchSeries
              keyword={keyword}
              filters={filters}
              shouldFetch={shouldFetch}
            />
            }
          </div>
        </div>
        <div className={S["panel-item"]}>
          <div className={S["search-list"]}>
            { shouldFetch && 
            <SearchQuote
              keyword={keyword}
              shouldFetch={shouldFetch}
            />
            }
          </div>
        </div>
        <div className={S["panel-item"]}>
          <div className={S["search-list"]}>
            { shouldFetch && 
            <SearchUser
              keyword={keyword}
              shouldFetch={shouldFetch}
            />
            }
          </div>
        </div>
      </>
  );
  
  return (
    <div className={S["search-tab-container"]}>
      <div className={S["tab-list"]} role='tablist' aria-label='검색 카테고리'>
        { TAB_TYPES.map(tab => (
          <button
            key={tab}
            role='tab'
            ref={el => {tabRefs.current[tab] = el}}
            aria-selected={activeTab === tab}
            className={ activeTab === tab ? S.selected : ''}
            onClick={() => handleTabClick(tab)}
          >
            {TAB_LABELS[tab]}
          </button>
        ))}
        <div ref={indicatorRef} className={S.indicator}></div>
      </div>
      { !shouldFetch &&
        <div className={S.warning}>
          <img src={warningIcon} alt="경고" />
          <p>요청이 너무 빠르게 반복되고 있어요.</p> 
          <p>잠시만 기다려주세요.</p>
        </div>
      }
      { 
        <div className={S["search-tab-panel"]} role='tabpanel' ref={panelRef}>
          { resultPanel }
        </div>
      }
    </div>
  )
});

export default SearchTab
