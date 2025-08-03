import { useEffect, useState } from "react";
import { supabase } from "../../supabase/supabase";
import { useAuth } from "../../contexts/AuthProvider";
import S from "./MyPageVideos.module.css";
import type { MovieData } from "../../tmdbApi/movie.type";
import { fetchContentById } from "../../tmdbApi/fetchContentById";
import MovieCard from "../movieCard/MovieCard";

type Profile = {
  user_id: string;
  nickname: string | null;
};

function LikedVideoContents() {
  const { user } = useAuth();
  const [movies, setMovies] = useState<MovieData[]>([]);
  const [myProfile, setMyProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchLikedMovies = async () => {
      try {
        const { data: favoriteRows, error } = await supabase
          .from("favorite_movies")
          .select("movie_id")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;
        if (!favoriteRows || favoriteRows.length === 0) {
          setMovies([]);
          return;
        }

        const moviePromises = favoriteRows.map((row) =>
          fetchContentById(row.movie_id)
        );

        const movieResults = await Promise.all(moviePromises);
        const validMovies = movieResults.filter((m) => m !== null);

        setMovies(validMovies as MovieData[]);
      } catch (err) {
        console.error("좋아요한 콘텐츠 불러오기 실패:", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchMyProfile = async () => {
      try {
        const { data, error } = await supabase
          .from("profile")
          .select("user_id, nickname")
          .eq("user_id", user.id)
          .maybeSingle();

        if (error) throw error;
        setMyProfile(data);
      } catch (err) {
        console.error("내 프로필 불러오기 실패:", err);
      }
    };

    fetchLikedMovies();
    fetchMyProfile();
  }, [user]);

  if (!user) return <p className={S["notice"]}>로그인이 필요합니다.</p>;
  if (loading) return <p className={S["notice"]}>불러오는 중...</p>;
  if (movies.length === 0)
    return <p className={S["notice"]}>좋아요한 영화/드라마가 없습니다.</p>;

  return (
    <div className={S["video-container"]}>
      <h1 className={S["title"]}>
        {myProfile?.nickname ?? "Guest"} 님이 좋아요한 영화 / 드라마 (총 {movies.length}개)
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
