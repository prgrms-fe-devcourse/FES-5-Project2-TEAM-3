
import S from "./SystemSettings.module.css"

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
    <div>SystemSettings 준비중..</div>
  )
}
export default SystemSettings