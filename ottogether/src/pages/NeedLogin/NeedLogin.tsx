import S from "./NeedLogin.module.css"
import needLoginMan from "../../assets/need-login-character.png"

function NeedLogin() {

  return (
    <div className={S["container"]}>
          <img className={S["need-login-img"]} src={needLoginMan} alt="환영 캐릭터" />
            <p className={S["my-notice"]}> 로그인이 필요한 페이지 입니다.</p>
        </div>
  )
}

export default NeedLogin