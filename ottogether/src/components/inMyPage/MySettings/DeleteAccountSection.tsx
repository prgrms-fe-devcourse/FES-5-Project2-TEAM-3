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
  onOpenModal: () => void;
}

function DeleteAccountSection({ user, profile, onOpenModal }: Props) {
  return (
    <section className={S["settings-section"]}>
      <h2 
      className={S["section-title"]} 
      onClick={onOpenModal}
      >탈퇴하기</h2>
    </section>
  );
}

export default DeleteAccountSection;
