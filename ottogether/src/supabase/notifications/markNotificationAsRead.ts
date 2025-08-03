import { upsertTable } from "../upsertTable"

export const markNotificationAsRead = async (id: string) => {
  try {
    const { error } = await upsertTable({
      method: 'update',
      tableName: 'notifications',
      uploadData: { id: id, is_read: true },
      matchKey: "id"
    });

    if(error) { 
      console.error('알림 읽음 처리 업데이트 실패:', error.message);
      throw error;
    }
  } catch (err) {
    console.error('알림 읽음 처리 업데이트 실패:', err);
  }
}