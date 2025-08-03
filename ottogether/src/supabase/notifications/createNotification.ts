import type { Database } from "../supabase.type"
import { upsertTable } from "../upsertTable";

type NotificationType = Database['public']['Tables']['notifications']['Insert']

export const createNotification = async (notification:NotificationType) => {

  const { error } = await upsertTable({
    method: 'insert',
    tableName: 'notifications',
    uploadData: notification,
  });
  if (error) {
    console.error('알림 생성 실패:', error);
  }
}