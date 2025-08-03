import { supabase } from "../supabase";
import type { PostgrestSingleResponse } from '@supabase/supabase-js';

export type Notification = {
  id: string;
  user_id: string;
  sender_id: string;
  target_id: string;
  type: string;
  is_read: boolean;
  message: string;
  created_at: string;
  sender?: {
    nickname: string;
    avatar_url: string | null;
  };
};

export const fetchNotifications = async (userId: string) => {
  const { data, error } = await (supabase
    .from('notifications')
    .select(`
      *,
      sender:sender_id!profile_user_id ( nickname, avatar_url )
      `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  ) as PostgrestSingleResponse<Notification[]>;

  if (error) {
    console.error('알림 불러오기 실패:', error.message);
  }

  return data;
}