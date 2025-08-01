import { useState } from "react";
import S from "./SystemSettings.module.css";
import ToggleSwitch from "./ToggoleSwitch";

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

function VisibilitySection({ user, profile }: Props) {
  const [all, setAll] = useState(false);
  const [myPosts, setMyPosts] = useState(false);
  const [myLikes, setMyLikes] = useState(false);

  const handleAllToggle = () => {
    const newState = !all;
    setAll(newState);
    setMyPosts(newState);
    setMyLikes(newState);
  };

  const handleMyPostsToggle = () => {
    const newState = !myPosts;
    setMyPosts(newState);
    if (!newState) setAll(false);
  };

  const handleMyLikesToggle = () => {
    const newState = !myLikes;
    setMyLikes(newState);
    if (!newState) setAll(false);
  };

  return (
    <section className={S["settings-section"]}>
      <h2 className={S["section-title"]}>공개 설정</h2>
      <ToggleSwitch label="전체 컨텐츠" checked={all} onChange={handleAllToggle} />
      <ToggleSwitch label="내가 작성한 컨텐츠" checked={myPosts} onChange={handleMyPostsToggle} />
      <ToggleSwitch label="내가 좋아요 한 컨텐츠" checked={myLikes} onChange={handleMyLikesToggle} />
    </section>
  );
}

export default VisibilitySection;
