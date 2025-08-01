import DeleteAccountSection from "./DeleteAccountSection";
import NotificationSection from "./NotificationSection";
import PasswordSection from "./PasswordSection";
import S from "./SystemSettings.module.css";
import VisibilitySection from "./VisibilitySection";

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

interface Props {
  user: UserType | null;
  profile: ProfileType | null;
}

function SystemSettings({ user, profile }: Props) {
  return (
    <div className={S["settings-container"]}>
      
      <VisibilitySection user={user} profile={profile} />
      <NotificationSection user={user} profile={profile} />
      <PasswordSection user={user} profile={profile} onOpenModal={() => console.log("비밀번호 변경 모달 열기")} />
      <DeleteAccountSection user={user} profile={profile} onOpenModal={() => console.log("탈퇴 모달 열기")} />
    </div>
  );
}

export default SystemSettings;