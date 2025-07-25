import { useEffect, useState } from "react";
import S from "./FindPassword.module.css";
import closeIcon from "@/assets/icons/close.svg";
import emailIcon from "@/assets/icons/sms-white.svg";
import { useNavigate } from "react-router-dom";

type Props = {
  onClose: () => void;
};

function FindPassword({ onClose }: Props) {
  const [email, setEmail] = useState('yooha922@gmail.com');
  const [error, setError] = useState('');
  const [mode, setMode] = useState<'form' | 'result'>('result');
  const [resultStep, setResultStep] = useState<'sent' | 'notReceived'>('sent');

  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);




  // Auth 접근 로직

  // 이메일 전송 로직






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
      <div className={S.container} onClick={(e) => e.stopPropagation()}>
        <button className={S.closeButton} onClick={onClose}>
          <img src={closeIcon} alt="닫기 버튼" />
        </button>

        {mode === 'form' && (
          <div className={S.findpwContainer}>
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
              <button className={S.sendEmailButton} onClick={handleSendEmail}>
                이메일 전송
              </button>
            </div>

            {error && <p className={S.error}>{error}</p>}
          </div>
        )}

        {mode === 'result' && email && (
          <div className={S.resultContainer}>
            <h2 className={S.title}>비밀번호 재설정</h2>
            
            <div className={S.descriptionWrapper}>
              <h3>입력하신 이메일로 새로운 비밀번호를 전송했습니다.</h3>
              <p>
                메일을 받지 못하셨을 경우, 스팸함을 확인하시거나 이메일 주소를 다시 한 번 확인하여 주시길 바랍니다.
              </p>
            </div>

            {resultStep === 'sent' ? (
              <div className={S.resultWrapper}>
                <div className={S.emailBox}>
                  <img src={emailIcon} alt="이메일 아이콘" />
                  <span>{email}</span>
                </div>

                <button
                  className={S.loginButton}
                  onClick={() => {
                    onClose();
                    navigate('/login');
                  }}
                >
                  로그인 페이지로
                </button>

                <a className={S.sendingErrorMessage} onClick={() => setResultStep("notReceived")}>
                  이메일을 받지 못하셨나요?
                </a>

              </div>
            ) : (
              <div className={S.resultWrapper}>
                <button
                  className={S.resendButton}
                  onClick={() => {
                    // 이메일 전송 함수
                    setResultStep("sent");
                  }}
                >
                  이메일 재전송
                </button>

                <button
                  className={S.retryButton}
                  onClick={() => {
                    setEmail("");
                    setError("");
                    setResultStep("sent");
                    setMode("form");
                  }}
                >
                  이메일 다시 입력하기
                </button>

              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}

export default FindPassword;