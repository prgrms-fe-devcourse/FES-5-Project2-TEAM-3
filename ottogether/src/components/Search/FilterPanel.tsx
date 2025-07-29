import { useEffect, useRef, useState } from 'react';
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

const RATING_MIN = 0;
const RATING_MAX = 5;

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

  const [ error, setError ] = useState<string | null>(null);

  // input 상태 string으로 관리
  const [ ratingMinInput, setRatingMinInput ] = useState<string>(String(''));
  const [ ratingMaxInput, setRatingMaxInput ] = useState<string>(String(''));

  const dialogRef = useRef<HTMLDialogElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  /* 초기 rating input값 */
  useEffect(() => {
    setRatingMinInput(String(ratingMin));
    setRatingMaxInput(String(ratingMax));
  }, [ratingMin, ratingMax]);

  /* 팝업창 제어 */
  const handleDialogClose = () => {
    dialogRef.current?.close();
    onClose();
  }

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && !dialog.open) {
      dialog.showModal();
      headingRef.current?.focus();
    }

    const handleKeyDown = (e:KeyboardEvent) => {
      if(e.key === 'Escape') handleDialogClose();
    }

    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  /* 별점 입력값 핸들러 */
  const handleRatingMinInput = (e:React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setRatingMinInput(input);

    const minInput = parseFloat(input);
    const maxInput = parseFloat(ratingMaxInput);
    
    if ( input === '') {
      setError('');
      return;
    }

    if ( isNaN(minInput) ) return;

    if ( minInput < RATING_MIN || minInput > RATING_MAX ) {
      setError('별점은 0 ~ 5 사이의 숫자로만 입력해주세요.');
    } else if ( minInput > maxInput ) {
      setError('별점의 최소값은 최대값보다 작아야 합니다.');
    } else {
      setError('');
      onRatingChage(minInput, ratingMax);
    }
  }

  const handleRatingMaxInput = (e:React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setRatingMaxInput(input);

    const minInput = parseFloat(ratingMinInput);
    const maxInput = parseFloat(input);

    if ( input === '') {
      setError('');
      return;
    }

    if ( isNaN(maxInput) ) return;

    if ( maxInput < RATING_MIN || maxInput > RATING_MAX ) {
      setError('별점은 0 ~ 5 사이의 숫자로만 입력해주세요.');
    } else if ( minInput > maxInput ) {
      setError('별점의 최대값은 최소값보다 커야 합니다.');
    } else {
      setError('');
      onRatingChage(ratingMin, maxInput);
    }
  }

  /* 필터 적용 */
  const handleApplyFilter = () => {
    // 별점 입력값이 비어있을 경우 최대/최소값 부여
    const min = parseFloat(ratingMinInput);
    const max = parseFloat(ratingMaxInput);
    const safeMin = isNaN(min) ? RATING_MIN : min;
    const safeMax = isNaN(max) ? RATING_MAX : max;
    onRatingChage(safeMin, safeMax);

    onApply();
    dialogRef.current?.close();
    onClose();
  }

  return (
    <dialog 
      ref={dialogRef} 
      className={S.dialog} 
      onCancel={handleDialogClose}
      aria-labelledby="filter-dialog-title"
      aria-modal="true"
    >
      <div className={S.panel}>
        <h3 id="filter-dialog-title" ref={headingRef} tabIndex={-1}>필터 조건 설정</h3>

        <button className={S["close-button"]} onClick={handleDialogClose} aria-label="선택창 닫기">
          <img src={closeBtn} alt="닫기" aria-hidden="true" />
        </button>

        <OttSelector selected={selectedOtt} onToggle={onToggleOtt} label='OTT 플랫폼' className={S["compact-gap"]} />
        <GenreSelector selected={selectedGenres} onToggle={onToggleGenre} label='장르' className={S["compact-list"]} />

        <section className={S.section}>
          <h4>별점 범위</h4>
          <div className={S.rangeRow}>
            <span aria-hidden="true">⭐️</span>
            <input 
              type="number"
              inputMode='decimal'
              aria-label='최소 별점'
              min={0}
              max={ratingMax}
              step={0.1}
              value={ratingMinInput}
              onChange={handleRatingMinInput}
            />
            {' ~ '}
            <input 
              type="number"
              inputMode='decimal'
              aria-label='최대 별점'
              min={ratingMin}
              max={5}
              step={0.1}
              value={ratingMaxInput}
              onChange={handleRatingMaxInput}
            />
          </div>
          { error && <p className={S.error} aria-live='polite'>{error}</p>}
        </section>

        <section className={S.section}>
          <h4>개봉일 / 방영 시작일</h4>
          <div className={S.rangeRow}>
            <input 
              type="date"
              aria-label="시작일"
              value={releaseFrom}
              max={releaseTo !== '' ? releaseTo : undefined}
              onChange={(e) => onReleaseChange(e.target.value, releaseTo)}
            />
            {' ~ '}
            <input 
              type="date"
              aria-label="종료일"
              value={releaseTo}
              min={releaseFrom !== '' ? releaseFrom : undefined}
              onChange={(e) => onReleaseChange(releaseFrom, e.target.value)}
            />
          </div>
        </section>

        <section className={S["button-group"]}>
          <button 
            className={S['apply-button']} 
            onClick={handleApplyFilter}
          >적용</button>
          <button className={S['clear-button']} onClick={onClear}>초기화</button>
        </section>
      </div>
    </dialog>
  )
}
export default FilterPanel