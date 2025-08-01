import S from './SearchBar.module.css';
import searchIcon from '@/assets/icons/search-white.svg';
import searchIconBlack from '@/assets/icons/search-black.svg';
import filterOnIcon from '@/assets/icons/filter-on.svg';
import filterOffIcon from '@/assets/icons/filter-off.svg';
import { useState } from 'react';

interface SearchBarProps {
  keyword: string;
  onChange: (value: string) => void;
  onEnter: (e:React.KeyboardEvent<HTMLInputElement>) => void;
  onRightIconClick: () => void;
  isPopup?: boolean;
  isFiltered?: boolean;
  className?: string;
}

function SearchBar({
  keyword,
  onChange,
  onEnter,
  onRightIconClick,
  isPopup = false,
  isFiltered = false,
  className = '',
}:SearchBarProps) {

  const [ isComposing, setIsComposing ] = useState(false);

  const handleKeyDown = (e:React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isComposing) onEnter(e);
  };
  
  const filterIcon = isFiltered ? filterOnIcon : filterOffIcon;
  
  return (
    <div className={`${ isPopup ? S["search-popup"] : S["search-bar"]}${className}`.trim()}>
      { !isPopup && (
        <img 
          src={searchIcon} 
          alt="검색" className={S["left-icon"]} aria-hidden="true" />
      )}
      <input 
        type="text" 
        name="검색창" 
        placeholder='영화, 시리즈 또는 유저를 검색하세요' 
        value={keyword}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onCompositionStart={()=>setIsComposing(true)}
        onCompositionEnd={()=>setIsComposing(false)}
        autoFocus={isPopup}
      />
      <button 
        type="button" 
        className={S["icon-button"]}
        onClick={onRightIconClick}
        aria-label={isPopup ? '검색' : '필터 선택창 열기'}
      >
        <img 
          className={S.icon} 
          src={isPopup ? searchIconBlack : filterIcon} 
          alt=""
          aria-hidden="true"
         />
      </button>
    </div>
  )
}
export default SearchBar;