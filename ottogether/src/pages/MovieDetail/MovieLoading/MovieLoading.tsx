import S from './MovieLoading.module.css';

function MovieLoading() {
  return (
    <div className={S.loader}>
      <div className={S["loading-spinner"]}></div>
      <p className={S["loading-message"]}>영화 데이터를 불러오고 있어요 🔍</p> 
    </div>
  )
}
export default MovieLoading