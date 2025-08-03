import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getContentDetail } from "../../tmdbApi/getContentDetail";
import type { MovieData } from "../../tmdbApi/movie.type";
import S from './MovieDetail.module.css';
import type { Tables } from '../../components/reviewCard/supabase.type';

type Review = Tables<'review'>;

/*
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
};

export type Genre = {
  id: number;
  name: string;
};
*/

function MovieDetail() {
  const { mediaType, id } = useParams<{ mediaType: "movie" | "tv"; id: string }>();
  const [content, setContent] = useState<MovieData | null>(null);
	const IMAGE_URL = 'https://image.tmdb.org/t/p/original/';
	const [currentReviewData, setCurrentReviewData] = useState<Review | null>(null);

  useEffect(() => {
    if (!mediaType || !id) return;

     // ✅ mediaType 유효성 검사
  if (mediaType !== "movie" && mediaType !== "tv") {
    console.error("❌ 잘못된 mediaType:", mediaType);
    return;
  }

    const fetchData = async () => {
      const data = await getContentDetail(mediaType, Number(id));
      console.log(`✅ ${mediaType} 상세 데이터`, data); // 여기서 콘솔로 확인
      setContent(data);
    };

    fetchData();
  }, [mediaType, id]);

 return (<>
		{ content &&
			<>
			<img className={S["hero-section-image"]} src={IMAGE_URL + content.backdrop_path} alt="hero-section-image" />
			<div className={S["header"]}>
				<p>${mediaType}</p>
				<h1>${content.title}</h1>
				<div className={S["average-rate-container"]}>
					<img src="/star/fullStar.svg" alt="starIcon" />
					<p>현재 movieId를 가진 리뷰의 별점의 평균을 내는 함수</p>
				</div>
			</div>
			<div className={S["main-information"]}>
				<img className={S['main-poster-image']} src={IMAGE_URL + content.poster_path} alt="main-poster-image" />
				<button className={S["favorite-btn"]}>
					<img src="/favorite.svg" alt="favorite-icon" />
				</button>
				<div className={S["text-info"]}>
					<h2>{content.tagline}</h2>
					<p>{content.overview}</p>
					<div className={S["data-item"]}>
						<p className={S.label}>Language</p>
						<p>{content.original_language}</p>
					</div>
					<div className={S["data-item"]}>
						<p className={S.label}>Release Date</p>
						<p>{content.release_date}</p>
					</div>
					<div className={S["data-item"]}>
						<p className={S.label}>Run time</p>
						{/* <p>{content.runtime}</p> */}
					</div>
					<div className={S["data-item"]}>
						<p className={S.label}>Genres</p>
						<p>{content.genre_names!.join(', ')}</p>
					</div>
				</div>
				<div className="rating-container">
					<h2>Rating</h2>
					<p>User rating</p>
					<img src="/star/fullStar.svg" alt="starIcon" />
					{/* <p>별점</p> */}
					{/*  */}
				</div>
				<div className="members-container">
					<h2>Favorites</h2>
					<p>Likes by</p>
					{/* <p>이 영화를 좋아하는 사람 수</p> */}
					{/* 영화를 좋아하는 유저 프로필 사진 (최대 4개) */}
					<button className={S["more-member"]}>+</button>
				</div>
				<div className="reviews-container">
					<h2>Reviews</h2>
					<button className={S["see-all"]}>See All</button>
					{/* ReviewCard를 커스텀한 컴포넌트 개발해야할듯? */}
				</div>
				<div className="quotes-container">
					<h2>Favorite Quotes</h2>
					<button className={S["see-all"]}>See All</button>
					{/* 영화 ID를 받아서 Quote db의 가장 많이 좋아요를 받은 Quote를 받은 뒤, QuoteCard 출력하는 함수 */}
				</div>
			</div>
			</>
		}
		</>
	)
}

export default MovieDetail

/* 영화 필요한 데이터 : 
	backdrop path
	genres
	id
	overview
	release date
	runtime
	title
	original language
	poster path
 */

/* TV
 backdrop path
 episode run time
 genres
 first air date ~ last air date
 id
 original language
	name
	poster path
	overview
*/