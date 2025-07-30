// default filter 여부를 판단

import { genreListTotal, ottListTotal } from "../lib/data";

const RATING_MIN = 0;
const RATING_MAX = 5;

export const isDefaultFilter = (
  selectedOtt: string[],
  selectedGenres: string[],
  ratingMin: number,
  ratingMax: number,
  releaseFrom: string,
  releaseTo: string
) => {
  return (
    selectedOtt.length === ottListTotal.length &&
    selectedGenres.length === genreListTotal.length &&
    ratingMin === RATING_MIN &&
    ratingMax === RATING_MAX &&
    releaseFrom === '' &&
    releaseTo === ''
  )
}