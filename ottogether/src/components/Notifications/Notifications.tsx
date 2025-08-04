import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabase/supabase";
import type { Tables } from "../../supabase/supabase.type"; 
import S from "./Notifications.module.css";

type ProfileType = Tables<"profile">;
type UserType = { id: string; email?: string };

type NotificationRow = Tables<"notifications"> & {
  sender?: {
    nickname: string | null;
    avatar_url: string | null;
  };
};

interface Props {
  user: UserType;
  profile: ProfileType | null;
}

function Notifications({ user, profile }: Props) {
  const [activeTab, setActiveTab] = useState<"all" | "likes" | "comments" | "unread">("all");
  const [notifications, setNotifications] = useState<NotificationRow[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    const fetchNotifications = async () => {
      setLoading(true);

      const { data, error } = await supabase
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

      if (!error) {
        setNotifications(data || []);
      }

      setLoading(false);
    };

    fetchNotifications();
  }, [user]);

  const filtered = notifications.filter((n) => {
    if (activeTab === "likes") return n.type === "like_review" || n.type === "like_quote";
    if (activeTab === "comments") return n.type === "comment";
    if (activeTab === "unread") return !n.is_read;
    return true;
  });

  const handleClick = async (noti: NotificationRow) => {
    if (!noti.is_read) {
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("id", noti.id);

      if (!error) {
        setNotifications((prev) =>
          prev.map((n) => (n.id === noti.id ? { ...n, is_read: true } : n))
        );
      }
    }

    if (noti.type === "comment" || noti.type === "like_review") {
      navigate("/review", { state: { highlightId: Number(noti.target_id) } });
    } else if (noti.type === "like_quote") {
      navigate("/quotes", { state: { highlightId: Number(noti.target_id) } });
    }
  };

  if (!user) return <div>로그인이 필요합니다.</div>;
  if (loading) return <div>알림을 불러오는 중...</div>;

  return (
    <div className={S.container}>
      <div className={S.header}>
        <h1>{profile?.nickname ?? "Guest"} 님의 Notifications</h1>
      </div>

      <div className={S.tabs}>
        <button
          className={`${S.tab} ${activeTab === "all" ? S.active : ""}`}
          onClick={() => setActiveTab("all")}
        >
          All <span>{notifications.length}</span>
        </button>
        <button
          className={`${S.tab} ${activeTab === "likes" ? S.active : ""}`}
          onClick={() => setActiveTab("likes")}
        >
          Likes{" "}
          <span>
            {notifications.filter((n) => n.type === "like_review" || n.type === "like_quote").length}
          </span>
        </button>
        <button
          className={`${S.tab} ${activeTab === "comments" ? S.active : ""}`}
          onClick={() => setActiveTab("comments")}
        >
          Comments <span>{notifications.filter((n) => n.type === "comment").length}</span>
        </button>
        <button
          className={`${S.tab} ${activeTab === "unread" ? S.active : ""}`}
          onClick={() => setActiveTab("unread")}
        >
          Unread <span>{notifications.filter((n) => !n.is_read).length}</span>
        </button>
      </div>

      <ul className={S.list}>
        {filtered.length > 0 ? (
          filtered.map((n) => (
            <li
              key={n.id}
              className={`${S.item} ${n.is_read ? S.read : S.unread}`}
              onClick={() => handleClick(n)}
              role="button"
              tabIndex={0}
            >
              <div className={S.avatar}>
                {n.sender?.avatar_url ? (
                  <img src={n.sender.avatar_url} alt={n.sender.nickname ?? "user"} />
                ) : (
                  <div className={S.avatarFallback}>
                    {n.sender?.nickname?.charAt(0).toUpperCase() ?? "?"}
                  </div>
                )}
              </div>
              <div className={S.content}>
                <p>
                  <strong>{n.sender?.nickname ?? "Guest"}</strong> {n.message}
                </p>
              </div>
              <div className={S.meta}>
                {new Date(n.created_at).toLocaleDateString()}{" "}
                {new Date(n.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </div>
            </li>
          ))
        ) : (
          <li className={S.empty}>알림이 없습니다.</li>
        )}
      </ul>
    </div>
  );
}

export default Notifications;
