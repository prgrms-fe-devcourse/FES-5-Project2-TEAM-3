import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getContentDetail } from "../../tmdbApi/getContentDetail";
import type { MovieData } from "../../tmdbApi/movie.type";

function MovieDetail() {
  const { mediaType, id } = useParams<{ mediaType: "movie" | "tv"; id: string }>();
  const [content, setContent] = useState<MovieData | null>(null);

  useEffect(() => {
    if (!mediaType || !id) return;

     // ✅ mediaType 유효성 검사
  if (mediaType !== "movie" && mediaType !== "tv") {
    console.error("❌ 잘못된 mediaType:", mediaType);
    return;
  }

    const fetchData = async () => {
      const data = await getContentDetail(mediaType, Number(id));
      console.log("✅ 상세 데이터", data); // 여기서 콘솔로 확인
      setContent(data);
    };

    fetchData();
  }, [mediaType, id]);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>디테일 페이지 테스트</h1>
      {content ? (
        <pre>{JSON.stringify(content, null, 2)}</pre>
      ) : (
        <p>로딩 중...</p>
      )}
    </div>
  );
}

export default MovieDetail