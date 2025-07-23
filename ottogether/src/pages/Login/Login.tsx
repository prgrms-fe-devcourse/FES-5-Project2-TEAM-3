import { useId, useState } from 'react';

import S from './Login.module.css';
import loginImg from '@/assets/login-character.png';
import emailIcon from '@/assets/icons/sms.svg';
import passwordIcon from '@/assets/icons/key-square.svg';
import toShowIcon from '@/assets/icons/eye.svg';
import toHideIcon from '@/assets/icons/eye-slash.svg';
import { useNavigate } from 'react-router-dom';
import FindId from '../../components/FindId/FindId';
import FindPassword from '../../components/FindPassword/FindPassword';


function Login() {

  const userId = useId();
  const pwId = useId();

  const navigate = useNavigate();

  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [ showPassword, setShowPassword ] = useState<boolean>(false);
  const [showFindId, setShowFindId] = useState(false);
  const [showFindPassword, setShowFindPassword] = useState(false);
  const [error,setError] = useState<string|null>(null);
  
  const handleLogin = async (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if(error){
      setError("아이디 또는 비밀번호가 잘못 되었습니다.");
    }else{
      // Swal.fire({
      //   title: '로그인에 성공했습니다!',
      //   text: '메인 페이지로 이동합니다.',
      //   icon: 'success',
      // }).then(() => {
      //   navigate('/');
      // });
    }   
  }


  return (
    <div className={S.container}>
      <figure>
        <img src={loginImg} alt="팝콘먹는 범쌤" />
      </figure>
      
      
      <section className={S.loginSection}>
        <h2>Login</h2>

        <form className={S.loginForm} onSubmit={handleLogin}>
          <div className={S.inputWrapper}>
            <img className={S.inputIcon} src={emailIcon} alt="이메일 아이콘" />
            <input 
              type="email" 
              name="이메일"
              id={userId}
              placeholder='Email'
              required
              aria-required
              onChange={(e)=> setEmail(e.target.value)}
             />
          </div>
          <div className={S.inputWrapper}>
            <img className={S.inputIcon} src={passwordIcon} alt="비밀번호 아이콘" />
            <input 
              type={showPassword ? "text" : "password"}
              name="비밀번호" 
              id={pwId}
              placeholder='Password' 
              required
              aria-required
              onChange={(e)=> setPassword(e.target.value)}
             />
            <img 
              className={S.toShowIcon} 
              src={showPassword ? toHideIcon : toShowIcon} 
              alt="비밀번호 보기"
              onClick={()=>setShowPassword(prev => !prev)}
             />
          </div>

          <button 
            className={S.loginButton} 
            type="submit"
            disabled={
              !email.trim() ||
              !password.trim()
            }
          >Login</button>

          <button 
            className={S.registerButton} 
            type="submit"
            onClick={(e)=>{
            e.preventDefault();
            navigate('/Register');
          }}
          >Register</button>
        </form>
        { error && <p>{error}</p>}
        
        <div className={S.linkWrapper}>
          <a href="" onClick={(e) => {
            e.preventDefault();
            setShowFindId(true);
          }}>
            아이디 찾기
          </a>
          <span className={S.divider}>|</span>
          <a href="" onClick={(e) => {
            e.preventDefault();
            setShowFindPassword(true);
          }}>
            비밀번호 찾기
          </a>
        </div>
      </section>
      {showFindId && <FindId onClose={() => setShowFindId(false)} />}
      {showFindPassword && <FindPassword onClose={() => setShowFindPassword(false)} />}


      
    </div>
  )
}
export default Login