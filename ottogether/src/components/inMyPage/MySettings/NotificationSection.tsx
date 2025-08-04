import { useState, useEffect } from "react";
import { supabase } from "../../../supabase/supabase"; 
import S from "./SystemSettings.module.css";
import ToggleSwitch from "./ToggleSwitch";

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

function NotificationSection({ user }: Props) {
  const [comments, setComments] = useState(false);
  const [likes, setLikes] = useState(false);

  // 사용자 설정 불러오기
  useEffect(() => {
    if (!user) return;

    const fetchSettings = async () => {
      const { data, error } = await supabase
        .from("notification_settings")
        .select("comment, like_review, like_quote")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) {
        console.error("알림 설정 불러오기 실패:", error.message);
        return;
      }

      if (data) {
        setComments(!!data.comment);
        setLikes(!!data.like_review || !!data.like_quote);
      }
    };

    fetchSettings();
  }, [user]);

  // 댓글 토글
  const handleCommentsToggle = async () => {
    const newState = !comments;
    setComments(newState);

    if (user) {
      const { error } = await supabase.from("notification_settings").upsert({
        user_id: user.id,
        comment: newState,
        updated_at: new Date().toISOString(),
      });

      if (error) console.error("댓글 알림 업데이트 실패:", error.message);
    }
  };

  // 좋아요 토글
  const handleLikesToggle = async () => {
    const newState = !likes;
    setLikes(newState);

    if (user) {
      const { error } = await supabase.from("notification_settings").upsert({
        user_id: user.id,
        like_review: newState,
        like_quote: newState,
        updated_at: new Date().toISOString(),
      });

      if (error) console.error("좋아요 알림 업데이트 실패:", error.message);
    }
  };

  return (
    <section className={S["settings-section"]}>
      <h2 className={S["section-title"]}>알림 설정</h2>
      <ToggleSwitch label="댓글 알림" checked={comments} onChange={handleCommentsToggle} />
      <ToggleSwitch label="좋아요 알림" checked={likes} onChange={handleLikesToggle} />
    </section>
  );
}

export default NotificationSection;
