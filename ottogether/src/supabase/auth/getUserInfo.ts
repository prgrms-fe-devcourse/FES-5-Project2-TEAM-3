/* Supabase Auth getSession */
/* Auth.User 테이블에서 매개변수로 받은 user의 정보를 가져옵니다. */
/* user는 현재 로그인 중인 사용자입니다. */

import { supabase } from "../supabase"

type UserField = 'id' | 'email' | 'name' | 'phone' ;

export const getUserInfo = async (targetField:UserField):Promise<string | null> => {
  const {
    data: { session },
    error
  } = await supabase.auth.getSession();

  if (error) {
    console.error('세션 조회 실패:', error.message);
    return null;
  }

  const user = session?.user;
  if (!user) return null;

  switch (targetField) {
    case 'id':
      return user.id;
    case 'email':
      return user.email ?? null;
    case 'name':
      return user.user_metadata.name ?? null;
    case 'phone':
      return user.phone ?? null;
    default:
      return null;
  }
}