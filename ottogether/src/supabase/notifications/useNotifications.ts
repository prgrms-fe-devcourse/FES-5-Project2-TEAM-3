import { useEffect, useState } from "react";
import { fetchNotifications, type Notification } from "./fetchNotification";
import { supabase } from "../supabase";

export function useNotifications(userId: string | null) {

  const [ notificatios, setNotifications ] = useState<Notification[]>([]);

  useEffect(() => {
    if(!userId) return;

    // 최초 로그인 시 fetch
    fetchNotifications(userId).then((notifications) => {
      if (notifications) {
        setNotifications(notifications);
      } else {
        setNotifications([]);
      }
    });

    // 이후 실시간 구독
    const channel = supabase
      .channel('notifications-realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}}`
        },
        (payload) => {
          console.log('새 알림 도착:', payload.new);
          setNotifications((prev) => [payload.new as Notification, ...prev]);
        }
      )
      .subscribe();

    // 클린업
    return () => {
      supabase.removeChannel(channel);
    }
  }, [userId]);

  return notificatios;
}