// utils/createNotification.ts
import { supabase } from "../supabase/supabase";

export type NotificationType = "comment" | "like_review" | "like_quote";

export async function createNotification({
  userId,
  senderId,
  type,
  targetId,
  message,
}: {
  userId: string;
  senderId: string;
  type: NotificationType;
  targetId: number;
  message: string;
}) {
  const { error } = await supabase.from("notifications").insert([
    {
      user_id: userId,
      sender_id: senderId,
      type,
      target_id: targetId,
      message,
    },
  ]);

  if (error) {
    console.error("알림 생성 실패:", error.message);
  }
}
