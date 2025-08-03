import { useState } from "react";
import { useNavigate } from "react-router-dom"; // 페이지 이동용
import S from "./Notifications.module.css";

type Notification = {
  id: string;
  senderName: string;
  senderAvatar?: string;
  message: string;
  type: "comment" | "like_review" | "like_quote";
  isRead: boolean;
  createdAt: string;
  targetUrl?: string; // 이동할 주소
};

const mockNotifications: Notification[] = [
  {
    id: "1",
    senderName: "Ashwin Bose",
    message: "님이 Batman Begins 리뷰에 댓글을 달았습니다.",
    type: "comment",
    isRead: false,
    createdAt: "15h",
    targetUrl: "/reviews/1",
  },
  {
    id: "2",
    senderName: "Patrick 님 외 8명",
    message: "님이 Batman Begins 리뷰를 좋아합니다.",
    type: "like_review",
    isRead: false,
    createdAt: "15h",
    targetUrl: "/reviews/1",
  },
  {
    id: "3",
    senderName: "Samantha 님 외 2명",
    message: "님이 Batman Begins 리뷰를 싫어합니다.",
    type: "like_review",
    isRead: true,
    createdAt: "15h",
    targetUrl: "/reviews/1",
  },
  {
    id: "4",
    senderName: "Steve 님 외 8명",
    message: "님이 Batman Begins 명대사를 좋아합니다.",
    type: "like_quote",
    isRead: true,
    createdAt: "15h",
    targetUrl: "/quotes/1",
  },
];

function Notifications() {
  const [activeTab, setActiveTab] = useState<"all" | "likes" | "comments" | "unread">("all");
  const navigate = useNavigate();

  const filtered = mockNotifications.filter((n) => {
    if (activeTab === "likes") return n.type === "like_review" || n.type === "like_quote";
    if (activeTab === "comments") return n.type === "comment";
    if (activeTab === "unread") return !n.isRead;
    return true;
  });

  const handleClick = (url?: string) => {
    if (url) {
      navigate(url);
    }
  };

  return (
    <div className={S.container}>
      <div className={S.header}>
        <h1>Notifications</h1>
        <button className={S.markAll}>Mark all as read</button>
      </div>

      <div className={S.tabs}>
        <button
          className={`${S.tab} ${activeTab === "all" ? S.active : ""}`}
          onClick={() => setActiveTab("all")}
        >
          All <span>{mockNotifications.length}</span>
        </button>
        <button
          className={`${S.tab} ${activeTab === "likes" ? S.active : ""}`}
          onClick={() => setActiveTab("likes")}
        >
          Likes{" "}
          <span>
            {mockNotifications.filter((n) => n.type === "like_review" || n.type === "like_quote").length}
          </span>
        </button>
        <button
          className={`${S.tab} ${activeTab === "comments" ? S.active : ""}`}
          onClick={() => setActiveTab("comments")}
        >
          Comments <span>{mockNotifications.filter((n) => n.type === "comment").length}</span>
        </button>
        <button
          className={`${S.tab} ${activeTab === "unread" ? S.active : ""}`}
          onClick={() => setActiveTab("unread")}
        >
          Unread <span>{mockNotifications.filter((n) => !n.isRead).length}</span>
        </button>
      </div>

      <ul className={S.list}>
        {filtered.map((n) => (
          <li
            key={n.id}
            className={`${S.item} ${n.isRead ? S.read : S.unread}`}
            onClick={() => handleClick(n.targetUrl)}
          >
            <div className={S.avatar}>
              {n.senderAvatar ? (
                <img src={n.senderAvatar} alt={n.senderName} />
              ) : (
                <div className={S.avatarFallback}>
                  {n.senderName.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className={S.content}>
              <p>
                <strong>{n.senderName}</strong> {n.message}
              </p>
            </div>
            <div className={S.meta}>{n.createdAt}</div>
          </li>
        ))}
      </ul>

      <div className={S.footer}>
        <button className={S.viewAll}>View All</button>
      </div>
    </div>
  );
}

export default Notifications;
