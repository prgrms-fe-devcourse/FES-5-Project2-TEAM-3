import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import S from "./FindId.module.css";
import userIcon from "@/assets/icons/user-square-white.svg";
import phoneIcon from "@/assets/icons/phone-white.svg";
import emailIcon from "@/assets/icons/sms-white.svg";
import closeIcon from "@/assets/icons/close.svg";

type Props = {
  onClose: () => void;
};

function FindId({ onClose }: Props) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [foundEmail, setFoundEmail] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<'form' | 'result'>('form');

  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);



  //supabase Auth 접근 로직 필요.






  const handleFindId = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setFoundEmail(null);

    const { data, error: supaError } = await supabase
      .from('users') // 실제 테이블명으로 수정 필요
      .select('email')
      .eq('name', name)
      .eq('phone', phone)
      .single();

    if (supaError || !data) {
      setError('입력하신 정보와 동일한 회원이 없습니다.');
    } else {
      setFoundEmail(data.email);
      setMode('result');
    }

    setIsLoading(false);
  };









  

  const getMaskedEmail = (email: string) => {
    const [localPart, domain] = email.split('@');
    if (localPart.length <= 3) {
      return '*'.repeat(localPart.length) + '@' + domain;
    }
    const visible = localPart.slice(0, 3);
    const masked = '*'.repeat(localPart.length - 3);
    return `${visible}${masked}@${domain}`;
  };

  return (
    <div className={S.overlay} onClick={onClose}>
      <div className={S.container} onClick={(e) => e.stopPropagation()}>
        <button className={S.closeButton} onClick={onClose}>
          <img src={closeIcon} alt="닫기 버튼" />
        </button>

        {mode === 'form' && (
          <div className={S.findIdContainer}>
            <h2 className={S.title}>이메일 찾기</h2>
            <div className={S.descriptionWrapper}>
              <h3>가입하신 이메일을 잊으셨나요?</h3>
              <p>
                회원님의 성함과 전화번호를 적어주세요.<br />
                입력하신 정보와 동일한 회원이 있는지 확인 후<br />
                가입하신 이메일 정보를 알려드릴게요.
              </p>
            </div>

            <form className={S.findIdForm} onSubmit={handleFindId}>
              <div className={S.inputWrapper}>
                <img src={userIcon} alt="이름 아이콘" />
                <input
                  type="text"
                  placeholder="User Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className={S.inputWrapper}>
                <img src={phoneIcon} alt="전화번호 아이콘" />
                <input
                  type="tel"
                  placeholder="Phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className={S.findButton} disabled={isLoading}>
                이메일 찾기
              </button>
            </form>

            {error && <p className={S.error}>{error}</p>}
          </div>
        )}

        {mode === 'result' && foundEmail && (
          <div className={S.resultContainer}>
            <h2 className={S.title}>이메일 찾기</h2>
            <p className={S.description}>
              회원님께서 가입해주신 이메일은 다음과 같습니다:
            </p>

            <div className={S.emailBox}>
              <img src={emailIcon} alt="이메일 아이콘" />
              <span>{getMaskedEmail(foundEmail)}</span>
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
          </div>
        )}
      </div>
    </div>
  );
}

export default FindId;
