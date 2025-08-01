
import type { Tables } from './supabase.type';
import S from "./ReviewCard.module.css";
import StarRating from "./StarRating";
import { formatDateNoYear } from "../../util/formatDate";
import { useAuth } from '../../contexts/AuthProvider';

type Review = Tables<'review'>;
type Profile = Tables<'profile'>;

interface Prop{
	reviewData : Review[],
	profileData : Profile[],
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

	
	return (
		/* TODO : (element.user_id == 1004)에서 1004 대신 현재 접속중인 유저 ID로 치환하기 */
		<>
		{
			reviewData && reviewData.map(element => (
				<div key={element.id} className={S["card-container"]}>
				<header className={S.header}>
					<img className={S['user-avatar']} src={findUserById(element.user_id, profileData)?.avatar_url ?? "./beomTeacher.svg"} alt="profile_image" />
					<p>{findUserById(element.user_id, profileData)?.nickname ?? 'User'} · {formatDateNoYear(element.updated_at!)}</p>
					{((isAuth && user) && element.user_id == user.id) && <img src="/YouBadge.svg" alt="isItMeCheck"></img>} 
					<div className={S['star-container']}>{StarRating(element.rating)}</div>
				</header>
				<main>
					<p>{element.text_content}</p>
				</main>
				<footer className={S.footer}>
					<div className={S['reaction-item']}>
						<img src="/thumbsUp.svg" alt="ThumbsUpIcon" />
						<p>{element.like_count}</p>
					</div>
					<div className={S['reaction-item']}>
						<img src="/thumbsDown.svg" alt="ThumbsUpIcon" />
						<p>{element.dislike_count}</p>
					</div>
					<div className={S['reaction-item']}>
						<img src="/comment.svg" alt="commentIcon" />
						<p>{element.comment_count}</p>
					</div>
					<p className={S['read-more']} onClick={() => activePopUp(element.id)}>Read More</p>
				</footer>
				</div>
			))
		}
		</>
	)
}
export default ReviewCard