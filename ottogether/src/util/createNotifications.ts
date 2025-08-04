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
  const messages: Record<NotificationType, string> = {
    comment: "님이 회원님의 리뷰에 댓글을 남겼습니다.",
    like_review: "님이 회원님의 리뷰를 좋아합니다.",
    like_quote: "님이 회원님의 명대사를 좋아합니다.",
  };

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
