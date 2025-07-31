import { genreMap } from "../lib/genreMap"

export type GenreCategory = keyof typeof genreMap;

export const getGenreId = (genreList: string[], category:GenreCategory): number[] => {
  const map = genreMap[category];

  return genreList
    .map(name => map.find(g => g.name === name)?.id)
    .filter((id): id is Exclude<typeof map[number]['id'], undefined> => typeof id === 'number');
}