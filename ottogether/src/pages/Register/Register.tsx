import { useEffect, useId, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import S from './Register.module.css';
import characterImg from '@/assets/register-character.png';
import userIcon from '@/assets/icons/user-square.svg';
import phoneIcon from '@/assets/icons/phone.svg';
import emailIcon from '@/assets/icons/sms.svg';
import passwordIcon from '@/assets/icons/key-square.svg';
import toShowIcon from '@/assets/icons/eye.svg';
import toHideIcon from '@/assets/icons/eye-slash.svg';
import toExpandIcon from '@/assets/icons/expand.svg';
import toCollapseIcon from '@/assets/icons/collapse.svg';
import { authRegister, type RegisterReturns } from '../../supabase/auth/authRegister';
import { formatPhoneNumber } from '../../util/formatPhoneNumber';

function Register() {

  const navigate = useNavigate();

  /* register Form용 아이디 생성 */
  const nameId = useId();
  const phoneId = useId();
  const emailId = useId();
  const passwordId = useId();
  const passwordConfirmId = useId();

  /* input 및 상태별 state 정의 */
  const [ userName, setUserName ] = useState<string>('');
  const [ userPhoneNumber, setUserPhoneNumber ] = useState<string>('');
  const [ userEmail, setUserEmail ] = useState<string>('');
  const [ userPassword, setUserPassword ] = useState<string>('');
  const [ userPasswordConfirm, setUserPasswordConfirm ] = useState<string>('');
  const [ showPassword, setShowPassword ] = useState<boolean>(false);
  const [ showPasswordConfirm, setShowPasswordConfirm ] = useState<boolean>(false);
  const [ agreement, setAgreement ] = useState<boolean | null>(null);
  const [ isOpen, setIsOpen ] = useState<boolean>(false);
  const [ prevValue, setPrevValue ] = useState('');
  const [ cursorPos, setCursorPos ] = useState<number | null>(null);
  const [ error, setError ] = useState<string>('');

  const agreeFieldRef = useRef<HTMLInputElement>(null);
  const phoneInputRef = useRef<HTMLInputElement>(null);

  // 핸드폰번호 정규식
  const phoneRegex = /^01[016789]-\d{3,4}-\d{4}$/;

  // 입력하기 버튼 활성화 조건 설정
  const isSubmittable = (agreement === true && userName.trim() !== '' && userPhoneNumber.trim() !== '') || ( agreement === false );

  /* password 불일치 에러 초기화 */
  useEffect(() => {
    if (error && userPassword && userPasswordConfirm && userPassword === userPasswordConfirm) {
      setError('');
    }
  }, [userPassword, userPasswordConfirm])
  
  /* 핸드폰번호 형식 불일치 에러 초기화 */
  useEffect(() => {
    if (error && phoneRegex.test(userPhoneNumber)) {
      setError('');
    }
  }, [userPhoneNumber])

  /* user 입력값 state에 저장 */
  const handleInput = (e:React.ChangeEvent<HTMLInputElement>) => {
    if(e.target.id === nameId) {
      setUserName(e.target.value.trim());
    } else if(e.target.id === emailId) {
      setUserEmail(e.target.value.trim());
    } else if(e.target.id === passwordId) {
      setUserPassword(e.target.value.trim());
    } else if(e.target.id === passwordConfirmId) {
      setUserPasswordConfirm(e.target.value.trim());
    }
  }

  /* 전화번호 형식 검사 및 포맷팅에 따른 커서 위치 조정 */
  const handlePhoneInput = (e:React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target;
    const raw = input.value.trim().replace(/\D/g, '');
    const cursor = input.selectionStart ?? raw.length;

    const formattedBefore = formatPhoneNumber(prevValue);
    const formattedAfter = formatPhoneNumber(raw);

    // 커서 위치 보정
    let adjustment = 0;
    if ( formattedAfter.length >= formattedBefore.length) { // 추가 입력 중인 상태
      if(formattedAfter[cursor-1] === '-' || formattedAfter[cursor] === '-') adjustment = 1;
    } else if ( formattedAfter.length < formattedBefore.length ) { // 삭제 중인 상태
      if(formattedBefore[cursor - 1] === '-') adjustment = -1;
    }

    setCursorPos(cursor + adjustment);
    setPrevValue(raw);
    setUserPhoneNumber(formattedAfter);
  }

  const handlePhoneKeydown = (e:React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Backspace' ) return;

    const input = e.currentTarget;
    const cursorPos = input.selectionStart ?? input.value.length;

    // 커서가 앞 문자가 "-" 이면 두 글자 지움
    if( cursorPos > 0 && input.value[cursorPos - 1] === '-') {
      e.preventDefault();
      const raw = (
        input.value.slice(0, cursorPos - 2) +
        input.value.slice(cursorPos) )
        .replace(/\D/g, '');
      setUserPhoneNumber(raw);
    }
  }

  useEffect(() => {
    if( cursorPos !== null && phoneInputRef.current ) {
      requestAnimationFrame(() => {
        phoneInputRef.current?.setSelectionRange(cursorPos, cursorPos);
      })
    }
  }, [cursorPos])
  

  /* 회원가입 form submit */
  const handleRegister = async (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 비밀번호 불일치 여부 확인
    if(userPassword !== userPasswordConfirm ) {
      setError("입력하신 비밀번호가 일치하지 않습니다.");
      return;
    }

    // 전화번호 형식 검사
    if(!phoneRegex.test(userPhoneNumber)) {
      setError('올바른 핸드폰번호 형식이 아닙니다.');
      return;
    }

    // 정보제공 동의 X + 입력값 있음
    if( agreement === false && (userName.trim() !== '' || userPhoneNumber.trim() !== '')) {
      const confirmDelete = confirm('개인정보 제공에 동의하지 않으시는 경우, 입력하신 값은 저장되지 않습니다. 계속하시겠습니까?');
      if(confirmDelete) {
        setUserName('');
        setUserPhoneNumber('');
        navigate('/register/detail');
      } else {
        agreeFieldRef.current?.scrollIntoView();
        agreeFieldRef.current?.focus();
        return;
      }
    }

    // supabase auth 통신
    const result:RegisterReturns = await authRegister(userEmail, userPassword, userPhoneNumber, { name: userName });
    if (result.success) {
      navigate('/register/detail', { 
        state: {
          userId: result.userId
        }
      });
    } else {
      setError(result.error || '회원가입 중 오류가 발생했습니다.')
    }
  }

  return (
    <div className={S.container}>
      <figure>
        <img src={characterImg} alt="엄지척 범쌤" />
      </figure>
      <section className={S["register-section"]}>
        <h2>Register</h2>
        <form className={S["register-form"]} onSubmit={handleRegister}>
          <div className={S["input-wrapper"]}>
            <img className={S["input-icon"]} src={userIcon} alt="유저 아이콘" />
            <input 
              type="text" 
              name="이름" 
              id={nameId} 
              placeholder='Name' 
              onChange={handleInput}
              />
          </div>
          <div className={S["input-wrapper"]}>
            <img className={S["input-icon"]} src={phoneIcon} alt="전화 아이콘" />
            <input 
              type="text" 
              name="전화번호" 
              id={phoneId} 
              placeholder='Phone Number' 
              ref={phoneInputRef}
              value={formatPhoneNumber(userPhoneNumber)}
              onChange={handlePhoneInput}
              onKeyDown={handlePhoneKeydown}
              />
          </div>
          <div className={S["input-wrapper"]}>
            <img className={S["input-icon"]} src={emailIcon} alt="이메일 아이콘" />
            <input 
              type="email" 
              name="이메일" 
              id={emailId} 
              placeholder='Email' 
              required 
              onChange={handleInput}
             />
          </div>
          <div className={S["input-wrapper"]}>
            <img className={S["input-icon"]} src={passwordIcon} alt="비밀번호 아이콘" />
            <input 
              type={showPassword ? "text" : "password"}
              name="비밀번호" 
              id={passwordId} 
              placeholder='Password' 
              required 
              onChange={handleInput}
             />
            <img 
              className={S["to-show-icon"]} 
              src={showPassword ? toHideIcon : toShowIcon} 
              alt="비밀번호 보기"
              onClick={()=>setShowPassword(prev => !prev)}
             />
          </div>
          <div className={S["input-wrapper"]}>
            <img className={S["input-icon"]} src={passwordIcon} alt="비밀번호 아이콘" />
            <input 
              type={showPasswordConfirm ? "text" : "password"}
              name="비밀번호 확인" 
              id={passwordConfirmId} 
              placeholder='Password Confirm' 
              required
              onChange={handleInput}
             />
            <img 
              className={S["to-show-icon"]} 
              src={showPasswordConfirm ? toHideIcon : toShowIcon} 
              alt="비밀번호 보기"
              onClick={()=>setShowPasswordConfirm(prev => !prev)}
             />
          </div>

          <div className={S.accordion}>
            <h4>개인정보 수집 및 이용 동의</h4>
            <button 
              type="button"
              className={S.accordionToggle}
              onClick={() => setIsOpen(prev => !prev)}
              aria-expanded={isOpen}
              aria-controls='agreement-section'
            >
              { isOpen ? <img src={toCollapseIcon} alt="닫기" />
                : <img src={toExpandIcon} alt="열기" />
              }
            </button>
          </div>
          {
            isOpen && (
              <section className={S["agreement-section"]}>
                <p><strong>입력하신 이름과 전화번호는 아래 동의 항목에 따라 수집 및 이용</strong>되며, 회원 정보 확인을 위한 목적으로만 사용됩니다. </p>
                <p>본 동의는 거부하실 수 있으며, 거부하실 경우 <strong>정상적으로 가입하신 이메일 / 비밀번호 찾기 기능을 이용하실 수 없습니다.</strong></p>
                <ol>
                  <li key="purpose">수집 목적 : 회원 정보 확인</li>
                  <li key="information">수집 항목 : 이름, 전화번호, 이메일 주소</li>
                  <li key="retention-period">보유 및 이용 기간 : 회원 탈퇴 시까지</li>
                </ol>
              </section>
            )
          }
          <fieldset aria-label='정보 제공 동의 선택창'>
            <legend className='a11y-hidden'>개인정보 제공에 동의하십니까?</legend>

            <label htmlFor="agree">
              <input 
              ref={agreeFieldRef}
              tabIndex={-1}
              type="radio" 
              name="agreement"
              id="agree"
              value="true"
              checked={agreement === true} 
              onChange={()=>setAgreement(true)}
              /> 
              네, 동의합니다.</label>
            <label htmlFor="disagree">
              <input 
              type="radio" 
              name="agreement"
              id="disagree"
              value="false"
              checked={agreement === false} 
              onChange={()=>setAgreement(false)}
              /> 
              동의하지 않습니다.</label>
          </fieldset>  

          <button 
            className={S["register-button"]} 
            type="submit"
            disabled={
              !isSubmittable ||
              !userEmail.trim() ||
              !userPassword.trim() ||
              !userPasswordConfirm.trim()
            }
          >Register</button>
        </form>
        { error && <p className={S.error} aria-live='polite'>{error}</p>}
      </section>
    </div>
  )
}
export default Register