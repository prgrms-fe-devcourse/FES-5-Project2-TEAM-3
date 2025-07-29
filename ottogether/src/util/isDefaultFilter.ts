// default filter 여부를 판단

import { genreListTotal, ottListTotal } from "../lib/data";

const RATING_MIN = 0;
const RATING_MAX = 5;
const ottList = ottListTotal;
const genreList = genreListTotal;

export const isDefaultFilter = (
  selectedOtt: string[],
  selectedGenres: string[],
  ratingMin: number,
  ratingMax: number,
  releaseFrom: string,
  releaseTo: string
) => {
  return (
    selectedOtt.length === ottList.length &&
    selectedGenres.length === genreList.length &&
    ratingMin === RATING_MIN &&
    ratingMax === RATING_MAX &&
    releaseFrom === '' &&
    releaseTo === ''
  )
}