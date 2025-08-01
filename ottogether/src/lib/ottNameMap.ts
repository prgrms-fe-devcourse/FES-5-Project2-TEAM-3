import type { ottListTotal } from "./data";

type OttName = typeof ottListTotal[number];

export const ottNameMap: Record<OttName, string> = {
  "Netflix": "Netflix",
  "Tving": "TVING",
  "DisneyPlus": "Disney Plus",
  "Wavve": "wavve",
  "Watcha": "Watcha",
  "CoupangPlay": "쿠팡플레이",
  "AppleTV": "Apple TV+",
  "PrimeVideo": "Amazon Prime Video",
};
