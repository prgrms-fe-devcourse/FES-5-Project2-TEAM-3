import S from './SearchTab.module.css';
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const TAB_TYPES = ['total', 'movie', 'series', 'quote', 'user'] as const;
type TabType = typeof TAB_TYPES[number];

const TAB_LABELS: Record<TabType, string> = {
  total: "Total",
  movie: "Movies",
  series: "TV Show",
  quote: "Quotes",
  user: "Users"
};

function SearchTab() {
  
  const location = useLocation();
  const navigate = useNavigate();
  const [ activeTab, setActiveTab ] = useState<TabType>('total');

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
    const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

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
    // const currentTab = tabRefs.current[activeTab];
  })

  return (
    <div className={S["search-tab-container"]}>
      <div className={S["tab-list"]} role='tablist' aria-label='검색 카테고리'>
        { TAB_TYPES.map(tab => (
          <button
            key={tab}
            role='tab'
            // ref={el => (tabRefs.current[tab] = el)}
            aria-selected={activeTab === tab}
            className={ activeTab === tab ? S.selected : ''}
            onClick={() => handleTabClick(tab)}
          >
            {TAB_LABELS[tab]}
          </button>
        ))}
      </div>
      <div className={S["search-tab-panel"]} role='tabpanel'>
        {
          activeTab === 'total' ? (
            <>
              <section>
                <h3>Movies</h3>
                {/* 영화 리스트 */}
              </section>
              <section>
                <h3>TV Shows</h3>
                {/* 시리즈 리스트 */}
              </section>
              <section>
                <h3>Quotes</h3>
                {/* 명대사 리스트 */}
              </section>
              <section>
                <h3>Users</h3>
                {/* 유저 리스트 */}
              </section>
            </>
          ) : (
            <div>
              {/* 선택한 탭에 따라 필터된 리스트만 렌더링 */}
            </div>
          )
        }
      </div>
    </div>
  )
}
export default SearchTab