import S from "./ShowDefault.module.css";
import welcomeMan from "../../assets/welcome-character.png";

interface ProfileType {
  nickname: string | null;
  bio: string | null;
  url: string | null;
  avatar_url: string | null;
  header_url: string | null;
}

interface SettingsProps {
  profile: ProfileType | null;
}

function ShowDefault({ profile }: SettingsProps) {
  return (
    <div className={S["container"]}>
      <img className={S["welcome-img"]} src={welcomeMan} alt="환영 캐릭터" />
      <div className={S["intro"]}>
        <p>🥳 환영합니다 🥳</p>
        <p>
          <span className={S.nickname}>
            {profile?.nickname ?? "Guest"}
          </span>
          님의 페이지 입니다.
        </p>
      </div>
    </div>
  );
}
export default ShowDefault;
