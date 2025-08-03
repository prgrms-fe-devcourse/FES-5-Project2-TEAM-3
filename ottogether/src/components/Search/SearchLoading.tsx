import S from './SearchLoading.module.css';

function SearchLoading() {
  return (
    <div className={S.loader}>
      <div className={S["loading-spinner"]}></div>
      <p className={S["loading-message"]}>검색 결과를 불러오고 있어요 🔍</p> 
    </div>
  )
}
export default SearchLoading