
import { useState } from "react";
import S from "./EditPassword.module.css";
import passwordIcon from '@/assets/icons/key-square.svg';
import toShowIcon from '@/assets/icons/eye.svg';
import toHideIcon from '@/assets/icons/eye-slash.svg';
import editCharacter from '@/assets/edit_character.png';
import { supabase } from "../../supabase/supabase";

function EditPassword() {
  const [password, setPassword] = useState("");
  const [ showPassword1, setShowPassword1 ] = useState<boolean>(false);
  const [ showPassword2, setShowPassword2 ] = useState<boolean>(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");


const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (password !== confirmPassword) {
    setError("비밀번호가 일치하지 않습니다.");
    return;
  }

  setError("");

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    console.error("비밀번호 변경 실패:", error.message);
    setError("비밀번호 변경에 실패했습니다. 다시 시도해주세요.");
  } else {
    alert("비밀번호가 성공적으로 변경되었습니다!");
    setPassword("");
    setConfirmPassword("");
  }
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
              type={showPassword1 ? "text" : "password"}
              name="새로운 비밀번호" 
              id='1'
              placeholder='New Password' 
              required
              aria-required
              onChange={(e)=> setPassword(e.target.value)}
             />
            <img 
              className={S.toShowIcon} 
              src={showPassword1 ? toHideIcon : toShowIcon} 
              alt="비밀번호 보기"
              onClick={()=>setShowPassword1(prev => !prev)}
             />
          </div>

          <div className={S.inputWrapper}>
            <img className={S.inputIcon} src={passwordIcon} alt="비밀번호 아이콘" />
            <input 
              type={showPassword2 ? "text" : "password"}
              name="비밀번호 재입력" 
              id='1'
              placeholder='New Password Confirmation' 
              required
              aria-required
              onChange={(e)=> setPassword(e.target.value)}
             />
            <img 
              className={S.toShowIcon} 
              src={showPassword2 ? toHideIcon : toShowIcon} 
              alt="비밀번호 보기"
              onClick={()=>setShowPassword2(prev => !prev)}
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
