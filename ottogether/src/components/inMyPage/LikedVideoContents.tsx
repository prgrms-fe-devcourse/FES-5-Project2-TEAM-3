import { useEffect, useState } from "react";
import { supabase } from "../../supabase/supabase";
import S from "./MyPageVideos.module.css";
import type { MovieData } from "../../tmdbApi/movie.type";
import { fetchContentById } from "../../tmdbApi/fetchContentById";
import MovieCard from "../movieCard/MovieCard";

type Profile = {
  user_id: string;
  nickname: string | null;
};

interface Props {
  user: { id: string; email?: string } | null;
  profile: Profile | null;
}

function LikedVideoContents({ user, profile }: Props) {
  const [movies, setMovies] = useState<MovieData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchLikedMovies = async () => {
      try {
        const { data: favoriteRows, error } = await supabase
          .from("favorite_movies")
          .select("movie_id, media_type")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;

        // null-safe 처리
        const movieIds = (favoriteRows ?? [])
          .map((row) => row.movie_id)
          .filter((id): id is number => id !== null);

        if (movieIds.length === 0) {
          setMovies([]);
          return;
        }

        // 각 영화/드라마 상세 가져오기
        const moviePromises = (favoriteRows ?? [])
          .filter((row) => row.movie_id !== null && row.media_type !== null)
          .map((row) => fetchContentById(row.movie_id!, row.media_type!));
        const movieResults = await Promise.all(moviePromises);
        const validMovies = movieResults.filter((m): m is MovieData => m !== null);

        setMovies(validMovies);
      } catch (err) {
        console.error("좋아요한 콘텐츠 불러오기 실패:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLikedMovies();
  }, [user]);

  if (!user) return <p className={S["notice"]}>로그인이 필요합니다.</p>;
  if (loading) return <p className={S["notice"]}>불러오는 중...</p>;
  if (movies.length === 0)
    return (
      <div className={S["video-container"]}>
        <h1 className={S["title"]}>
          {profile?.nickname ?? "Guest"} 님이 좋아요한 영화 / 드라마 (총 {movies.length}개)
        </h1>
        <hr />
        <p className={S["notice"]}>좋아요한 영화/드라마가 없습니다.</p>
      </div>
    );

  return (
    <div className={S["video-container"]}>
      <h1 className={S["title"]}>
        {profile?.nickname ?? "Guest"} 님이 좋아요한 영화 / 드라마 (총 {movies.length}개)
      </h1>
      <hr />
      <div className={S["video-grid"]}>
        {movies.map((movie) => (
          <MovieCard key={`${movie.media_type}-${movie.id}`} movie={movie} />
        ))}
      </div>
    </div>
  );
}

export default LikedVideoContents;
