import { useEffect, useState } from "react";
import S from "./FindPassword.module.css";
import closeIcon from "@/assets/icons/close.svg";
import emailIcon from "@/assets/icons/sms-white.svg";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabase/supabase";

type Props = {
  onClose: () => void;
};

function FindPassword({ onClose }: Props) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [mode, setMode] = useState<"form" | "result">("form");
  const [resultStep, setResultStep] = useState<"sent" | "not-received">("sent");

  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleSendEmail = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!email) {
      setError("이메일을 입력해주세요.");
      return;
    }

    try {
      setError("");

      const { data: profileData, error: profileError } = await supabase
        .from("profile")
        .select("user_id")
        .eq("email_address", email)
        .maybeSingle();

      if (profileError || !profileData) {
        setError("입력하신 정보와 동일한 회원이 없습니다.");
        return;
      }

      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/edit-password`,
      });

      if (resetError) {
        const msg = resetError.message || "";
        if (msg.includes("429") || msg.includes("Too Many Requests")) {
          setError("재전송 제한으로 잠시 후 다시 시도해주세요.");
        } else {
          setError("이메일 전송 중 오류가 발생했습니다.");
        }
        return;
      }

      setMode("result");
      setResultStep("sent");
    } catch (err) {
      console.error(err);
      setError("오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div className={S["overlay"]} onClick={onClose}>
      <div className={S["container"]} onClick={(e) => e.stopPropagation()}>
        <button className={S["close-button"]} onClick={onClose}>
          <img src={closeIcon} alt="닫기 버튼" />
        </button>

        {mode === "form" && (
          <form className={S["findpw-container"]} onSubmit={handleSendEmail}>
            <h2 className={S["title"]}>비밀번호 재설정</h2>
            <div className={S["description-wrapper"]}>
              <h3>비밀번호를 잊으셨나요?</h3>
              <p>
                가입했던 이메일을 적어주세요.<br />
                입력하신 이메일 주소로 비밀번호 변경 이메일을 보낼게요.
              </p>
            </div>
            <div className={S["findpw-wrapper"]}>
              <div className={S["input-wrapper"]}>
                <img src={emailIcon} alt="이메일 아이콘" />
                <input
                  type="email"
                  placeholder="E-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <button type="submit" className={S["send-email-button"]}>
                이메일 전송
              </button>
            </div>
            {error && <p className={S["error"]}>{error}</p>}
          </form>
        )}

        {mode === "result" && email && (
          <div className={S["result-container"]}>
            <h2 className={S["title"]}>비밀번호 재설정</h2>
            <div className={S["description-wrapper"]}>
              <h3>입력하신 이메일로 새로운 비밀번호를 전송했습니다.</h3>
              <p>
                메일을 받지 못하셨을 경우, 스팸함을 확인하시거나 이메일 주소를 다시 한 번 확인하여 주시길 바랍니다.
              </p>
            </div>

            {resultStep === "sent" ? (
              <div className={S["result-wrapper"]}>
                <div className={S["email-box"]}>
                  <img src={emailIcon} alt="이메일 아이콘" />
                  <span>{email}</span>
                </div>
                <button
                  className={S["login-button"]}
                  onClick={() => {
                    onClose();
                    navigate("/login");
                  }}
                >
                  로그인 페이지로
                </button>
                <a
                  className={S["sending-error-message"]}
                  onClick={() => setResultStep("not-received")}
                >
                  이메일을 받지 못하셨나요?
                </a>
                {error && <p className={S["error"]}>{error}</p>}
              </div>
            ) : (
              <div className={S["result-wrapper"]}>
                <button
                  className={S["resend-button"]}
                  onClick={async () => {
                    const { error: resendError } = await supabase.auth.resetPasswordForEmail(email, {
                      redirectTo: `${window.location.origin}/edit-password`,
                    });

                    if (resendError) {
                      const status = (resendError as any).status || (resendError as any).code;

                      if (status === 429) {
                        setError("재전송 제한으로 잠시 후 다시 시도해주세요.");
                      } else {
                        setError("이메일 재전송에 실패했습니다. 다시 시도해주세요.");
                      }
                      return;
                    }

                    setError("");
                    setResultStep("sent");
                  }}
                >
                  이메일 재전송
                </button>

                <button
                  className={S["rewrite-button"]}
                  onClick={() => {
                    setEmail("");
                    setError("");
                    setResultStep("sent");
                    setMode("form");
                  }}
                >
                  이메일 다시 입력하기
                </button>
                {error && <p className={S["error"]}>{error}</p>}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default FindPassword;
