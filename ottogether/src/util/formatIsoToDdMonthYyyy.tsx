export function formatIsoToDdMonthYyyy(isoString: string): string {
  try {
    const date = new Date(isoString);

    // Date 객체가 유효한지 확인 (잘못된 문자열인 경우 'Invalid Date' return)
    if (isNaN(date.getTime())) {
      console.error("formatIsoToDdMonthYyyy: Invalid date string provided.", isoString);
      return "Invalid Date";
    }

    // Intl.DateTimeFormat을 사용하여 포맷팅
    // 'en-US' 로케일로 영어 월 이름을 가져오고, numeric/long 옵션으로 포맷 지정
    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',   // 일: 숫자 (ex: 23)
      month: 'long',    // 월: 문자열 (ex: July)
      year: 'numeric',  // 년도: 숫자 (ex: 2025)
    };

    return new Intl.DateTimeFormat('en-US', options).format(date);
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Date Formatting Error";
  }
}