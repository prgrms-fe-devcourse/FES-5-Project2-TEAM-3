import { useEffect, useRef } from 'react';
import S from './FilterPanel.module.css';
import OttSelector from './OttSelector';
import GenreSelector from './GenreSelector';
import closeBtn from '../../assets/icons/close.svg';

interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;

  selectedOtt: string[];
  onToggleOtt: (ott: string) => void;

  selectedGenres: string[];
  onToggleGenre: (e:React.ChangeEvent<HTMLInputElement>) => void;

  ratingMin: number;
  ratingMax: number;
  onRatingChage: (min:number, max:number) => void;

  releaseFrom: string;
  releaseTo: string;
  onReleaseChange: (from:string, to:string) => void;

  onClear: () => void;
  onApply: () => void;
}

function FilterPanel({
  isOpen,
  onClose,
  selectedOtt,
  onToggleOtt,
  selectedGenres,
  onToggleGenre,
  ratingMin,
  ratingMax,
  onRatingChage,
  releaseFrom,
  releaseTo,
  onReleaseChange,
  onClear,
  onApply,
}:FilterPanelProps) {

  const dialogRef = useRef<HTMLDialogElement>(null);

  // 팝업창 제어
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && !dialog.open) {
      dialog.showModal();
    }

    const handleKeyDown = (e:KeyboardEvent) => {
      if(e.key === 'Escape') onClose();
    }

    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);


  return (
    <dialog ref={dialogRef} className={S.dialog} onCancel={onClose} >
      <div className={S.panel} role='dialog' aria-modal="true">
        <h3 aria-label='검색 필터 조건 선택창'>필터 조건 설정</h3>

        <button className={S["close-button"]}>
          <img src={closeBtn} alt="선택창 닫기" onClick={onClose} />
        </button>
        <OttSelector selected={selectedOtt} onToggle={onToggleOtt} label='OTT 플랫폼' className="compact-gap" />
        <GenreSelector selected={selectedGenres} onToggle={onToggleGenre} label='장르' className="compact-list" />

        <section className={S.section}>
          <h4>평점 범위</h4>
          <div className={S.rangeRow}>
            <input 
              type="number"
              min={0}
              max={ratingMax}
              step={0.1}
              value={ratingMin}
              onChange={(e) => onRatingChage(Number(e.target.value), ratingMax)}
            />
            {' ~ '}
            <input 
              type="number"
              min={ratingMin}
              max={5}
              step={0.1}
              value={ratingMax}
              onChange={(e) => onRatingChage(ratingMin, Number(e.target.value))}
            />
          </div>
        </section>

        <section className={S.section}>
          <h4>개봉일 / 방영 시작일</h4>
          <div className={S.rangeRow}>
            <input 
              type="date"
              value={releaseFrom}
              max={releaseTo !== '' ? releaseTo : undefined}
              onChange={(e) => onReleaseChange(e.target.value, releaseTo)}
            />
            {' ~ '}
            <input 
              type="date"
              value={releaseTo}
              min={releaseFrom !== '' ? releaseFrom : undefined}
              onChange={(e) => onReleaseChange(releaseFrom, e.target.value)}
            />
          </div>
        </section>

        <section className={S["button-group"]}>
          <button className={S['apply-button']} onClick={onApply}>적용</button>
          <button className={S['cancel-button']} onClick={onClear}>초기화</button>
        </section>
      </div>
    </dialog>
  )
}
export default FilterPanel