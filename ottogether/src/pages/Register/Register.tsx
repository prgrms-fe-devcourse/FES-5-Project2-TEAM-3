import { useEffect, useId, useState } from 'react';
import S from './Register.module.css';
import characterImg from '@/assets/register-character.png';
import userIcon from '@/assets/icons/user-square.svg';
import emailIcon from '@/assets/icons/sms.svg';
import passwordIcon from '@/assets/icons/key-square.svg';
import toShowIcon from '@/assets/icons/eye.svg';
import toHideIcon from '@/assets/icons/eye-slash.svg';
import { useNavigate } from 'react-router-dom';


function Register() {

  const navigate = useNavigate();

  /* register Form용 아이디 생성 */
  const nicknameId = useId();
  const emailId = useId();
  const passwordId = useId();
  const passwordConfirmId = useId();

  /* input 및 상태별 state 정의 */
  const [ userNickName, setUserNickName ] = useState<string>('');
  const [ userEmail, setUserEmail ] = useState<string>('');
  const [ userPassword, setUserPassword ] = useState<string>('');
  const [ userPasswordConfirm, setUserPasswordConfirm ] = useState<string>('');
  const [ showPassword, setShowPassword ] = useState<boolean>(false);
  const [ showPasswordConfirm, setShowPasswordConfirm ] = useState<boolean>(false);
  const [ error, setError ] = useState<string>('');

  /* password 불일치 에러 초기화 */
  useEffect(() => {
    if (error && userPassword && userPasswordConfirm && userPassword === userPasswordConfirm) {
      setError('');
    }
  }, [userPassword, userPasswordConfirm])
  

  const handleInput = (e:React.ChangeEvent<HTMLInputElement>) => {
    if(e.target.id === nicknameId) {
      setUserNickName(e.target.value);
    } else if(e.target.id === emailId) {
      setUserEmail(e.target.value);
    } else if(e.target.id === passwordId) {
      setUserPassword(e.target.value);
    } else if(e.target.id === passwordConfirmId) {
      setUserPasswordConfirm(e.target.value);
    }
  }

  const handleRegister = (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(userPassword !== userPasswordConfirm ) {
      setError("입력하신 비밀번호가 일치하지 않습니다.");
      return;
    }
    // authRegister();
    sessionStorage.setItem('registerInfo', JSON.stringify({
      nickname: userNickName,
      email: userEmail
    }));

    navigate('/register/detail', { 
      state: {
        nickname: userNickName,
        email: userEmail
      }
    });
  }

  return (
    <div className={S.container}>
      <figure>
        <img src={characterImg} alt="엄지척 범쌤" />
      </figure>
      <section className={S.registerSection}>
        <h2>Register</h2>
        <form className={S.registerForm} onSubmit={handleRegister}>
          <div className={S.inputWrapper}>
            <img className={S.inputIcon} src={userIcon} alt="유저 아이콘" />
            <input 
              type="text" 
              name="닉네임" 
              id={nicknameId} 
              placeholder='NickName' 
              required 
              onChange={handleInput}
             />
          </div>
          <div className={S.inputWrapper}>
            <img className={S.inputIcon} src={emailIcon} alt="이메일 아이콘" />
            <input 
              type="email" 
              name="이메일" 
              id={emailId} 
              placeholder='Email' 
              required 
              onChange={handleInput}
             />
          </div>
          <div className={S.inputWrapper}>
            <img className={S.inputIcon} src={passwordIcon} alt="비밀번호 아이콘" />
            <input 
              type={showPassword ? "text" : "password"}
              name="비밀번호" 
              id={passwordId} 
              placeholder='Password' 
              required 
              onChange={handleInput}
             />
            <img 
              className={S.toShowIcon} 
              src={showPassword ? toHideIcon : toShowIcon} 
              alt="비밀번호 보기"
              onClick={()=>setShowPassword(prev => !prev)}
             />
          </div>
          <div className={S.inputWrapper}>
            <img className={S.inputIcon} src={passwordIcon} alt="비밀번호 아이콘" />
            <input 
              type={showPasswordConfirm ? "text" : "password"}
              name="비밀번호 확인" 
              id={passwordConfirmId} 
              placeholder='Password Confirm' 
              required
              onChange={handleInput}
             />
            <img 
              className={S.toShowIcon} 
              src={showPasswordConfirm ? toHideIcon : toShowIcon} 
              alt="비밀번호 보기"
              onClick={()=>setShowPasswordConfirm(prev => !prev)}
             />
          </div>

          <button 
            className={S.registerButton} 
            type="submit"
            disabled={
              !userNickName.trim() ||
              !userEmail.trim() ||
              !userPassword.trim() ||
              !userPasswordConfirm.trim()
            }
          >Register</button>
        </form>
        { error && <p>{error}</p>}
      </section>
    </div>
  )
}
export default Register