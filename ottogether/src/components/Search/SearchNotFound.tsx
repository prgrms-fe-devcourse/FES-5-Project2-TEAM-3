import S from './SearchNotFound.module.css';
import notFound from '../../assets/notfound-character.png';

interface SearchNotFoundProps {
  keyword: string;
  tab?: string;
}

function SearchNotFound( { keyword, tab = '' }:SearchNotFoundProps ) {
  return (
    <div className={S["not-found-list"]}>
      <figure>
        <img src={notFound} alt="슬퍼하는 범쌤" />
      </figure>
      <div className={S["not-found-captions"]}>
        <h3><strong>" {keyword} "</strong>에 해당하는 <br />
        { tab } 검색 결과를 찾을 수 없어요 🥺</h3>
        <span>적용된 필터를 제외하거나<br /> 검색어를 변경하여 다시 검색해보세요!</span>
      </div>
    </div>
  )
}
export default SearchNotFound