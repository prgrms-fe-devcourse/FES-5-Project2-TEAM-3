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

function NotificationSection({ user, profile }: Props) {
  const [all, setAll] = useState(false);
  const [reviews, setReviews] = useState(false);
  const [quotes, setQuotes] = useState(false);

  const handleAllToggle = () => {
    const newState = !all;
    setAll(newState);
    setReviews(newState);
    setQuotes(newState);
  };

  const handleReviewsToggle = () => {
    const newState = !reviews;
    setReviews(newState);
    if (!newState) setAll(false);
  };

  const handleQuotesToggle = () => {
    const newState = !quotes;
    setQuotes(newState);
    if (!newState) setAll(false);
  };

  return (
    <section className={S["settings-section"]}>
      <h2 className={S["section-title"]}>알림 설정</h2>
      <ToggleSwitch label="전체 알림" checked={all} onChange={handleAllToggle} />
      <ToggleSwitch label="나의 리뷰" checked={reviews} onChange={handleReviewsToggle} />
      <ToggleSwitch label="나의 명대사" checked={quotes} onChange={handleQuotesToggle} />
    </section>
  );
}

export default NotificationSection;
