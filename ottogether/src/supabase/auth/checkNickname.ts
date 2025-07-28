/* supabase Profile 테이블에서 중복된 닉네임이 있는지 검사합니다. */

import { supabase } from "../supabase"

export const checkNicknameExists = async (nickname: string):Promise<boolean> => {
  const { data, error } = await supabase
    .from('profile')
    .select('nickname')
    .eq('nickname', nickname)
    .maybeSingle();

  if (error) {
    console.error('중복 닉네임 확인 실패:', error);
    return false;
  }

  return !!data;
};