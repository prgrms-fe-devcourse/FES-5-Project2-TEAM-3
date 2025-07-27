
import S from './NotFound.module.css'

function NotFound() {
  return (
    <div className={S.container}>
      <img 
        src="/notFound.png" 
        alt="" 
        aria-label='404 Not Found Image'
      />
      <div>
        <h1>Error!</h1>
        <h2>Cannot Find Page...</h2>
      </div>
    </div>
  )
}
export default NotFound