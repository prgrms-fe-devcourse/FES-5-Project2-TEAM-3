
import { useState } from "react";
import S from "./MyPage.module.css";

// 더미 컴포넌트 (실제로는 따로 파일로 분리 가능)
function Reviews() {
  return <div>내가 작성한 리뷰 목록</div>;
}

function Quotes() {
  return <div>내가 작성한 명대사 목록</div>;
}

function Likes() {
  return <div>내가 좋아요한 컨텐츠</div>;
}

function MyPage() {
  const [activeTab, setActiveTab] = useState("reviews");

  const renderContent = () => {
    switch (activeTab) {
      case "reviews":
        return <Reviews />;
      case "quotes":
        return <Quotes />;
      case "likes":
        return <Likes />;
      default:
        return <div>원하는 카테고리를 선택해주세요.</div>;
    }
  };

  return (
    <div className={S.container}>
      {/* 왼쪽 사이드바 */}
      <aside className={S.sidebar}>
        <div className={S.profileBox}>
          <img src="/profile.png" alt="profile" />
          <h3>Prong FE</h3>
          <p>안녕하세요</p>
        </div>

        <nav className={S.navMenu}>
          <h4>Created Contents</h4>
          <ul>
            <li onClick={() => setActiveTab("reviews")}>Reviews</li>
            <li onClick={() => setActiveTab("quotes")}>Quotes</li>
          </ul>
          <h4>Liked Contents</h4>
          <ul>
            <li onClick={() => setActiveTab("likes")}>Reviews & Quotes</li>
          </ul>
        </nav>
      </aside>

      {/* 오른쪽 메인 블록 */}
      <main className={S.mainContent}>
        {renderContent()}
      </main>
    </div>
  );
}

export default MyPage;