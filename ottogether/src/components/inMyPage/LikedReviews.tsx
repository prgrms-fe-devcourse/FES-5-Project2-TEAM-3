import { useEffect, useState } from "react";
import { supabase } from "../../supabase/supabase";
import type { Tables } from "../../supabase/supabase.type";
import ReviewCard from "../reviewCard/ReviewCard";
import { useNavigate } from "react-router-dom";
import S from "./MyPageReviews.module.css";

type Review = Tables<"review">;
type Profile = Tables<"profile">;

interface Props {
  user: { id: string; email?: string } | null;
  profile: Profile | null;
}

function LikedReviews({ user, profile }: Props) {
  const navigate = useNavigate();

  const [reviews, setReviews] = useState<Review[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchLikedReviews = async () => {
      try {

        const { data: likedRows, error: likeError } = await supabase
          .from("review_like")
          .select("review_id")
          .eq("user_id", user.id)
          .eq("reaction_type", "like");

        if (likeError) throw likeError;

        const reviewIds = (likedRows ?? [])
          .map((row) => row.review_id)
          .filter((id): id is number => id !== null);

        if (reviewIds.length === 0) {
          setReviews([]);
          return;
        }

        const { data: likedReviews, error: reviewError } = await supabase
          .from("review")
          .select("*")
          .in("id", reviewIds)
          .order("updated_at", { ascending: false });

        if (reviewError) throw reviewError;

        const userIds = (likedReviews ?? [])
          .map((r) => r.user_id)
          .filter((id): id is string => id !== null);

        const { data: profilesData, error: profileError } = await supabase
          .from("profile")
          .select("*")
          .in("user_id", userIds);

        if (profileError) throw profileError;

        setReviews(likedReviews ?? []);
        setProfiles(profilesData ?? []);
      } catch (error) {
        console.error("좋아요한 리뷰 불러오기 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLikedReviews();
  }, [user]);

  if (!user) {
    return <p className={S["my-notice"]}>로그인이 필요한 서비스입니다.</p>;
  }

  if (loading) {
    return <p className={S["my-notice"]}>불러오는 중...</p>;
  }

  if (reviews.length === 0) {
    return <p className={S["my-notice"]}>좋아요한 리뷰가 없습니다.</p>;
  }

  return (
    <div className={S["my-container"]}>
      <h1 className={S["my-title"]}>
        {profile?.nickname ?? "Guest"} 님이 좋아요한 리뷰 (총 {reviews.length}개)
      </h1>
      <hr />
      {reviews.map((review) => {
        const profileData = profiles.find((p) => p.user_id === review.user_id);
        return (
          <div
            key={review.id}
            className={S["my-liked-review-wrapper"]}
            onClick={() => navigate("/review", { state: { highlightId: review.id } })}
          >
            <ReviewCard
              reviewData={review}
              profileData={profileData}
              activePopUp={(id) => navigate("/review", { state: { highlightId: id } })}
            />
          </div>
        );
      })}
    </div>
  );
}

export default LikedReviews;
