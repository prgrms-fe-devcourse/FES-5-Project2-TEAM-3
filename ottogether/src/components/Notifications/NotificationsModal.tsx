import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabase/supabase";
import type { Tables } from "../../supabase/supabase.type";
import S from "./NotificationsModal.module.css";

type ProfileType = Tables<"profile">;
type UserType = { id: string; email?: string };

type NotificationRow = Tables<"notifications"> & {
  sender?: {
    nickname: string | null;
    avatar_url: string | null;
  };
};

interface Props {
  user: UserType | null;
  profile: ProfileType | null;
  onClose: () => void;
}

function NotificationsModal({ user, onClose }: Props) {
  const [activeTab, setActiveTab] = useState<"all" | "likes" | "comments" | "unread">("all");
  const [allNotifications, setAllNotifications] = useState<NotificationRow[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    const fetchNotifications = async () => {
      const { data } = await supabase
        .from("notifications")
        .select(`
          id,
          user_id,
          sender_id,
          type,
          target_id,
          message,
          is_read,
          created_at,
          sender:profile!notifications_sender_id_fkey (
            nickname,
            avatar_url
          )
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (data) setAllNotifications(data);
    };

    fetchNotifications();
  }, [user]);

  // 전체 알림 기준 탭 카운트
  const counts = {
    all: allNotifications.length,
    likes: allNotifications.filter((n) => n.type === "like_review" || n.type === "like_quote").length,
    comments: allNotifications.filter((n) => n.type === "comment").length,
    unread: allNotifications.filter((n) => !n.is_read).length,
  };

  // 탭에 맞는 알림 + 7개 제한
  const filtered = allNotifications
    .filter((n) => {
      if (activeTab === "likes") return n.type === "like_review" || n.type === "like_quote";
      if (activeTab === "comments") return n.type === "comment";
      if (activeTab === "unread") return !n.is_read;
      return true;
    })
    .slice(0, 7);

  const handleClick = async (noti: NotificationRow) => {
    if (!noti.is_read) {
      await supabase.from("notifications").update({ is_read: true }).eq("id", noti.id);
      setAllNotifications((prev) =>
        prev.map((n) => (n.id === noti.id ? { ...n, is_read: true } : n))
      );
    }

    if (noti.type === "comment" || noti.type === "like_review") {
      navigate("/review", { state: { highlightId: Number(noti.target_id) } });
      onClose();
    } else if (noti.type === "like_quote") {
      navigate("/quotes", { state: { highlightId: Number(noti.target_id) } });
      onClose();
    }
  };

  if (!user) return <div className={S["empty"]}>로그인이 필요합니다.</div>;

  return (
    <div className={S["modal-content"]}>
      <div className={S["modal-header"]}>
        <h3>최근 알림</h3>
        <button
          className={S["view-all"]}
          onClick={() => {
            onClose();
            navigate("/my-page", { state: { activeTab: "notifications" } });
          }}
        >
          View All
        </button>
      </div>

      <div className={S["tabs"]}>
        <button
          className={`${S["tab"]} ${activeTab === "all" ? S["active"] : ""}`}
          onClick={() => setActiveTab("all")}
        >
          All <span>{counts.all}</span>
        </button>
        <button
          className={`${S["tab"]} ${activeTab === "likes" ? S["active"] : ""}`}
          onClick={() => setActiveTab("likes")}
        >
          Likes <span>{counts.likes}</span>
        </button>
        <button
          className={`${S["tab"]} ${activeTab === "comments" ? S["active"] : ""}`}
          onClick={() => setActiveTab("comments")}
        >
          Comments <span>{counts.comments}</span>
        </button>
        <button
          className={`${S["tab"]} ${activeTab === "unread" ? S["active"] : ""}`}
          onClick={() => setActiveTab("unread")}
        >
          Unread <span>{counts.unread}</span>
        </button>
      </div>

      <ul className={S["list"]}>
        {filtered.length > 0 ? (
          filtered.map((n) => (
            <li
              key={n.id}
              className={`${S["item"]} ${n.is_read ? S["read"] : S["unread"]}`}
              onClick={() => handleClick(n)}
            >
              <div className={S["avatar"]}>
                {n.sender?.avatar_url ? (
                  <img src={n.sender.avatar_url} alt={n.sender.nickname ?? "user"} />
                ) : (
                  <div className={S["avatar-fallback"]}>
                    {n.sender?.nickname?.charAt(0).toUpperCase() ?? "?"}
                  </div>
                )}
              </div>
              <div className={S["content"]}>
                <p>
                  <strong>{n.sender?.nickname ?? "Guest"}</strong> {n.message}
                </p>
              </div>
              <div className={S["meta"]}>
                {new Date(n.created_at).toLocaleDateString()}{" "}
                {new Date(n.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </div>
            </li>
          ))
        ) : (
          <li className={S["empty"]}>알림이 없습니다.</li>
        )}
      </ul>
    </div>
  );
}

export default NotificationsModal;