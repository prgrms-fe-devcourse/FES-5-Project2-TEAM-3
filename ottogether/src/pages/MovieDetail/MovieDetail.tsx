import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getContentDetail } from "../../tmdbApi/getContentDetail";
import type { MovieData } from "../../tmdbApi/movie.type";
import S from './MovieDetail.module.css';
import type { Tables } from '../../supabase/supabase.type';
import { supabase } from "../../supabase/supabase";
import RatingBarChart from "./RatingBarChart";
import { useAuth } from "../../contexts/AuthProvider";
import { isMovieLiked, toggleFavoriteMovie } from "../../util/toggleFavoriteMovie";
import { findUserById } from "../../components/reviewCard/ReviewCard";
import ProfileList from "./ProfileList";
import QuoteCard from "../../components/Quotes/QuoteCard";
import SmallReviewCard from "../../components/reviewCard/SmallReviewCard/SmallReviewCard";
import MovieLoading from "./MovieLoading/MovieLoading";

type Review = Tables<'review'>;
type Favorite = Tables<'favorite_movies'>;
type Profile = Tables<'profile'>;
type Quotes = Tables<'quotes'>;

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
	const {isAuth, user} = useAuth();
  const { mediaType, id } = useParams<{ mediaType: "movie" | "tv"; id: string }>();
  const [content, setContent] = useState<MovieData | null>(null);
	const IMAGE_URL = 'https://image.tmdb.org/t/p/original/';
	const [currentReviewData, setCurrentReviewData] = useState<Review[]>([]);
	const [isMyLove, setIsMyLove] = useState(false);
	const [favoriteUsers, setFavoriteUsers] = useState<Profile[]>([]);
	const [quotesData, setQuotesData] = useState<Quotes[]>([]);
	const [profileData, setProfileData] = useState<Profile[]>([]);
	const navigate = useNavigate();
	const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!mediaType || !id) return;

     // mediaType 유효성 검사
  if (mediaType !== "movie" && mediaType !== "tv") {
    console.error("❌ 잘못된 mediaType:", mediaType);
    return;
  }

    const fetchData = async () => {
      const data = await getContentDetail(mediaType, Number(id));
      setContent(data);
    };

    fetchData();
  }, []);

	useEffect(() => {
			const fetchLikedStatus = async () => {
				if (!id || !user || !mediaType) return ;
				const liked = await isMovieLiked(user.id, +id, mediaType);
				setIsMyLove(liked);
			};
	
			fetchLikedStatus();
		}, [id, user]);

	useEffect(() => {
	const dataLoading = async () => {
		if (!id)
			return ;
		try{
			const {data, error} = await supabase.from('review').select('*').eq('movie_id', +id).order('like_count', {ascending: false});
			if (error)
			{
				console.error('Error : 유저 데이터를 불러오는 중 에러 : ', error);
				return ;
			}
			setCurrentReviewData(data);
			const {data:profileLoad, error:profileError} = await supabase.from('profile').select('*');
			if (profileError)
			{
				console.error('Error : 프로필 데이터를 불러오는 중 에러 : ', profileError);
				return ;
			}
			setProfileData(profileLoad);
			const {data : favorData, error : favorError} = await supabase.from('favorite_movies').select('*').eq('movie_id', +id);
			if (favorError)
			{
				console.error('Error : 좋아요 누른 인원을 불러오는 중 에러 : ', favorError);
				return ;
			}
			findFavoriteUser(favorData,profileLoad);
			const {data : quoteData, error : quoteError} = await supabase.from('quotes').select('*').eq('movie_id', +id).order('likes', {ascending: false});
			if (quoteError)
			{
				console.error('Error : 명대사 불러오는 중 에러 : ', quoteError);
				return ;
			}
			setQuotesData(quoteData);
			}
			finally{
				setIsLoading(false);
			}
	}
	dataLoading();
	}, [id])

	const handleFavorite = async () => {
		if (!id || !mediaType)
			return ;
		if (!isAuth || !user)
		{
			alert('로그인이 필요한 서비스입니다.');
			navigate('/login');
    	return;
		}
		const result = await toggleFavoriteMovie(user.id, +id, mediaType);
		if (!result.error) {
      setIsMyLove(result.liked);
			if (result.liked) {
          const myProfile = findUserById(user.id, profileData);
          if (myProfile) {
              setFavoriteUsers((prev) => [...prev, myProfile]);
          }
      } else {
          setFavoriteUsers((prev) => prev.filter((profile) => profile.user_id !== user.id));
      }
    }
	}

	const findFavoriteUser = (favor : Favorite[], profileData : Profile[]) => {
		if (!profileData)
			return ;
		let temp : Profile[] = [];
		for (const element of favor) {
			const profile = findUserById(element.user_id!, profileData);
			if (profile)
				temp.push(profile);
		}
		setFavoriteUsers(temp);
	}

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

	const handleSeeAllReviews = () => {
		navigate(`/media/${mediaType}/${id}/review`);
	}

	const handleReviewCardClick = (reviewId : number) => {
		navigate(`/media/${mediaType}/${id}/review#review${reviewId}`, {
			state: { highlightId : reviewId }
		});
	}

	const handleMoreMembers = () => {
		navigate(`/media/${mediaType}/${id}/favorites`, {state: {users : favoriteUsers}});
	}

	const handleMoreQuotes = () => {
		navigate(`/media/${mediaType}/${id}/quotes`, { state: { quotes: quotesData } });
	}

	if (isLoading){
		return <MovieLoading />
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
						<button className={S["favorite-btn"]} onClick={handleFavorite}>
							{	!isMyLove &&
								<img src="/emptyFavorite.svg" alt="empty-favorite-icon" />
							}
							{isMyLove &&  <img src="/fullFavorite.svg" alt="favorite-icon" />}
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
					<div className={S["members-layout"]}>
						<div className={S["like-amount-container"]}>
							<p>Likes by</p>
							<p className={S["like-amount"]}>{favoriteUsers.length}</p>
						</div>
						<ProfileList profiles={favoriteUsers}></ProfileList>
						<button className={S["more-member"]} onClick={handleMoreMembers}>+</button>
					</div>
				</div>
				</div>
				<div className={S["reviews-container"]}>
					<div className={S["top-bar"]}>
						<h2>Reviews</h2>
						<button className={S["see-all"]} onClick={() => handleSeeAllReviews()}>See All</button>
					</div>
				{ currentReviewData.length !== 0 && 
					<div className={S["review-container"]}>
						{currentReviewData.slice(0, 2).map(elem => {
							const profile_ = findUserById(elem.user_id, profileData);
							if (!profile_) return null;
							return <SmallReviewCard key={elem.id} reviewData={elem} profileData={profile_} activePopUp={function (id: number): void {
								 handleReviewCardClick(id);
								} }/>})}
					</div>
				}
				{ currentReviewData.length === 0 &&
					<>
					<div className={S["notification-container"]}>
					<h2>아직 이 영화에 작성된 리뷰가 없습니다! 😭</h2>	
					</div>
					<button className={S["move-page"]} onClick={() => handleSeeAllReviews()}>리뷰 작성하러가기 →</button>
					</>
				}

				</div>
				<div className={S["quotes-container"]}>
					<div className={S["top-bar"]}>
						<h2>Favorite Quotes</h2>
						<button className={S["see-all"]} onClick={handleMoreQuotes}>See All</button>
					</div>
					{quotesData[0] && 
						<QuoteCard key={quotesData[0].id} quote={quotesData[0]} onRemove={(id : number) => (console.log(id))}></QuoteCard>
					}
					{
						!quotesData[0] &&
						<>
							<div className={S["notification-container"]}>
								<h2>아직 이 영화에 작성된 명대사가 없습니다! 🥲</h2>	
							</div>
							<button className={S["move-page"]} onClick={handleMoreQuotes}>명대사 작성하러가기 →</button>
						</>
					}
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