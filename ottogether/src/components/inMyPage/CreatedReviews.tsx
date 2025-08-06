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

// 날짜 포맷 함수
function formatDate(dateString: string | null): string {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

function CreatedReviews({ user, profile }: Props) {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasNavigated, setHasNavigated] = useState(false);

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

  if (loading) return <p className={S["my-notice"]}>불러오는 중...</p>;
  if (reviews.length === 0)
    return (
      <div className={S["my-container"]}>
        <h1 className={S["my-title"]}>
          {profile?.nickname ?? "Guest"} 님이 작성한 리뷰
          <hr />
        </h1>
        <p className={S["my-notice"]}>작성한 리뷰가 없습니다.</p>
      </div>
    );

  // 날짜 그룹 표시 여부 계산
  const reviewsWithFlags = reviews.map((review, idx) => {
    const currentDate = formatDate(review.created_at);
    const prevDate = idx > 0 ? formatDate(reviews[idx - 1].created_at) : null;
    return {
      ...review,
      showDate: currentDate !== prevDate,
      currentDate,
    };
  });

  return (
    <div className={S["my-container"]}>
      <h1 className={S["my-title"]}>
        {profile?.nickname ?? "Guest"} 님이 작성한 리뷰
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
              <div className={S["date-block"]}>
                <p className={S["my-date"]}>{review.currentDate}</p>
              </div>
            )}
            <ReviewCard
              reviewData={review}
              commentCount={review.comment_count ?? 0}
              profileData={profileData}
              activePopUp={
                hasNavigated
                  ? () => {}
                  : (id) => {
                      setHasNavigated(true);
                      navigate(`/media/${review.media_type}/${review.movie_id}/review`, {
                        state: { highlightId: id },
                      });
                    }
              }
              onDataUpdate={() => {}}
            />
          </div>
        );
      })}
    </div>
  );
}

export default CreatedReviews;
