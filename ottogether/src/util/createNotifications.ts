import { supabase } from "../supabase/supabase";

type NotificationType = "comment" | "like_review" | "like_quote";

export async function createNotification({
  userId,    // 알림 받을 사람
  senderId,  // 알림 보낸 사람
  type,
  targetId,
  message,
}: {
  userId: string;
  senderId: string;
  type: NotificationType;
  targetId: string;
  message: string;
}) {
  const { error } = await supabase.from("notifications").insert({
    user_id: userId,
    sender_id: senderId,
    type,
    target_id: targetId,
    message,
  });

  if (error) {
    console.error("알림 생성 실패:", error.message);
    throw error;
  }
}