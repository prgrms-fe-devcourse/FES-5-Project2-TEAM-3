import S from "./Settings.module.css";

interface UserType {
  id: string;
  email?: string;
}

interface ProfileType {
  nickname: string | null;
  bio: string | null;
  url: string | null;
  avatar_url: string | null;
  header_url: string | null;
}

interface SettingsProps {
  user: UserType | null;
  profile: ProfileType | null;
}






function Settings({ user, profile }: SettingsProps) {
  if (!user) {
    return <div>로그인이 필요합니다.</div>;
  }

  return (
    <div className={S.settingsPage}>
      {/* 배너 */}
      <div className={S.banner}>
        <img
          src={profile?.header_url || "/default-header3.png"}
          alt="banner"
          className={S.bannerImg}
        />
      </div>

      {/* 아바타 */}
      <div className={S.avatarWrapper}>
        <img
          src={profile?.avatar_url || "/default-avatar3.png"}
          alt="avatar"
          className={S.avatarImg}
        />
      </div>

      <form className={S.form}>
        <label>
          닉네임
          <input
            type="text"
            defaultValue={profile?.nickname || ""}
            maxLength={20}
          />
        </label>

        <label>
          소개
          <input
            type="text"
            defaultValue={profile?.bio || ""}
            maxLength={30}
          />
        </label>

        <label>
          URL
          <input
            type="text"
            defaultValue={profile?.url || ""}
            maxLength={300}
          />
        </label>

        <button type="submit" className={S.submitBtn}>
          확인
        </button>
      </form>
    </div>
  );
}

export default Settings;
