import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../supabase/supabase";
import S from "./SystemSettings.module.css";

interface Props {
  onClose: () => void;
  user: { id: string; email?: string } | null;
}

function DeleteAccountModal({ onClose, user }: Props) {
  const navigate = useNavigate();

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const handleDelete = async () => {
    if (!user) return;

    try {
      console.log("🔎 탈퇴 요청 시작");
      console.log("user:", user);

      // ✅ 세션 확인
      const { data, error: sessionError } = await supabase.auth.getSession();
      console.log("session data:", data, "session error:", sessionError);

      if (sessionError || !data.session) {
        throw new Error("로그인 세션을 불러올 수 없습니다.");
      }

      const token = data.session.access_token;
      console.log("access_token:", token);

      // ✅ fetch 요청
      const response = await fetch(
        "https://ifvtongrzrnoyiflqmcs.supabase.co/functions/v1/deleteUser",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ userId: user.id }),
        }
      );

      console.log("response.ok:", response.ok);
      console.log("response.status:", response.status);
      console.log("response headers:", [...response.headers.entries()]);

      const result = await response.json().catch(() => null);
      console.log("deleteUser result:", result);

      if (!response.ok || (result && result.error)) {
        throw new Error(result?.error || "탈퇴 중 오류가 발생했습니다.");
      }

      await supabase.auth.signOut();
      alert("탈퇴되었습니다.");
      navigate("/");
    } catch (err: any) {
      console.error("deleteUser error (full):", err);

      if (err instanceof Error) {
        alert("탈퇴 중 오류 발생: " + err.message);
      } else {
        alert("탈퇴 중 알 수 없는 오류 발생");
      }
    }
  };

  return (
    <div className={S["modal-overlay"]} onClick={onClose}>
      <div className={S["modal-box"]} onClick={(e) => e.stopPropagation()}>
        <h3>Ottogether에서 탈퇴하시겠습니까?</h3>
        <div className={S["modal-buttons"]}>
          <button onClick={onClose}>뒤로가기</button>
          <button onClick={handleDelete} className={S["danger"]}>
            탈퇴하기
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteAccountModal;
