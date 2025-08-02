import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { supabase } from "../../../supabase/supabase";
import styles from "./PasswordModal.module.css";
import passwordIcon from "@/assets/icons/key-square.svg";
import toShowIcon from "@/assets/icons/eye.svg";
import toHideIcon from "@/assets/icons/eye-slash.svg";
import emailIcon from "@/assets/icons/sms.svg";

interface Props {
  onClose: () => void;
  userEmail?: string; 
}

function PasswordModal({ onClose, userEmail }: Props) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pwConfirm, setPwConfirm] = useState("");
  const [showPw1, setShowPw1] = useState(false);
  const [showPw2, setShowPw2] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [clickedOutside, setClickedOutside] = useState(false);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);

    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setClickedOutside(true);
      } else {
        setClickedOutside(false);
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (
        clickedOutside &&
        modalRef.current &&
        !modalRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
      setClickedOutside(false);
    };

    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [clickedOutside, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email) {
      setError("이메일을 입력해주세요.");
      return;
    }
    if (userEmail && email !== userEmail) {
      setError("해당 이메일은 가입하지 않은 이메일입니다.");
      return;
    }
    if (password.length < 8) {
      setError("비밀번호는 최소 8자 이상이어야 합니다.");
      return;
    }
    if (password !== pwConfirm) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      if (error.message.includes("New password should be different")) {
        setError("현재 비밀번호와 동일한 비밀번호로 변경할 수 없습니다.");
      } else if (
        error.message.includes("JWT expired") ||
        error.message.includes("expired")
      ) {
        setError("세션이 만료되었습니다. 다시 로그인 후 시도해주세요.");
      } else {
        setError("비밀번호 변경에 실패했습니다. 다시 시도해주세요.");
      }
      return;
    }

    alert("비밀번호가 성공적으로 변경되었습니다!");
    onClose();
  };

  const modalContent = (
    <div className={styles["my-pw-modal-overlay"]}>
      <div ref={modalRef} className={styles["my-pw-modal-box"]}>
        <h2 className={styles["my-pw-title"]}>비밀번호 변경</h2>
        <form onSubmit={handleSubmit} className={styles["my-pw-form"]}>
          <div className={styles["my-pw-input-wrapper"]}>
            <img src={emailIcon} alt="이메일 아이콘" className={styles["my-pw-input-icon"]} />
            <input
              type="email"
              placeholder="이메일 입력"
              className={styles["my-pw-input"]}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className={styles["my-pw-input-wrapper"]}>
            <img src={passwordIcon} alt="비밀번호 아이콘" className={styles["my-pw-input-icon"]} />
            <input
              type={showPw1 ? "text" : "password"}
              placeholder="새 비밀번호"
              className={styles["my-pw-input"]}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <img
              src={showPw1 ? toHideIcon : toShowIcon}
              alt="비밀번호 보기"
              className={styles["my-pw-to-show-icon"]}
              onClick={() => setShowPw1((prev) => !prev)}
            />
          </div>

          <div className={styles["my-pw-input-wrapper"]}>
            <img src={passwordIcon} alt="비밀번호 아이콘" className={styles["my-pw-input-icon"]} />
            <input
              type={showPw2 ? "text" : "password"}
              placeholder="비밀번호 확인"
              className={styles["my-pw-input"]}
              value={pwConfirm}
              onChange={(e) => setPwConfirm(e.target.value)}
              required
            />
            <img
              src={showPw2 ? toHideIcon : toShowIcon}
              alt="비밀번호 보기"
              className={styles["my-pw-to-show-icon"]}
              onClick={() => setShowPw2((prev) => !prev)}
            />
          </div>

          <div
            className={`${styles["my-pw-message"]} ${
              error ? styles["my-pw-error"] : success ? styles["my-pw-success"] : ""
            }`}
          >
            {error || success || <span>&nbsp;</span>}
          </div>

          <div className={styles["my-pw-buttons"]}>
            <button
              type="button"
              onClick={onClose}
              className={`${styles["my-pw-button"]} ${styles["my-pw-cancel"]}`}
            >
              취소
            </button>
            <button
              type="submit"
              className={`${styles["my-pw-button"]} ${styles["my-pw-confirm"]}`}
            >
              변경하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}

export default PasswordModal;
