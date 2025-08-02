import { useState } from "react";
import NotificationSection from "./NotificationSection";
import PasswordSection from "./PasswordSection";
import DeleteAccountModal from "./DeleteAccountModal";
import S from "./SystemSettings.module.css";

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
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  return (
    <div className={S["settings-container"]}>
      <NotificationSection user={user} profile={profile} />
      <PasswordSection
        user={user}
        profile={profile}
        onOpenModal={() => console.log("비밀번호 변경 모달 열기")}
      />

      <section className={S["settings-section-buttons"]}>
        <h2 className={S["section-title"]}>탈퇴하기</h2>
        <button
          className={`${S["action-button"]} ${S["danger"]}`}
          onClick={() => setShowDeleteModal(true)}
        >
          계정 탈퇴하기
        </button>
      </section>

      {showDeleteModal && (
        <DeleteAccountModal onClose={() => setShowDeleteModal(false)} user={user} />
      )}
    </div>
  );
}

export default SystemSettings;
