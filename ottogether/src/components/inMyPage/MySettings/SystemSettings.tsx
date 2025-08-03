import { useState } from "react";
import DeleteAccountModal from "./DeleteAccountModal";
import PasswordModal from "./PasswordModal";
import S from "./SystemSettings.module.css";
import NotificationSection from "./NotificationSection";

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
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  return (
    <div className={S["settings-container"]}>
      <NotificationSection user={user} profile={profile} />

      <section className={S["settings-section-buttons"]}>
        <h2 className={S["section-title"]}>비밀번호 변경</h2>
        <button
          className={S["action-button"]}
          onClick={() => setShowPasswordModal(true)}
        >
          비밀번호 변경하기
        </button>
      </section>

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

      {showPasswordModal && (
        <PasswordModal 
          onClose={() => setShowPasswordModal(false)} 
          userEmail={user?.email}
        />
      )}
    </div>
  );
}

export default SystemSettings;
