import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import S from "./MyPage.module.css";
import { supabase } from "../../supabase/supabase";
import CreatedReviews from "../../components/inMyPage/CreatedReviews";
import CreatedQuotes from "../../components/inMyPage/CreatedQuotes";
import LikedVideoContents from "../../components/inMyPage/LikedVideoContents";
import LikedReviews from "../../components/inMyPage/LikedReviews";
import LikedQuotes from "../../components/inMyPage/LikedQuotes";
import { useAuth } from "../../contexts/AuthProvider";
import Settings from "../../components/inMyPage/MySettings/Settings";
import ProfileBox from "../../components/inMyPage/ProfileBox";
import type { Tables } from "../../supabase/supabase.type";
import Notifications from "../../components/Notifications/Notifications";

type UserType = {
  id: string;
  email?: string;
};

type ProfileType = Tables<"profile">;

function CreatedContents({ user, profile }: { user: UserType; profile: ProfileType | null }) {
  return (
    <>
      <CreatedReviews user={user} profile={profile} />
      <br />
      <CreatedQuotes user={user} profile={profile} />
    </>
  );
}

function LikedContents({ user, profile }: { user: UserType; profile: ProfileType | null }) {
  return (
    <>
      <LikedVideoContents user={user} profile={profile} />
      <br />
      <LikedReviews user={user} profile={profile} />
      <br />
      <LikedQuotes user={user} />
    </>
  );
}

function AllContents({ user, profile }: { user: UserType; profile: ProfileType | null }) {
  return (
    <>
      <CreatedContents user={user} profile={profile} />
      <br />
      <LikedContents user={user} profile={profile} />
    </>
  );
}

function MyPage() {
  const { user } = useAuth();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("");
  const [profile, setProfile] = useState<ProfileType | null>(null);

   useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location.state]);

  useEffect(() => {
    if (!user) return;

    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from("profile")
        .select(
          "user_id, nickname, bio, url, header_url, avatar_url, preferred_ott, favorite_genre"
        )
        .eq("user_id", user.id)
        .single();

      if (error) {
        console.error("프로필 불러오기 오류:", error.message);
      } else {
        setProfile(data as ProfileType);
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
        return <CreatedContents user={user} profile={profile} />;
      case "createdReviews":
        return <CreatedReviews user={user} profile={profile} />;
      case "createdQuotes":
        return <CreatedQuotes user={user} profile={profile} />;
      case "likedContents":
        return <LikedContents user={user} profile={profile} />;
      case "likedVideoContents":
        return <LikedVideoContents user={user} profile={profile} />;
      case "likedReviews":
        return <LikedReviews user={user} profile={profile} />;
      case "likedQuotes":
        return <LikedQuotes user={user} />;
      case "notifications":
        return <Notifications user={user} profile={profile} />;
      case "settings":
        return <Settings user={user} profile={profile} />;
      default:
        return <AllContents user={user} profile={profile} />;
    }
  };

  return (
    <div className={S.page}>
      <div
        className={S.banner}
        onClick={() => setActiveTab("")}
        style={{ cursor: "pointer" }}
      >
        <img
          src={profile?.header_url ?? "/default-header3.png"}
          alt="banner"
          className={S["banner-img"]}
        />
      </div>

      <div className={S.container}>
        <aside className={S.sidebar}>
          <ProfileBox user={user} profile={profile} setActiveTab={setActiveTab} />

          <nav className={S["nav-menu"]}>
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

        <main className={S["main-content"]}>{renderContent()}</main>
      </div>
    </div>
  );
}

export default MyPage;
