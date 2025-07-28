/* Supabase Storage Upload Image */
/* Supabase Storage에 파일을 업로드합니다. */
/* Storage 버킷 이름과, 파일, 버킷 내에 저장할 파일 이름을 변수로 받습니다. */

import { supabase } from "../supabase"

interface Args {
  bucketName: string,
  file: File,
  path: string
}
export const uploadImage = async ( { bucketName, file, path }:Args ):Promise<{ success: boolean, url?: string, error?:string }> => {
  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: true,
    });

  if (error) {
    return { success: false, error: error.message }
  }

  const { data: urlData } = supabase.storage
    .from(bucketName)
    .getPublicUrl(path);
  
  return { success: true, url: urlData.publicUrl }
}