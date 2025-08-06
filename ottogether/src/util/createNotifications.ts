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
  const { data: settings, error: settingError } = await supabase
    .from("notification_settings")
    .select("comment, like_review, like_quote")
    .eq("user_id", userId)
    .maybeSingle();

  if (settingError) return;

  const allowComment = settings?.comment === true;
  const allowLikes = (settings?.like_review === true) || (settings?.like_quote === true);

  if (
    (type === "comment" && !allowComment) ||
    ((type === "like_review" || type === "like_quote") && !allowLikes)
  ) {
    return;
  }

  const messages: Record<NotificationType, string> = {
    comment: "님이 회원님의 리뷰에 댓글을 남겼습니다.",
    like_review: "님이 회원님의 리뷰를 좋아합니다.",
    like_quote: "님이 회원님의 명대사를 좋아합니다.",
  };

  await supabase.from("notifications").insert([{
    user_id: userId,
    sender_id: senderId,
    type,
    target_id: targetId,
    message: messages[type],
  }]);
}
