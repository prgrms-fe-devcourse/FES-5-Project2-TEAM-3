import S from './FilterPanel.module.css';
import GenreSelector from './GenreSelector';
import OttSelector from './OttSelector';

interface FilterPanelProps {
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

  return (
    <aside className={S.panel}>
      <h3 aria-label='검색 필터 조건 선택창' className='a11y-hidden'>필터 조건</h3>

      <OttSelector selected={selectedOtt} onToggle={onToggleOtt} label='OTT 플랫폼' />

      <GenreSelector selected={selectedGenres} onToggle={onToggleGenre} label='장르' />

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

    </aside>
  )
}
export default FilterPanel