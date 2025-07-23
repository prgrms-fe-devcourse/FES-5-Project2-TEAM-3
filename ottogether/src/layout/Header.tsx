import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import S from './Header.module.css';
import logo from '@/assets/logo.svg';
import searchIcon from '@/assets/icons/search-normal.svg';
import bellIcon from '@/assets/icons/notification.svg';
import routes from '../router/routes';

function Header() {

  /* user Login 상태 & 알림 유무 */
  // 나중에 전역 상태 context로 변경 필요
  const [ isLoggedIn, setIsLoggedIn ] = useState(false);
  const [ hasNewNoti, setHasNewNoti ] = useState(true);

  const [ showSearch, setShowSearch ] = useState(false);

  const toggleSearch = () => setShowSearch(prev => !prev)

  let buttonList = null;
  if (isLoggedIn) {
    buttonList = (
      <>
        <button type='button' className={S["outlineBtn"]}>Log Out</button>
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
        <button type='button' className={S["outlineBtn"]}>Sign Up</button>
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

      <img src={searchIcon} alt="검색 아이콘" className={S.icon} onClick={toggleSearch} />
      <nav className={S.nav}>
        <h2 className='a11y-hidden'>내비게이션 메뉴</h2>
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

      {
        showSearch && (
          <div className={S["search-popup"]}>
            <input type="text" name="검색창" placeholder='영화, 시리즈 또는 유저를 검색하세요' />
          </div>
        )
      }
    </header>
  )
}
export default Header