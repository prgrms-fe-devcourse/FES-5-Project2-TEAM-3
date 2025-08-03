import { useEffect, useState } from "react";
import { supabase } from "../../supabase/supabase";
import type { Tables } from "../../supabase/supabase.type";
import ReviewCard from "../reviewCard/ReviewCard";
import { useAuth } from "../../contexts/AuthProvider";
import { useNavigate } from "react-router-dom";
import S from "./MyPageReviews.module.css"; // Quotes CSS 재활용

type Review = Tables<"review">;
type Profile = Tables<"profile">;

// 날짜 포맷 함수
function formatDate(dateString: string | null): string {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

function CreatedReviews() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  // 로그인한 유저의 프로필
  const myProfile = profiles.find((p) => p.user_id === user?.id);

  useEffect(() => {
    if (!user) return;

    const fetchMyReviews = async () => {
      try {
        const { data: myReviews, error: reviewError } = await supabase
          .from("review")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (reviewError) throw reviewError;

        const userIds = myReviews?.map((r) => r.user_id) ?? [];
        const { data: profilesData, error: profileError } = await supabase
          .from("profile")
          .select("*")
          .in("user_id", userIds);

        if (profileError) throw profileError;

        setReviews(myReviews ?? []);
        setProfiles(profilesData ?? []);
      } catch (error) {
        console.error("내가 작성한 리뷰 불러오기 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyReviews();
  }, [user]);

  if (!user) return <p className={S["my-notice"]}>로그인이 필요합니다.</p>;
  if (loading) return <p className={S["my-notice"]}>불러오는 중...</p>;
  if (reviews.length === 0)
    return <p className={S["my-notice"]}>작성한 리뷰가 없습니다.</p>;

  const reviewsWithFlags = reviews.map((review, idx) => {
    const currentDate = formatDate(review.created_at);
    const prevDate =
      idx > 0 ? formatDate(reviews[idx - 1].created_at) : null;
    return {
      ...review,
      showDate: currentDate !== prevDate,
      currentDate,
    };
  });

  return (
    <div className={S["my-container"]}>
      <h1 className={S["my-title"]}>
        {myProfile?.nickname ?? "Guest"} 님이 작성한 리뷰
        <hr />
      </h1>
      {reviewsWithFlags.map((review) => {
        const profileData = profiles.find((p) => p.user_id === review.user_id);
        return (
          <div
            key={review.id}
            className={`${S["my-review-wrapper"]} ${
              review.showDate ? S["my-new-date-group"] : S["my-same-date-group"]
            }`}
          >
            {review.showDate && (
              <p className={S["my-date"]}>{review.currentDate}</p>
            )}
            <ReviewCard
              reviewData={review}
              profileData={profileData}
              activePopUp={(id) => navigate(`/reviews/${id}`)}
            />
          </div>
        );
      })}
    </div>
  );
}

export default CreatedReviews;