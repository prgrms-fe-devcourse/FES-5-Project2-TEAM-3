import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getContentDetail } from "../../tmdbApi/getContentDetail";
import type { MovieData } from "../../tmdbApi/movie.type";
import S from './MovieDetail.module.css';
import type { Tables } from '../../supabase/supabase.type';
import { supabase } from "../../supabase/supabase";
import RatingBarChart from "./RatingBarChart";

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
	const [currentReviewData, setCurrentReviewData] = useState<Review[] | null>(null);

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

	const dataLoading = async () => {
		if (!id)
			return ;
		const {data, error} = await supabase.from('review').select('*').eq('movie_id', id);
		if (error)
		{
			console.error('Error : 데이터를 불러오는 중 에러 : ', error);
			return ;
		}
		setCurrentReviewData(data);
	}

	useEffect(() => {
		async function dataInit(){
			// const profile = await getData('profile');
			// const quotes = await getData('quotes');
			// setProfileData(profile);
			// setQuotesData(quotes);
			dataLoading();
		}
		dataInit();
	}, [])

	const getAverageRate = () => {
		let sum = 0;
		if (!currentReviewData || currentReviewData.length === 0)
			return sum;
		for (const element of currentReviewData) {
			sum += element.rating;
		}
		sum /= currentReviewData.length;

		return sum.toFixed(2);
	}

 return (<>
		{ content &&
			<>
			<div className={S["hero-section"]}>
				<img className={S["hero-section-image"]} src={IMAGE_URL + content.backdrop_path} alt="hero-section-image" />
				<div className={S["header"]}>
					<h1>{content.title}</h1>
					<div className={S["average-rate-container"]}>
						<img className={S["star-icon"]} src="/star/fullStar.svg" alt="starIcon" />
						<p>{getAverageRate()}</p>
					</div>
				</div>
			</div>
			<div className={S["information"]}>
				<div className={S["main-information"]}>
				<div className={S["poster-wrapper"]}>
					<img className={S['main-poster-image']} src={IMAGE_URL + content.poster_path} alt="main-poster-image" />
						<button className={S["favorite-btn"]}>
							<img src="/favorite.svg" alt="favorite-icon" />
						</button>
				</div>

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
						<p className={S.label}>Media Type</p>
						<p>{content.media_type}</p>
					</div>
					<div className={S["data-item"]}>
						<p className={S.label}>Genres</p>
						<p>{content.genre_names!.join(', ')}</p>
					</div>
					</div>
				</div>

			
			<div className={S["additional-info"]}>
				<div className={S["rating-favorites"]}>

				<div className={S["rating-container"]}>
					<h2>Rating</h2>
					<div className={S["rate-layout"]}>
						<div className={S["rate-wrap"]}>
							<p>User rating</p>
							<div className={S["rate-container"]}>
								<img src="/star/fullStar.svg" alt="starIcon" />
								<p>{getAverageRate()}</p>
							</div>
						</div>
						{RatingBarChart(currentReviewData)}
					</div>
				</div>
				<div className={S["members-container"]}>
					<h2>Favorites</h2>
					<p>Likes by</p>
					{/* <p>이 영화를 좋아하는 사람 수</p> */}
					{/* 영화를 좋아하는 유저 프로필 사진 (최대 4개) */}
					<button className={S["more-member"]}>+</button>
				</div>
				</div>
				<div className={S["reviews-container"]}>
					<h2>Reviews</h2>
					<button className={S["see-all"]}>See All</button>
					{/* ReviewCard를 커스텀한 컴포넌트 개발해야할듯? */}
				</div>
				<div className={S["quotes-container"]}>
					<h2>Favorite Quotes</h2>
					<button className={S["see-all"]}>See All</button>
					{/* 영화 ID를 받아서 Quote db의 가장 많이 좋아요를 받은 Quote를 받은 뒤, QuoteCard 출력하는 함수 */}
				</div>
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