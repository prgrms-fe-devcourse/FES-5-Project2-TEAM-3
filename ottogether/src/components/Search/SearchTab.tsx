import gsap from 'gsap';
import S from './SearchTab.module.css';
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SearchMovie from './SearchMovie';
import React from 'react';
import SearchSeries from './SearchSeries';
import SearchQuote from './SearchQuote';
import SearchUser from './SearchUser';

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
  const moviePreviewCount = ( window.innerWidth >= 1320 ) ? 4 : ( window.innerWidth >= 980 ) ? 3 : 2;
  const cardPreviewCount = ( window.innerWidth >= 1320 ) ? 3 : 2;

  const resultPanel = (
      <>
        <div className={S["panel-item"]}>
          <div className={S["total-list"]}>
            <section className={ !hasResult.movie ? S.hidden : '' }>
              <div className={S["section-title"]}>
                <h3>Movies</h3>
                <button
                  type='button'
                  aria-label='영화 탭으로 이동하여 전체 검색 결과 보기'
                  onClick={() => handleTabClick('movie')}
                >+ 더 보기</button>
              </div>
              <SearchMovie
                keyword={keyword}
                filters={filters}
                previewCount={moviePreviewCount}
                onResult={(hasData: boolean) => setHasResults(prev => ({...prev, movie: hasData}))}
              />
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
              <SearchSeries
                keyword={keyword}
                filters={filters}
                previewCount={moviePreviewCount}
                onResult={(hasData: boolean) => setHasResults(prev => ({...prev, series: hasData}))}
              />
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
              <SearchQuote
                keyword={keyword}
                previewCount={cardPreviewCount}
                onResult={(hasData: boolean) => setHasResults(prev => ({...prev, quote: hasData}))}
              />
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
              <SearchUser
                keyword={keyword}
                previewCount={cardPreviewCount}
                onResult={(hasData: boolean) => setHasResults(prev => ({...prev, user: hasData}))}
              />
            </section>
          </div>
        </div>
        <div className={S["panel-item"]}>
          <div className={S["search-list"]}>
            <SearchMovie
              keyword={keyword}
              filters={filters}
            />
          </div>
        </div>
        <div className={S["panel-item"]}>
          <div className={S["search-list"]}>
            <SearchSeries
              keyword={keyword}
              filters={filters}
            />
          </div>
        </div>
        <div className={S["panel-item"]}>
          <div className={S["search-list"]}>
            <SearchQuote
              keyword={keyword}
            />
          </div>
        </div>
        <div className={S["panel-item"]}>
          <div className={S["search-list"]}>
            <SearchUser
              keyword={keyword}
            />
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
      <div className={S["search-tab-panel"]} role='tabpanel' ref={panelRef}>
        { resultPanel }
      </div>
    </div>
  )
});

export default SearchTab
