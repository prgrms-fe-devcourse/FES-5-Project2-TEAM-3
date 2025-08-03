
import type { Tables } from './supabase.type';
import S from "./ReviewCard.module.css";
import StarRating from "./StarRating";
import { formatDateNoYear } from "../../util/formatDate";
import { useAuth } from '../../contexts/AuthProvider';

type Review = Tables<'review'>;
type Profile = Tables<'profile'>;

interface Prop{
	reviewData : Review,
	profileData : Profile | undefined,
	activePopUp : (id : number) => void
}

export function findUserById(inputId : string, profileData : Profile[]) : Profile | undefined{
	return profileData?.find(profile => profile.user_id !== null && profile.user_id === inputId);
}

export function findReviewById(inputId : number, reviewData : Review[]) : Review | undefined{
	return reviewData?.find(review => review.id !== null && review.id === inputId);
}

function ReviewCard({reviewData, profileData, activePopUp} : Prop) {
	const {isAuth, user} = useAuth();

	const handleLike = () => {
		if (!isAuth)
		{
			alert('로그인이 필요한 서비스입니다.');
			return ;
		}

	}
	const handleDislike = () => {

	}

	
	return (
		<>
		{ (reviewData && profileData) &&
				<div className={S["card-container"]}>
				<header className={S.header}>
					<img className={S['user-avatar']} src={profileData.avatar_url ?? "./beomTeacher.svg"} alt="profile_image" />
					<p>{profileData.nickname ?? 'Guest'} · {formatDateNoYear(reviewData.updated_at!)}</p>
					{((isAuth && user) && profileData.user_id == user.id) && <img src="/YouBadge.svg" alt="isItMeCheck"></img>} 
					<div className={S['star-container']}>{StarRating(reviewData.rating)}</div>
				</header>
				<main>
					<p>{reviewData.text_content}</p>
				</main>
				<footer className={S.footer}>
					<div className={S['reaction-item']} onClick={handleLike}>
						<img src="/thumbsUp.svg" alt="ThumbsUpIcon" />
						<p>{reviewData.like_count}</p>
					</div>
					<div className={S['reaction-item']} onClick={handleDislike}>
						<img src="/thumbsDown.svg" alt="ThumbsUpIcon" />
						<p>{reviewData.dislike_count}</p>
					</div>
					<div className={S['reaction-item']}>
						<img src="/comment.svg" alt="commentIcon" />
						<p>{reviewData.comment_count}</p>
					</div>
					<p className={S['read-more']} onClick={() => activePopUp(reviewData.id)}>Read More</p>
				</footer>
				</div>
		}
		</>
	)
}
export default ReviewCard