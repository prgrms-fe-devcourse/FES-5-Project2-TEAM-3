
import { useState } from "react";
import S from "./EditPassword.module.css";
import passwordIcon from '@/assets/icons/key-square.svg';
import toShowIcon from '@/assets/icons/eye.svg';
import toHideIcon from '@/assets/icons/eye-slash.svg';
import editCharacter from '@/assets/edit_character.png';

function EditPassword() {
  const [password, setPassword] = useState("");
  const [ showPassword, setShowPassword ] = useState<boolean>(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    setError("");
    // ✅ 여기에 비밀번호 변경 로직 추가 (예: supabase.auth.updateUser 등)
  };





  return (
    <div className={S.container}>
      <div className={S.box}>
        <figure>
          <img src={editCharacter} alt="비밀번호 고치는 범쌤" />
        </figure>

        <form className={S.formSection} onSubmit={handleSubmit}>
          <h2>Edit<br />Password</h2>

          <div className={S.inputWrapper}>
            <img className={S.inputIcon} src={passwordIcon} alt="비밀번호 아이콘" />
            <input 
              type={showPassword ? "text" : "password"}
              name="새로운 비밀번호" 
              id='1'
              placeholder='New Password' 
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

          <div className={S.inputWrapper}>
            <img className={S.inputIcon} src={passwordIcon} alt="비밀번호 아이콘" />
            <input 
              type={showPassword ? "text" : "password"}
              name="비밀번호 재입력" 
              id='1'
              placeholder='New Password Confirmation' 
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

          <button type="submit" className={S.saveButton}>Save</button>

          {error && <p className={S.error}>{error}</p>}
        </form>
      </div>
    </div>
  );
}

export default EditPassword;
