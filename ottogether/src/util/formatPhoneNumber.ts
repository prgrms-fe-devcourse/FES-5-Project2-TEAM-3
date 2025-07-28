/* 전화번호 input을 받아서 자동으로 하이픈을 넣는 함수 */
export const formatPhoneNumber = (input:string) => {
  if (input === '') return '';

  const inputNumber = input.replace(/\D/g, '');

  if (inputNumber.length < 4) return inputNumber;
  if (inputNumber.length < 7) {
    return `${inputNumber.slice(0,3)}-${inputNumber.slice(3)}`
  }
  if (inputNumber.length < 12) { 
    return `${inputNumber.slice(0,3)}-${inputNumber.slice(3,7)}-${inputNumber.slice(7,11)}`
  }
  return inputNumber;
}