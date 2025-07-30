import { useEffect, useState } from "react";
import S from "./MyPage.module.css";
import Settings from "./Settings";
import CreatedQuotes from "./CreatedQuotes";
import CreatedReviews from "./CreatedReviews";
import LikedReviews from "./LikedReviews";
import LikedQuotes from "./LikedQuotes";
import LikedVideoContents from "./LikedVideoContents";
import { supabase } from "../../supabase/supabase";

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
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [activeTab, setActiveTab] = useState("settings");

  useEffect(() => {
    const fetchProfile = async () => {
      // 1. 현재 로그인한 유저 확인
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        console.error("로그인한 유저가 없습니다.", userError);
        return;
      }

      // 2. profile 테이블에서 user.id와 같은 row 가져오기
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
  }, []);




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
      case "settings":
        return <Settings />;
      default:
        return <div>카테고리를 선택해주세요.</div>;
    }
  };

  return (

    <div className={S.page}>
      {/* 배너 영역 */}
      <div className={S.banner}>
        <img
          src={profile?.header_url || "/beomTeacher.svg"}
          alt="banner"
          className={S.bannerImg}
        />
      </div>

      {/* 컨텐츠 영역 */}
      <div className={S.container}>
        {/* 왼쪽 사이드바 */}
        <aside className={S.sidebar}>
          <div className={S.profileBox}>
            <img
              src={profile?.avatar_url || "/beomTeacher.svg"}
              alt="profile"
              className={S.profileImg}
            />
            <h3>{profile?.nickname || "Guest"}</h3>
            <p>{profile?.bio || ""}</p>
            <p className={S.url}>{profile?.url || ""}</p>
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

            <h4
              className={activeTab === "settings" ? S.active : ""}
              onClick={() => setActiveTab("settings")}
            >
              Account
            </h4>
          </nav>
        </aside>

        {/* 오른쪽 메인 블록 */}
        <main className={S.mainContent}>{renderContent()}</main>
      </div>
    </div>
  );
}

export default MyPage;
