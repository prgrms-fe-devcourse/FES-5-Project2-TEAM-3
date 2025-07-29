/* Supabase Insert/Update Data */
/* tableName과 data를 받아 해당 테이블에 data를 insert/update 합니다. */

import { supabase } from "./supabase";
import type { Database } from "./supabase.type";

type Method = 'insert' | 'update' | 'upsert';
type Payload = Record<string, any>;
type TableName = keyof Database['public']['Tables'];

type UpsertArgs = {
  method?: Method,
  tableName: TableName,
  uploadData: Payload,
  matchKey?: string // 테이블 update 시 match 조건
}

export const upsertTable = async ( {
  method = 'upsert',
  tableName,
  uploadData,
  matchKey
}:UpsertArgs ) => {

  const query = supabase.from(tableName);

  // 새로 데이터 추가(insert)만 할 경우
  if (method === 'insert') {
    const { data: result, error } = await query.insert(uploadData);
    return { result, error };
  }

  // 기존 데이터 수정(update)만 할 경우
  if (method === 'update') {
    if(!matchKey || !uploadData[matchKey]) {
      throw new Error('update 시에는 matchKey(예: user_id)와 해당 값이 필요합니다.')
    }
    const { [matchKey]: matchValue, ... rest } = uploadData;
    const { data: result, error } = await query.update(rest).eq(matchKey, matchValue);

    return { result, error };
  }

  // 만약 기존 데이터가 있으면 update, 없으면 insert를 할 경우
  if (method === 'upsert') {
    if(!matchKey || !uploadData[matchKey]) {
      throw new Error('upsert 시에는 matchKey(예: user_id)가 필요하며, 해당 데이터의 값이 uploadData에 포함되어 있어야 합니다.')
    }

    const matchValue = uploadData[matchKey];

    // 기존 데이터 조회
    const { data: existingRow, error: fetchError } = await query
      .select('*')
      .eq(matchKey, matchValue)
      .single();
    
    if (fetchError && fetchError.code !== 'PGRST116') {
      // PGRST116 = no rows found
      return { result: null, error: fetchError };
    }

    // 병합: 기존 데이터 + 새로운 데이터 (겹치는 건 덮어씀)
    const mergedData = {
      ...( existingRow ?? {} ),
      ...uploadData
    };

    const { data: result, error } = await query.upsert(mergedData, {
      onConflict: matchKey,
    });

    return { result, error };
  }
  
  throw new Error('method는 insert, update, upsert 중 하나여야합니다.')
}