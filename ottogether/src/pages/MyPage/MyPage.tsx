import { useEffect, useState } from "react";
import S from "./MyPage.module.css";
import { supabase } from "../../supabase/supabase";
import CreatedReviews from "../../components/inMyPage/CreatedReviews";
import CreatedQuotes from "../../components/inMyPage/CreatedQuotes";
import LikedVideoContents from "../../components/inMyPage/LikedVideoContents";
import LikedReviews from "../../components/inMyPage/LikedReviews";
import LikedQuotes from "../../components/inMyPage/LikedQuotes";
import { useAuth } from "../../contexts/AuthProvider";
import notificationIcon from "../../assets/icons/notification.svg"
import settingsIcon from "../../assets/icons/settings.svg"

type ProfileType = {
  user_id: string;
  nickname: string | null;
  bio: string | null;
  url: string | null;
  header_url: string | null;
  avatar_url: string | null;
  preferred_ott: string[] | null;
  favorite_genre: string[] | null;
};


function CreatedContents() {
  return (
    <>
    <CreatedReviews/>
    <CreatedQuotes/>
    </>
  )
}
function LikedContents() {
  return (
    <>
    <LikedVideoContents/>
    <LikedReviews/>
    <LikedQuotes/>
    </>
  )
}

function MyPage() {
  const [activeTab, setActiveTab] = useState("settings");
  const { user } = useAuth();
  const [profile, setProfile] = useState<ProfileType | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from("profile")
        .select("user_id, nickname, bio, url, header_url, avatar_url, preferred_ott, favorite_genre")
        .eq("user_id", user.id)
        .single();

      if (error) {
        console.error("프로필 불러오기 오류:", error.message);
      } else {
        setProfile(data);
      }
    };

    fetchProfile();
  }, [user]);

  if (!user) {
    return <div>로그인이 필요합니다.</div>;
  }


  const renderContent = () => {
    switch (activeTab) {
      case "createdContents":
        return <CreatedContents />;
      case "createdReviews":
        return <CreatedReviews />;
      case "createdQuotes":
        return <CreatedQuotes />;
      case "likedContents":
        return <LikedContents />;
      case "likedVideoContents":
        return <LikedVideoContents />;
      case "likedReviews":
        return <LikedReviews />;
      case "likedQuotes":
        return <LikedQuotes />;
      default:
        return <div>카테고리를 선택해주세요.</div>;
    }
  };

  return (

    <div className={S.page}>
      {/* 배너 영역 */}
      <div className={S.banner}>
        <img
          src={profile?.header_url || ""}
          alt="banner"
          className={S.bannerImg}
        />
      </div>

      {/* 컨텐츠 영역 */}
      <div className={S.container}>
        {/* 왼쪽 사이드바 */}
        <aside className={S.sidebar}>
          <div className={S.profileBox}>
            <button className={S.notificationButton}>
              <img src={notificationIcon} alt="notifications" />
            </button>
            <button className={S.settingButton}>
              <img src={settingsIcon} alt="settings" />
            </button>
            <img
              src={profile?.avatar_url || ''}
              alt="profile"
              className={S.profileImg}
            />
            <h3>{profile?.nickname || "Guest"}</h3>
            <p>{profile?.bio || ""}</p>
            <a className={S.url} href={profile?.url || ""}></a>
          </div>

          <nav className={S.navMenu}>
            <h4
              className={activeTab === "createdContents" ? S.active : ""}
              onClick={() => setActiveTab("createdContents")}
            >
              Created Contents
            </h4>
            <ul>
              <li
                className={activeTab === "createdReviews" ? S.active : ""}
                onClick={() => setActiveTab("createdReviews")}
              >
                - Reviews
              </li>
              <li
                className={activeTab === "createdQuotes" ? S.active : ""}
                onClick={() => setActiveTab("createdQuotes")}
              >
                - Quotes
              </li>
            </ul>

            <h4
              className={activeTab === "likedContents" ? S.active : ""}
              onClick={() => setActiveTab("likedContents")}
            >
              Liked Contents
            </h4>
            <ul>
              <li
                className={activeTab === "likedVideoContents" ? S.active : ""}
                onClick={() => setActiveTab("likedVideoContents")}
              >
                - Video Contents
              </li>
              <li
                className={activeTab === "likedReviews" ? S.active : ""}
                onClick={() => setActiveTab("likedReviews")}
              >
                - Reviews
              </li>
              <li
                className={activeTab === "likedQuotes" ? S.active : ""}
                onClick={() => setActiveTab("likedQuotes")}
              >
                - Quotes
              </li>
            </ul>
          </nav>

        </aside>

        {/* 오른쪽 메인 블록 */}
        <main className={S.mainContent}>{renderContent()}</main>
      </div>
    </div>
  );
}

export default MyPage;
