import { useEffect, useState } from "react";
import S from "./ProfileBox.module.css";
import { supabase } from "../../supabase/supabase";
import notificationIcon from "../../assets/icons/notification.svg";
import settingsIcon from "../../assets/icons/settings.svg";

type ProfileType = {
  user_id: string;
  nickname: string | null;
  bio: string | null;
  url: string | null;
  avatar_url: string | null;
};

interface Props {
  user: { id: string } | null;
  profile: ProfileType | null;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
}

function ProfileBox({ user, profile, setActiveTab }: Props) {
  const [reviewCount, setReviewCount] = useState(0);
  const [quoteCount, setQuoteCount] = useState(0);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    if (!user) return;

    const fetchCounts = async () => {
      const { count: reviewsCount } = await supabase
        .from("review")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);

      const { count: quotesCount } = await supabase
        .from("quotes")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);

      const { count: reviewLikes } = await supabase
        .from("review_like")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);

      const { count: quoteLikes } = await supabase
        .from("quotes_like")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);

      const { count: movieLikes } = await supabase
        .from("favorite_movies")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);

      setReviewCount(reviewsCount ?? 0);
      setQuoteCount(quotesCount ?? 0);
      setLikeCount((reviewLikes ?? 0) + (quoteLikes ?? 0) + (movieLikes ?? 0));
    };

    fetchCounts();
  }, [user]);

  return (
    <div className={S.profileBox}>
      {/* 상단 아이콘 */}
      <button className={S.notificationButton} onClick={() => setActiveTab("notifications")}>
        <img src={notificationIcon} alt="notifications" />
      </button>
      <button 
      className={S.settingButton} 
      onClick={() => setActiveTab("settings")}
      >
        <img src={settingsIcon} alt="settings" />
      </button>

      {/* 프로필 정보 */}
      <img src={profile?.avatar_url || ""} alt="profile" className={S.profileImg} />
      <h3>{profile?.nickname || "Guest"}</h3>
      <p>{profile?.bio || ""}</p>
      <a className={S.url} href={profile?.url || ""}>{profile?.url}</a>

      {/* 구분선 */}
      <hr className={S.divider} />

      {/* 통계 */}
      <div className={S.statsBox}>
        <div>
          <p>{reviewCount}</p>
          <span>Reviews</span>
        </div>
        <div>
          <p>{likeCount}</p>
          <span>Likes</span>
        </div>
        <div>
          <p>{quoteCount}</p>
          <span>Quotes</span>
        </div>
      </div>
    </div>
  );
}

export default ProfileBox;
