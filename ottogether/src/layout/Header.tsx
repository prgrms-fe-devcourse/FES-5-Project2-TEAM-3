import routes from '../router/routes';
import { useCallback, useEffect, useRef, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import S from './Header.module.css';
import searchIcon from '@/assets/icons/search-white.svg';
import bellIcon from '@/assets/icons/notification.svg';
import hamburgerIcon from '@/assets/icons/menu.svg';
import SearchBar from '../components/Search/SearchBar';
import { useAuth } from '../contexts/AuthProvider';
import { supabase } from '../supabase/supabase';
import { getRandomAvatar } from '../util/getRandomProfile';
import DropdownMenu from './DropdownMenu';

function Header() {
  /* user Login 상태 & 알림 유무 */
  const { user, isAuth, logout } = useAuth();
  // 나중에 전역 상태 context로 변경 필요
  const [ hasNewNoti, setHasNewNoti ] = useState(true);

  /* 반응형 햄버거 버튼 제어 */
  const [ isMobile, setIsMobile ] = useState<boolean>(false);
  const [ isMenuOpen, setIsMenuOpen ] = useState<boolean>(false);

  /* 프로필 사진 */
  const [ avatar, setAvatar ] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchAvatarUrl = async () => {
      try {
        const { data, error } = await supabase
          .from('profile')
          .select('avatar_url')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) console.error('사용자 avatar 불러오기에 실패했습니다.');

        setAvatar( data && data.avatar_url ? data.avatar_url : null );
      } catch (err) {
      console.error('사용자 avatar 불러오기에 실패했습니다.', err);
      setAvatar(null);
    }};
    fetchAvatarUrl();
  }, [user]);

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
    setTimeout(() => {
      setSearchKeyword('');
    },0);
  };

  const handleSearchKeyDown = (e:React.KeyboardEvent<HTMLInputElement>) => {
    if ( e.key === 'Enter' ) handleSearch();
  };

  /* 로그아웃 */
  const handleLogOut = () => {
    const confirmLogout = confirm('정말 로그아웃 하시겠습니까?');
    if ( !confirmLogout ) return;

    logout();
  }

  /* route list */
  const routeLIst = routes.filter(route => !route.hidden)
                .map(route => (
                  <li key={route.path}>
                    <NavLink
                    to={route.path}
                    className={({isActive}) => (isActive ? S["active-route"] : '')}
                    >{route.label}</NavLink>
                  </li>
                ));

  /* 햄버거 버튼 제어 */
  const toggleMenu = () => setIsMenuOpen(prev => !prev);
  const handleMenuClose = useCallback(()=>setIsMenuOpen(false), []);

  /* 로그인 상태별 버튼 리스트 변경 */
  let buttonList = null;
  if ( isAuth && !isMobile ) {
    // 로그인 중 + PC 화면
    buttonList = (
      <>
        <button 
          type='button' 
          className={S["outline-button"]} 
          onClick={handleLogOut}
        >Log Out</button>
        <button 
          type='button' 
          className={S["user-avatar"]}
          onClick={()=> navigate('/my-page')}
        >
          <img src={avatar ? avatar : getRandomAvatar()} alt="유저 프로필" aria-label='마이 페이지로 이동합니다' />
        </button>
        <div className={S['notification-wrapper']}>
          <img src={bellIcon} alt="알림" className={S.icon} />
          { hasNewNoti && <span className={S["red-dot"]} /> }
        </div>
      </>
    );
  } else if ( isAuth && isMobile ) {
    // 로그인 중 + 모바일 화면
    buttonList = (
      <>
        <button 
          type='button' 
          className={S["user-avatar"]}
          onClick={()=> navigate('/my-page')}
        >
          <img src={avatar ? avatar : getRandomAvatar()} alt="유저 프로필" aria-label='마이 페이지로 이동합니다' />
          { hasNewNoti && <span className={S["red-dot"]} /> }
        </button>
        <button 
          type="button"
          className={S["icon-button"]}
          onClick={toggleMenu}
          aria-label={ isMenuOpen ? "메뉴 닫기" : "메뉴 열기" }
        >
          <img src={hamburgerIcon} alt="메뉴 리스트" className={S.icon} />
        </button>
      </>
    );
  } else if ( !isAuth && !isMobile ) {
    // 로그아웃 상태 + PC 화면
    buttonList = (
      <>
        <button 
          type='button' 
          className={S["outline-button"]}
          onClick={()=> navigate('/register')}
        >Sign Up</button>
        <button 
          type='button' 
          className={S["filled-button"]}
          onClick={()=> navigate('/login')}
        >Log In</button>
      </>
    );
  } else {
    // 로그아웃 상태 + 모바일 화면
    buttonList = (
      <>
        <button 
          type='button' 
          className={S["filled-button"]}
          onClick={()=> navigate('/login')}
        >Log In</button>
        <button 
          type="button"
          className={S["icon-button"]}
          onClick={toggleMenu}
          aria-label={ isMenuOpen ? "메뉴 닫기" : "메뉴 열기" }
        >
          <img src={hamburgerIcon} alt="메뉴 리스트" className={S.icon} />
        </button>
      </>
    );
  }

  /* 햄버거 메뉴 리스트 */
  let menuList = null;
  if ( isAuth ) {
    menuList = (
      <ul>
        { routeLIst }
        <li key="logout">
          <button 
          type='button' 
          className={S["in-menu-button"]} 
          onClick={handleLogOut}
          >Log Out</button>
        </li>
        <li key="my-page">
          <button 
          type='button' 
          className={S["in-menu-button"]} 
          aria-label='마이 페이지로 이동합니다'
          onClick={() => navigate('/my-page')}
          >My Page</button>
        </li>
      </ul>
    )
  } else {
    menuList = (
      <ul>
        { routeLIst }
        <li key="sign-up">
          <button 
          type='button' 
          className={S["in-menu-button"]} 
          aria-label='회원가입 페이지로 이동합니다'
          onClick={() => navigate('/register')}
          >Sign Up</button>
        </li>
      </ul>
    )
  }

  /* resize 감지 */
  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== 'undefined') {
        setIsMobile(window.innerWidth <= 768);
      }
    }

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <header className={S.header}>
      <h1>
        <a href='/'>
          <img src='/logo.svg' alt="OTTogether 로고" className={S.logo} />
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
              <SearchBar
                keyword={searchKeyword}
                onChange={setSearchKeyword}
                onEnter={handleSearchKeyDown}
                onRightIconClick={handleSearch}
                isPopup={true}
              />
            )
          }
        </div>
        { 
          !isMobile && (
            <ul> { routeLIst } </ul>
          )
        }
        <div className={S['button-group']}>
          {buttonList}
        </div>
        {
          isMenuOpen && (
            <DropdownMenu 
              onClose={handleMenuClose}
              className={S.dropdown}
              role="menu"
              aria-label="메인 메뉴"
            >
              {menuList}
            </DropdownMenu>
          )
        }
      </nav>
    </header>
  )
}
export default Header