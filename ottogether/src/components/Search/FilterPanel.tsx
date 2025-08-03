import { useEffect, useRef, useState } from 'react';
import S from './FilterPanel.module.css';
import OttSelector from './OttSelector';
import GenreSelector from './GenreSelector';
import closeBtn from '../../assets/icons/close.svg';
import { genreListTotal, ottListTotal } from '../../lib/data';

interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;

  selectedOtt: string[];
  onToggleOtt: (ottList: string[]) => void;

  selectedGenres: string[];
  onToggleGenre: (genreList: string[]) => void;

  ratingMin: number;
  ratingMax: number;
  onRatingChange: (min:number, max:number) => void;

  releaseFrom: string;
  releaseTo: string;
  onReleaseChange: (from:string, to:string) => void;
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
  onRatingChange,
  releaseFrom,
  releaseTo,
  onReleaseChange,
}:FilterPanelProps) {

  const [ error, setError ] = useState<string | null>(null);

  // Filter 변경 사항 임시 저장
  const [ draftOtt, setDraftOtt ] = useState<string[]>([]);
  const [ draftGenres, setDraftGenres ] = useState<string[]>([]);
  const [ draftRatingRange, setDraftRatingRange ] = useState<[number, number]>([0,5]);
  const [ draftReleaseRange, setDraftReleaseRange ] = useState<[string, string]>(['','']);
  const [ isModified, setIsModified ] = useState<boolean>(false);

  // input 상태 string으로 관리
  const [ ratingMinInput, setRatingMinInput ] = useState<string>(String(''));
  const [ ratingMaxInput, setRatingMaxInput ] = useState<string>(String(''));

  const dialogRef = useRef<HTMLDialogElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  /* 필터 임시저장값 초기화 */
  useEffect(() => {
    if (isOpen) {
      setRatingMinInput(String(ratingMin));
      setRatingMaxInput(String(ratingMax));
      setDraftOtt(selectedOtt);
      setDraftGenres(selectedGenres);
      setDraftRatingRange([ratingMin, ratingMax]);
      setDraftReleaseRange([releaseFrom, releaseTo]);
    }
  }, [isOpen]);

  /* 변경 여부 비교 */
  useEffect(() => {
    const [ minDraft, maxDraft ] = draftRatingRange;
    const [ fromDraft, toDraft ] = draftReleaseRange;
    const sortStr = (arr: string[]) => JSON.stringify([...arr].sort())
    const isDiff = 
      sortStr(draftOtt) !== sortStr(selectedOtt) ||
      sortStr(draftGenres) !== sortStr(selectedGenres) ||
      minDraft !== ratingMin ||
      maxDraft !== ratingMax ||
      fromDraft !== releaseFrom ||
      toDraft !== releaseTo;

    setIsModified(isDiff);
  }, [draftOtt, draftGenres, draftRatingRange, draftReleaseRange,
    selectedOtt, selectedGenres, ratingMin, ratingMax, releaseFrom, releaseTo])
  
  /* 팝업창 제어 */
  const handleDialogClose = () => {
    
    if (isModified) {
      const confirmClose = confirm('적용되지 않은 변경사항이 있습니다. 그래도 닫을까요?');
      if ( !confirmClose ) return;
    }

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

  /* OTT Toggle */
  const handleToggleDraftOtt = (ottList:string[]) => {
    setDraftOtt(ottList);
  };
  /* Genre Toggle */
  const handleToggleDraftGenre = (genreList:string[]) => {
    setDraftGenres(genreList);
  };

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
      setDraftRatingRange([minInput, draftRatingRange[1]]);
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
      setDraftRatingRange([draftRatingRange[0], maxInput]);
    }
  }

  /* Release Range Handler */
  const handleReleaseFromInput = (e:React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setDraftReleaseRange([input, draftReleaseRange[1]]);
  }
  const handleReleaseToInput = (e:React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setDraftReleaseRange([draftReleaseRange[0], input]);
  }

  /* 필터 적용 */
  const handleApplyFilter = () => {
    onToggleOtt(draftOtt);
    onToggleGenre(draftGenres);
    onReleaseChange(...draftReleaseRange);
    
    // 별점 입력값이 비어있을 경우 최대/최소값 부여
    const min = parseFloat(ratingMinInput);
    const max = parseFloat(ratingMaxInput);
    const safeMin = isNaN(min) ? RATING_MIN : min;
    const safeMax = isNaN(max) ? RATING_MAX : max;
    onRatingChange(safeMin, safeMax);

    dialogRef.current?.close();
    onClose();
  }

  /* 초기화 */
  const handleClearAll = () => {
    setDraftOtt(ottListTotal);
    setDraftGenres(genreListTotal);
    setDraftRatingRange([RATING_MIN, RATING_MAX]);
    setDraftReleaseRange(['','']);
    setError('');
  };

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

        <OttSelector selected={draftOtt} onToggle={handleToggleDraftOtt} label='OTT 플랫폼' className={S["compact-gap"]} />
        <GenreSelector selected={draftGenres} onToggle={handleToggleDraftGenre} label='장르' className={S["compact-list"]} />

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
              value={draftReleaseRange[0]}
              max={draftReleaseRange[1] !== '' ? draftReleaseRange[1] : undefined}
              onChange={handleReleaseFromInput}
            />
            {' ~ '}
            <input 
              type="date"
              aria-label="종료일"
              value={draftReleaseRange[1]}
              min={draftReleaseRange[0] !== '' ? draftReleaseRange[0] : undefined}
              onChange={handleReleaseToInput}
            />
          </div>
        </section>

        <section className={S["button-group"]}>
          <button 
            className={S['apply-button']} 
            onClick={handleApplyFilter}
          >적용</button>
          <button className={S['clear-button']} onClick={handleClearAll}>초기화</button>
        </section>
      </div>
    </dialog>
  )
}
export default FilterPanel