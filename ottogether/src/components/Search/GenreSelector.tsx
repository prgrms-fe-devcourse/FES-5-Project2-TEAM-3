import { genreListTotal } from '../../lib/data';
import S from './GenreSelector.module.css';


interface GenreSelectorProps {
  selected: string[];
  onToggle: (e:React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  className?: string;
}

function GenreSelector( { selected, onToggle, label, className }:GenreSelectorProps ) {
  return (
    <section>
      { label && <h4>{label}</h4>}
      <div className={`${S["genre-list"]} ${className ?? ''}`.trim()}>
        {
          genreListTotal.map((genre, index) => (
            <div key={genre} className={S["genre-item"]}>
              <input 
              type="checkbox"
              id={`genre-${index}`}
              value={genre}
              checked={selected.includes(genre)}
              onChange={onToggle}
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