// utils/createNotifications.ts
import { supabase } from "../supabase/supabase";

export type NotificationType = "comment" | "like_review" | "like_quote";

export async function createNotification({
  userId,
  senderId,
  type,
  targetId,
}: {
  userId: string;
  senderId: string;
  type: NotificationType;
  targetId: number;
}) {
  // 1. 유저 알림 설정 가져오기
  const { data: settings, error: settingError } = await supabase
    .from("notification_settings")
    .select("comment, like_review, like_quote")
    .eq("user_id", userId)
    .maybeSingle();

  if (settingError) {
    console.error("알림 설정 불러오기 실패:", settingError.message);
    return;
  }

  // 2. row 없으면 차단, row 있어도 값이 false면 차단
  const allowComment = settings?.comment === true;
  const allowLikeReview = settings?.like_review === true;
  const allowLikeQuote = settings?.like_quote === true;

  // 3. 차단 여부 검사
  if (
    (type === "comment" && !allowComment) ||
    (type === "like_review" && !allowLikeReview) ||
    (type === "like_quote" && !allowLikeQuote)
  ) {
    console.log(`알림 차단됨 → type: ${type}, userId: ${userId}`);
    return;
  }

  // 4. 알림 메시지
  const messages: Record<NotificationType, string> = {
    comment: "님이 회원님의 리뷰에 댓글을 남겼습니다.",
    like_review: "님이 회원님의 리뷰를 좋아합니다.",
    like_quote: "님이 회원님의 명대사를 좋아합니다.",
  };

  // 5. 알림 저장
  const { error } = await supabase.from("notifications").insert([
    {
      user_id: userId,
      sender_id: senderId,
      type,
      target_id: targetId,
      message: messages[type],
    },
  ]);

  if (error) {
    console.error("알림 생성 실패:", error.message);
  }
}
