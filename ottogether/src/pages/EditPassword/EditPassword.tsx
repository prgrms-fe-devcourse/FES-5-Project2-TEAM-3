import { useState } from "react";
import S from "./EditPassword.module.css";
import passwordIcon from '@/assets/icons/key-square.svg';
import toShowIcon from '@/assets/icons/eye.svg';
import toHideIcon from '@/assets/icons/eye-slash.svg';
import editCharacter from '@/assets/edit_character.png';
import { supabase } from "../../supabase/supabase";
import { useNavigate } from "react-router-dom";

function EditPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    setError("");
    setSuccess("");

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      console.error("비밀번호 변경 실패:", error.message);

      if (error.message.includes("New password should be different")) {
        setError("기존 비밀번호와 동일한 비밀번호는 사용할 수 없습니다.");
      } else if (error.message.includes("JWT expired") || error.message.includes("expired")) {
        setError("비밀번호 재설정 링크가 만료되었습니다. 다시 비밀번호 찾기를 진행해주세요.");
      } else {
        setError("비밀번호 변경에 실패했습니다. 다시 시도해주세요.");
      }

      return;
    }

    setSuccess("비밀번호 변경 완료! 로그인 페이지로 이동합니다.");
    setPassword("");
    setConfirmPassword("");

    setTimeout(() => navigate("/login"), 2000);
  };

  return (
    <div className={S["container"]}>
      <div className={S["box"]}>
        <figure>
          <img src={editCharacter} alt="비밀번호 고치는 범쌤" />
        </figure>

        <form className={S["form-section"]} onSubmit={handleSubmit}>
          <h2>Edit<br />Password</h2>

          <div className={S["input-wrapper"]}>
            <img className={S["input-icon"]} src={passwordIcon} alt="비밀번호 아이콘" />
            <input
              type={showPassword1 ? "text" : "password"}
              id="new-password"
              placeholder="New Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <img
              className={S["to-show-icon"]}
              src={showPassword1 ? toHideIcon : toShowIcon}
              alt="비밀번호 보기"
              onClick={() => setShowPassword1((prev) => !prev)}
            />
          </div>

          <div className={S["input-wrapper"]}>
            <img className={S["input-icon"]} src={passwordIcon} alt="비밀번호 아이콘" />
            <input
              type={showPassword2 ? "text" : "password"}
              id="confirm-password"
              placeholder="Confirm Password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <img
              className={S["to-show-icon"]}
              src={showPassword2 ? toHideIcon : toShowIcon}
              alt="비밀번호 보기"
              onClick={() => setShowPassword2((prev) => !prev)}
            />
          </div>

          <button type="submit" className={S["save-button"]}>Save</button>


          <div className={`${S.message} ${error ? S.error : success ? S.success : ""}`}>
            {error ? error : success ? success : <span>&nbsp;</span>}
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditPassword;
