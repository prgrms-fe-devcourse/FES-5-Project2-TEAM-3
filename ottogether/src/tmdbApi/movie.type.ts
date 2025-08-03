export type MovieData = {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
  genre_names?: string[];
  provider_logo_path?: string | null;
  backdrop_path: string | null;
  overview: string | null;
  media_type: 'movie' | 'tv';
	tagline : string;
	original_language : string;
};

export type Genre = {
  id: number;
  name: string;
};