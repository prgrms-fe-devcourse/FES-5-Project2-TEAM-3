import { useEffect } from "react";
import { ScrollRestoration, useLocation, useNavigationType } from "react-router-dom"

const ScrollManager = () => {
  const location = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    // 새로운 페이지로 이동한 경우 최상단으로
    if (navigationType === 'PUSH' || navigationType === 'REPLACE') {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  }, [location.pathname, navigationType]);
  
  // 뒤로가기일 경우 기존 스크롤 복원
  return <ScrollRestoration />;
}

export default ScrollManager;