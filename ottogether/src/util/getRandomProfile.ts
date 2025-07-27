/* default header image, avatar image 중 랜덤한 하나의 url을 반환하는 함수 */

import { defaultAvatars, defaultHeaders } from "../lib/defaultProfile"

export const getRandomHeader = ():string => {
  const randomIndex = Math.floor(Math.random() * defaultHeaders.length);

  return defaultHeaders[randomIndex].publicUrl;
}

export const getRandomAvatar = ():string => {
  const randomIndex = Math.floor(Math.random() * defaultAvatars.length);

  return defaultAvatars[randomIndex].publicUrl;
}
