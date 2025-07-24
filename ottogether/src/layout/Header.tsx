import { useEffect, useRef, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import S from './Header.module.css';
import logo from '@/assets/logo.svg';
import searchIcon from '@/assets/icons/search-white.svg';
import searchIconBlack from '@/assets/icons/search-black.svg';
import bellIcon from '@/assets/icons/notification.svg';
import routes from '../router/routes';

function Header() {

  /* user Login 상태 & 알림 유무 */
  // 나중에 전역 상태 context로 변경 필요
  const [ isLoggedIn, setIsLoggedIn ] = useState(false);
  const [ hasNewNoti, setHasNewNoti ] = useState(false);

  /* 검색창 팝업 */
  const [ showSearch, setShowSearch ] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const toggleSearch = () => setShowSearch(prev => !prev)
  const closeSearch = () => setShowSearch(false);

  // ESC 키 누르면 검색창 닫기
  useEffect(()=> {
    const handleEscapeKeyDown = (e:KeyboardEvent) => {
      if (e.key === 'Escape') closeSearch();
    };
    document.addEventListener('keydown', handleEscapeKeyDown);
    return () => document.removeEventListener('keydown', handleEscapeKeyDown);
  }, []);

  // 검색창 바깥 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (e:MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(e.target as Node)
      ) {
        closeSearch();
      }
    };
    if (showSearch) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showSearch]);

  /* 검색 결과 넘겨주기 */
  const [ searchKeyword, setSearchKeyword ] = useState<string>('');
  const navigate = useNavigate();

  const handleSearch = () => {
    if ( searchKeyword.trim() === '' ) {
      alert('검색어를 입력해주세요.');
      searchRef.current?.focus();
      return;
    }
    navigate(`/search?query=${encodeURIComponent(searchKeyword)}`);
    setShowSearch(false);
  };

  const handleSearchKeyDown = (e:React.KeyboardEvent<HTMLInputElement>) => {
    if ( e.key === 'Enter' ) handleSearch();
  };

  /* 로그인 상태별 버튼 리스트 변경 */
  let buttonList = null;
  if (isLoggedIn) {
    buttonList = (
      <>
        <button type='button' className={S["outline-button"]}>Log Out</button>
        <button type='button' className={S["filled-button"]}>My Page</button>
        <div className={S['notification-wrapper']}>
          <img src={bellIcon} alt="알림" className={S.icon} />
          { hasNewNoti && <span className={S["red-dot"]} /> }
        </div>
      </>
    )
  } else {
    buttonList = (
      <>
        <button 
          type='button' 
          className={S["outline-button"]}
          onClick={()=> navigate('/register')}
        >Sign Up</button>
        <button type='button' className={S["filled-button"]}>Log In</button>
      </>
    )
  }

  return (
    <header className={S.header}>
      <h1>
        <a href='/'>
          <img src={logo} alt="OTTogether 로고" className={S.logo} />
        </a>
      </h1>

      <nav className={S.nav}>
        <h2 className='a11y-hidden'>내비게이션 메뉴</h2>
        <div className={S['search-wrapper']} ref={searchRef}>
          <button type="button" onClick={toggleSearch} className={S["icon-button"]} aria-label='검색'>
            <img src={searchIcon} alt="검색 아이콘" className={S.icon} />
          </button>
          {
            showSearch && (
              <div className={S["search-popup"]}>
                <input 
                  type="text" 
                  name="검색창" 
                  placeholder='영화, 시리즈 또는 유저를 검색하세요' 
                  autoFocus
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                />
                <button type="button" onClick={handleSearch} className={S["icon-button"]}>
                  <img className={S.icon} src={searchIconBlack} alt="검색" />
                </button>
              </div>
            )
          }
        </div>
        <ul>
          {
          routes.filter(route => !route.hidden)
            .map(route => (
              <li key={route.path}>
                <NavLink
                to={route.path}
                className={({isActive}) => (isActive ? S.activeRoute : '')}
                >{route.label}</NavLink>
              </li>
            ))
          }
        </ul>
        <div className={S['button-group']}>
          {buttonList}
        </div>
      </nav>
    </header>
  )
}
export default Header