import { useEffect, useState } from "react";
import { getMovieDetail } from "../../tmdbApi";
import type { MovieDetailType } from "../../lib/movieDetailType";
import S from './ContentsDetail.module.css';
// import type { Tables } from '../../supabase/supabase.type';

interface Props{
	mediaId : number;
	mediaType : 'movie' | 'tv';
}

// type Review = Tables<'review'>;

function extractMovieDetail(fullMovieData: any): MovieDetailType {
  return {
    backdrop_path: fullMovieData.backdrop_path,
    production_companies: fullMovieData.production_companies,
    production_countries: fullMovieData.production_countries,
    genres: fullMovieData.genres,
    id: fullMovieData.id,
    overview: fullMovieData.overview,
    poster_path: fullMovieData.poster_path,
    release_date: fullMovieData.release_date,
    runtime: fullMovieData.runtime,
    tagline: fullMovieData.tagline,
    title: fullMovieData.title,
		original_language: fullMovieData.original_language,
  };
}

function ContentsDetail({mediaId, mediaType} : Props) {
	const IMAGE_URL = 'https://image.tmdb.org/t/p/original/'
	const [mediaData, setMediaData] = useState<MovieDetailType | null>(null);
	// const [currentReviewData, setCurrentReviewData] = useState<Review | null>(null);
	useEffect(() => {
		const dataUnboxing = async () => {
			let data;
			if (mediaType === 'movie')
			{
				data = await getMovieDetail(mediaId);
				setMediaData(extractMovieDetail(data));
			}
			else if (mediaType === 'tv')
			{
				data = await getMovieDetail(mediaId); //TODO : tv 패치 코드를 생성
				setMediaData(extractMovieDetail(data)); //TODO : data를 파싱하고 저장하는 코드 작성
			}
		}
		dataUnboxing();
	}, [])

	return (<>
		{ mediaData &&
			<>
			<img src={IMAGE_URL + mediaData.backdrop_path} alt="hero-section-image" />
			<div className={S["header"]}>
				<p>${mediaType}  /  ${mediaData.production_companies[0].name}</p>
				<h1>${mediaData.title}</h1>
				<div className={S["average-rate-container"]}>
					<img src="./star/fullStar.svg" alt="starIcon" />
					<p>현재 movieId를 가진 리뷰의 별점의 평균을 내는 함수</p>
				</div>
			</div>
			<div className={S["main-information"]}>
				<img src={IMAGE_URL + mediaData.poster_path} alt="main-poster-image" />
				<img src="./Favorite.svg" alt="favorite-icon" />
				<div className={S["text-info"]}>
					<h2>{mediaData.tagline}</h2>
					<p>{mediaData.overview}</p>
					<div className={S["data-item"]}>
						<p className={S.label}>Language</p>
						<p>{mediaData.original_language}</p>
					</div>
					<div className={S["data-item"]}>
						<p className={S.label}>Release Date</p>
						<p>{mediaData.release_date}</p>
					</div>
					<div className={S["data-item"]}>
						<p className={S.label}>Run time</p>
						<p>{mediaData.runtime}</p>
					</div>
					<div className={S["data-item"]}>
						<p className={S.label}>Genres</p>
						<p>{mediaData.genres.map(elem => elem.name).join(', ')}</p>
					</div>
				</div>
				<div className="rating-container">
					<h2>Rating</h2>
					<p>User rating</p>
					<img src="./star/fullStar.svg" alt="starIcon" />
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
export default ContentsDetail