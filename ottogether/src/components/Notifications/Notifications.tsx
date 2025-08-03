import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabase/supabase";
import { useAuth } from "../../contexts/AuthProvider";
import S from "./Notifications.module.css";

type Notification = {
  id: string;
  user_id: string;
  sender_id: string;
  type: "comment" | "like_review" | "like_quote";
  target_id: string;
  message: string;
  is_read: boolean;
  created_at: string;
  sender?: {
    nickname: string | null;
    avatar_url: string | null;
  };
};

function Notifications() {
  const [activeTab, setActiveTab] = useState<"all" | "likes" | "comments" | "unread">("all");
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
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

      if (error) {
        console.error("알림 불러오기 오류:", error.message);
      } else {
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

  const handleClick = async (noti: Notification) => {
    // 클릭 시 읽음 처리
    if (!noti.is_read) {
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("id", noti.id);

      if (error) {
        console.error("읽음 처리 실패:", error.message);
      } else {
        setNotifications((prev) =>
          prev.map((n) => (n.id === noti.id ? { ...n, is_read: true } : n))
        );
      }
    }

    // 페이지 이동
    if (noti.type === "comment" || noti.type === "like_review") {
      navigate(`/reviews/${noti.target_id}`);
    } else if (noti.type === "like_quote") {
      navigate(`/quotes/${noti.target_id}`);
    }
  };

  const handleMarkAllRead = async () => {
    const unreadIds = notifications.filter((n) => !n.is_read).map((n) => n.id);

    if (unreadIds.length === 0) return;

    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .in("id", unreadIds);

    if (error) {
      console.error("전체 읽음 처리 실패:", error.message);
    } else {
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, is_read: true }))
      );
    }
  };

  if (!user) return <div>로그인이 필요합니다.</div>;
  if (loading) return <div>알림을 불러오는 중...</div>;

  return (
    <div className={S.container}>
      <div className={S.header}>
        <h1>Notifications</h1>
        <button className={S.markAll} onClick={handleMarkAllRead}>
          Mark all as read
        </button>
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
                  <strong>{n.sender?.nickname ?? "알 수 없음"}</strong> {n.message}
                </p>
              </div>
              <div className={S.meta}>
                {new Date(n.created_at).toLocaleString()}
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