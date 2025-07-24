import { useEffect, useState } from "react";
import S from "./FindPassword.module.css";
import closeIcon from "@/assets/icons/close.svg";
import emailIcon from "@/assets/icons/sms-white.svg";

type Props = {
  onClose: () => void;
};

function FindPassword({ onClose }: Props) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleSendEmail = async () => {
    if (!email) {
      setError("이메일을 입력해주세요.");
      return;
    }

    try {
      setError('');
      // console.log("비밀번호 재설정 이메일 전송 시도");
    } catch (err) {
      setError("입력하신 정보와 동일한 회원이 없습니다.");
    }
  };

  return (
    <div className={S.overlay} onClick={onClose}>
      <div className={S.modal} onClick={(e) => e.stopPropagation()}>
        <button className={S.closeButton} onClick={onClose}>
          <img src={closeIcon} alt="닫기 버튼" />
        </button>

        <h2 className={S.title}>비밀번호 재설정</h2>

        <div className={S.descriptionWrapper}>
          <h3>비밀번호를 잊으셨나요?</h3>
          <p>
            가입했던 이메일을 적어주세요.<br />
            입력하신 이메일 주소로 비밀번호 변경 이메일을 보낼게요.
          </p>
        </div>

        <div className={S.findPwWrapper}>
          <div className={S.inputWrapper}>
            <img src={emailIcon} alt="이메일 아이콘" />
            <input
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button className={S.sendEmailBtn} onClick={handleSendEmail}>
            이메일 전송
          </button>
        </div>

        {error && <p className={S.error}>{error}</p>}
      </div>
    </div>
  );
}

export default FindPassword;