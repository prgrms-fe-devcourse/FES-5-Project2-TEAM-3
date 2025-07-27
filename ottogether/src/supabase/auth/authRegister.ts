/* Supabase Auth Sign Up */
/* 이메일, 비밀번호, (optional: 전화번호, 이름)을 받아 Auth.User 테이블에 회원가입 처리 */

import { supabase } from "../supabase";

export type RegisterReturns = 
  { success: true; userId:string }
  | { success: false; error:string };

export const authRegister = async (
  email: string,
  password: string,
  phone: string,
  options: { name:string }
): Promise<RegisterReturns> => {

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    phone,
    options: {
      data: {
        name: options.name
      }
    }
  });

  // 에러 메시지 처리
  let errorMsg = '회원가입에 실패했습니다.';
  if ( error || !data.user?.id ) {
    if ( error?.message.includes("User already registered") ) {
      errorMsg = '이미 가입된 이메일입니다.';
    } else if ( error?.message.includes("Password should be at least 6 characters") ) {
      errorMsg = '비밀번호는 최소 6자리 이상이어야 합니다.';
    } else if ( error?.message.includes("Signup requires a valid email") ) {
      errorMsg = '올바른 이메일 형식을 입력해 주세요.'
    } else if ( error?.message.includes("Too many requests") ) {
      errorMsg = '회원가입 요청이 너무 많습니다. 잠시 후 다시 시도해주세요.'
    } 
    else {
      errorMsg = '회원가입 정보가 유효하지 않습니다.';
      console.error(error?.message);
    }

    return { 
      success: false, 
      error: errorMsg };
  }

  return { success: true, userId: data.user.id };
}