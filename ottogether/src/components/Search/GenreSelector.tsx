import { genreListTotal } from '../../lib/data';
import S from './GenreSelector.module.css';


interface GenreSelectorProps {
  selected: string[];
  onToggle: (genreList: string[]) => void;
  label?: string;
  className?: string;
}

function GenreSelector( { selected, onToggle, label, className }:GenreSelectorProps ) {

  const isAllSelected = selected.length === genreListTotal.length;

  const handleToggle = (genre:string) => {
    const next = selected.includes(genre)
      ? selected.filter(g => g !== genre)
      : [...selected, genre];
    onToggle(next);
  }

  const handleSelectAll = () => onToggle([...genreListTotal]);
  const handleClearAll = () => onToggle([]);

  return (
    <section>
      <div className={S.title}>
        { label && (
          <div className={S.counter}>
            <h4>{label}</h4>
            <span>({selected.length}개 선택됨)</span>
          </div>
        ) }
        <div className={ label ? S.selector : S["no-title-selector"]}>
          <button 
            type="button"
            disabled={isAllSelected}
            aria-label='장르 목록 전체 선택'
            onClick={handleSelectAll}
          >전체 선택</button>
          <button 
            type="button"
            disabled={selected.length === 0}
            aria-label='장르 목록 선택 전체 해제'
            onClick={handleClearAll}
          >전체 해제</button>
        </div>
      </div>

      <div className={`${S["genre-list"]} ${className ?? ''}`.trim()}>
        {
          genreListTotal.map((genre, index) => (
            <div key={genre} className={S["genre-item"]}>
              <input 
              type="checkbox"
              id={`genre-${index}`}
              value={genre}
              checked={selected.includes(genre)}
              onChange={(e) => handleToggle(e.target.value)}
              className={S.checkbox}
              />
              <label htmlFor={`genre-${index}`} className={S["genre-label"]}>{genre}</label>
            </div>
          ))
        }
      </div>
    </section>
  )
}
export default GenreSelector