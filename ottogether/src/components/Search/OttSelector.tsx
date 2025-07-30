import S from './OttSelector.module.css';
import { ottListTotal } from "../../lib/data";

interface OttSelectorProps {
  selected: string[];
  onToggle: (ott: string[]) => void;
  label?: string;
  className?: string;
}

function OttSelector({ selected, onToggle, label, className }:OttSelectorProps) {
  const isAllSelected = selected.length === ottListTotal.length;

  const handleToggle = (genre:string) => {
    const next = selected.includes(genre)
      ? selected.filter(g => g !== genre)
      : [...selected, genre];
    onToggle(next);
  }

  const handleSelectAll = () => onToggle([...ottListTotal]);
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
            aria-label='OTT 목록 전체 선택'
            onClick={handleSelectAll}
          >전체 선택</button>
          <button 
            type="button"
            disabled={selected.length === 0}
            aria-label='OTT 목록 선택 전체 해제'
            onClick={handleClearAll}
          >전체 해제</button>
        </div>
      </div>
      <ul className={`${S["ott-selection"]} ${className ?? ''}`.trim()}>
        { ottListTotal.map(ott => (
          <li key={ott}>
            <figure className={S["ott-item"]}>
              <button 
                type='button'
                className={selected.includes(ott) ? S.selected : ''}
                onClick={() => handleToggle(ott)}
              >
                <img src={`/ott/${ott}.png`} alt={`${ott} 로고`} />
              </button>
              <figcaption>{ott}</figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </section>
  )
}
export default OttSelector