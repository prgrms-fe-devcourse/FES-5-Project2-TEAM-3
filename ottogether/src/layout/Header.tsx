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
import NotificationsModal from '../components/Notifications/NotificationsModal';

function Header() {
  /* user Login 상태 & 알림 유무 */
  const { user, isAuth, logout, avatarUpdatedAt } = useAuth();
  const [ hasNewNoti, setHasNewNoti ] = useState(false);

  /* 반응형 햄버거 버튼 제어 */
  const [ isMobile, setIsMobile ] = useState<boolean>(false);
  const [ isMenuOpen, setIsMenuOpen ] = useState<boolean>(false);
  const [ closeTrigger, setCloseTrigger ] = useState<boolean>(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null) as React.RefObject<HTMLButtonElement>;

  /* 프로필 사진 */
  const [ avatar, setAvatar ] = useState<string | null>(null);
  const [ isAvatarLoading, setIsAvatarLoading ] = useState<boolean>(false);

  const [showNotiModal, setShowNotiModal] = useState(false);
  const notiRef = useRef<HTMLDivElement>(null);

  /* unread 알림 체크 */
  useEffect(() => {
    if (!user) return;

    const fetchUnread = async () => {
      const { data, error } = await supabase
        .from("notifications")
        .select("id")
        .eq("user_id", user.id)
        .eq("is_read", false);

      if (!error) {
        setHasNewNoti((data?.length ?? 0) > 0);
      }
    };
    fetchUnread();

    const interval = setInterval(fetchUnread, 10000);
    return () => clearInterval(interval);

  }, [user]);

  /* 알림 모달 */
  const handleToggleNotiModal = () => {
    setShowNotiModal((prev) => !prev);
  };

  /* 바깥 클릭 시 모달 닫기 */
  useEffect(() => {
    if (!showNotiModal) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (notiRef.current && !notiRef.current.contains(e.target as Node)) {
        setShowNotiModal(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showNotiModal]);

  /* ESC 키 눌렀을 때 모달 닫기 */
  useEffect(() => {
    if (!showNotiModal) return;

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowNotiModal(false);
      }
    };

    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [showNotiModal]);


  useEffect(() => {
    if (!user) return;

    const fetchAvatarUrl = async () => {
      try {
        setIsAvatarLoading(true);
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
      } finally {
        setIsAvatarLoading(false);
      }
    };
    fetchAvatarUrl();
  }, [user, avatarUpdatedAt]);

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
    if (!showSearch) return;

    const handleClickOutside = (e:MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(e.target as Node)
      ) {
        closeSearch();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);

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
    },100);
  };

  const handleSearchKeyDown = (e:React.KeyboardEvent<HTMLInputElement>) => {
    if ( e.key === 'Enter' ) handleSearch();
  };

  /* 로그아웃 */
  const handleLogOut = () => {
    const confirmLogout = confirm('정말 로그아웃 하시겠습니까?');
    if ( !confirmLogout ) return;

    if (isMenuOpen) setCloseTrigger(true);
    logout();
    alert('로그아웃 되었습니다.');
  }

  /* route list */
  const routeLIst = routes.filter(route => !route.hidden)
                .map(route => (
                  <li key={route.path}>
                    <NavLink
                    to={route.path}
                    className={({isActive}) => (isActive ? S["active-route"] : '')}
                    onClick={()=> setCloseTrigger(true)}
                    >{route.label}</NavLink>
                  </li>
                ));

  /* 햄버거 버튼 제어 */
  const handleMenuToggle = () => {
    if(isMenuOpen) {
      setCloseTrigger(true);
    } else {
      setIsMenuOpen(true);
      setCloseTrigger(false);
    }
  };

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
          { (isAvatarLoading || avatar === null) ? (
            <div className={S["avatar-skeleton"]} aria-hidden={true} />
            ) : (
            <img src={avatar ? avatar : getRandomAvatar()} alt="유저 프로필" aria-label='마이 페이지로 이동합니다' />
            )
          }
        </button>

        <div className={S["notification-wrapper"]}>
        <img
          src={bellIcon}
          alt="알림"
          className={S.icon}
          onClick={handleToggleNotiModal}
        />
        {hasNewNoti && <span className={S["red-dot"]} />}  {/* ✅ unread 있을 때만 표시 */}

        {showNotiModal && (
          <div className={S["notification-dropdown"]} ref={notiRef}>
            <NotificationsModal
              user={user}
              profile={null}
              onClose={() => setShowNotiModal(false)}
            />
          </div>
          )}
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
          onClick={()=> {
            navigate('/my-page', { state: { activeTab: 'notifications' } });
          }}
        >
          { (isAvatarLoading || avatar === null) ? (
            <div className={S["avatar-skeleton"]} aria-hidden={true} />
            ) : (
            <img src={avatar ? avatar : getRandomAvatar()} alt="유저 프로필" aria-label='마이 페이지로 이동합니다' />
            )
          }
          { hasNewNoti && <span className={S["red-dot"]} /> }
        </button>
        <button 
          type="button"
          ref={menuButtonRef}
          className={S["icon-button"]}
          onClick={handleMenuToggle}
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
          ref={menuButtonRef}
          className={S["icon-button"]}
          onClick={handleMenuToggle}
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
          onClick={() => {
            navigate('/my-page');
            setCloseTrigger(true);
          }}
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
          onClick={() => {
            navigate('/register');
            setCloseTrigger(true);
          }}
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
              buttonRef={menuButtonRef}
              onClose={handleMenuClose}
              className={S.dropdown}
              closeTrigger={closeTrigger}
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