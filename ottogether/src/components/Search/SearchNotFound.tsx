import S from './SearchNotFound.module.css';

function SearchNotFound() {
  return (
    <div className={S["not-found-list"]}>
      <h3>해당하는 검색 결과를 찾을 수 없어요 🥺</h3>
      <span>적용된 필터를 제외하거나 검색어를 변경하여 다시 검색해보세요!</span>
    </div>
  )
}
export default SearchNotFound