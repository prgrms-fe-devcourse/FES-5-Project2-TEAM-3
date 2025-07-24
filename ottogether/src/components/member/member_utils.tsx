export function formatIsoToDdMonthYyyy(isoString: string): string {
  try {
    const date = new Date(isoString);

    // Date 객체가 유효한지 확인 (잘못된 문자열인 경우 'Invalid Date'가 됨)
    if (isNaN(date.getTime())) {
      console.error("formatIsoToDdMonthYyyy: Invalid date string provided.", isoString);
      return "Invalid Date"; // 또는 다른 오류 처리 방식
    }

    // Intl.DateTimeFormat을 사용하여 포맷팅
    // 'en-US' 로케일로 영어 월 이름을 가져오고, numeric/long 옵션으로 포맷 지정
    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',   // 일: 숫자 (예: 23)
      month: 'long',    // 월: 긴 이름 (예: July)
      year: 'numeric',  // 년도: 숫자 (예: 2025)
      // timeZone: 'UTC' // Supabase에서 가져오는 시간은 UTC이므로, UTC 기준으로 포맷팅하고 싶을 때 사용
                        // 이 옵션을 사용하지 않으면, 브라우저/시스템의 로컬 시간대로 자동 변환되어 포맷팅됩니다.
                        // 질문에 '22 July, 2025'가 나왔는데, 입력된 ISO 날짜는 23일입니다.
                        // 이는 아마도 로컬 시간대가 UTC보다 이전 시간대일 경우에 일자가 변경될 수 있기 때문입니다.
                        // 따라서, 출력 '22 July'가 필요하다면, 시간대 처리가 중요합니다.
    };

    // 로케일을 'en-US'로 지정하여 영어 월 이름을 얻고, 날짜 부분을 포맷팅합니다.
    // 만약 항상 'UTC' 기준의 날짜(일)를 포맷하고 싶다면, options에 timeZone: 'UTC'를 추가하세요.
    // 하지만 "22 July"처럼 일자가 하루 전으로 나오는 결과는 UTC 기준이 아닌,
    // 특정 로컬 시간대 (예: UTC-XX)로 변환되었을 때 발생할 수 있습니다.
    return new Intl.DateTimeFormat('en-US', options).format(date);

  } catch (error) {
    console.error("Error formatting date:", error);
    return "Date Formatting Error";
  }
}