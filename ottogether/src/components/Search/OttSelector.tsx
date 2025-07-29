import S from './OttSelector.module.css';
import parentS from '../Search/FilterPanel.module.css';
import { ottListTotal } from "../../lib/data";

interface OttSelectorProps {
  selected: string[];
  onToggle: (ott: string) => void;
  label?: string;
  className?: string;
}

function OttSelector({ selected, onToggle, label, className }:OttSelectorProps) {

  return (
    <section>
      { label && <h4>{label}</h4> }
      <ul className={`${S["ott-selection"]} ${className ? parentS[className] : ''}`.trim()}>
        { ottListTotal.map(ott => (
          <li key={ott}>
            <figure className={S["ott-item"]}>
              <button 
                type='button'
                className={selected.includes(ott) ? S.selected : ''}
                onClick={() => onToggle(ott)}
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