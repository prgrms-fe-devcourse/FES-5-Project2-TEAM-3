import S from './ReviewDetailPopup.module.css'
import type { Tables } from '../../components/reviewCard/supabase.type';
import { useAuth } from '../../contexts/AuthProvider';
import { formatDateNoYear } from '../../util/formatDate';
import { findUserById } from '../reviewCard/ReviewCard';
import StarRating from '../reviewCard/StarRating';
import { useState } from 'react';


type Review = Tables<'review'>;
type Comment = Tables<'comment'>;
type Profile = Tables<'profile'>;

interface Props{
	profileData : Profile[], 
	reviewSingleData : Review, 
	commentData : Comment[],
	closePopup : () => void,
}

function ReviewDetailPopup({profileData, reviewSingleData, commentData, closePopup} : Props) {
	const {isAuth, user} = useAuth();

	return (
		<div className={S["popup-container"]}>
			<header className={S.header}>
				<img className={S.close} src="./close.svg" onClick={closePopup} alt="closeButton"/>
				<div className={S.topbar}>
					<img className={S['user-avatar']} src={(findUserById(reviewSingleData.user_id, profileData)?.avatar_url ?? "./beomTeacher.svg")} alt="profile_image" />
					<p>{findUserById(reviewSingleData.user_id, profileData)?.nickname ?? 'User'} · {formatDateNoYear(reviewSingleData.updated_at!)}</p>
					{((isAuth && user) && (reviewSingleData.user_id == user.id)) && <img src="/YouBadge.svg" alt="isItMeCheck"></img>} 
					<div className={S['star-container']}>{StarRating(reviewSingleData.rating)}</div>
				</div>
			</header>
			<div className={S['text-content']}>
				<p>{reviewSingleData.text_content}</p>
				<div className={S["reaction-container"]}>
					<div className={S['reaction-item']}>
						<img src="/thumbsUp.svg" alt="ThumbsUpIcon" />
						<p>{reviewSingleData.like_count}</p>
					</div>
					<div className={S['reaction-item']}>
						<img src="/thumbsDown.svg" alt="ThumbsUpIcon" />
						<p>{reviewSingleData.dislike_count}</p>
					</div>
					<div className={S['reaction-item']}>
						<img src="/comment.svg" alt="commentIcon" />
						<p>{reviewSingleData.comment_count}</p>
					</div>
				</div>
			</div>
			<div className={S.divider}></div>
			<div className={S["comment-container"]}>
				<p>Comments</p>
				<div className={S["comment-input-container"]}>
					<input type="text" className={S['comment-input']} placeholder='Add Comments...'/>
					<button className={S.add}>Add</button>
				</div>
				{
					commentData.filter(elem => elem.review_id === reviewSingleData.id).map(comment => (
						<div className={S['comment-cell']}>
							<div className="comment-header">
								<div className={S.topbar}>
									<img className={S['user-avatar']} src={(findUserById(comment.user_id, profileData)?.avatar_url ?? "./beomTeacher.svg")} alt="profile_image" />
									<p>{findUserById(comment.user_id, profileData)?.nickname ?? 'User'} · {formatDateNoYear(comment.updated_at!)}</p>
									{((isAuth && user) && (comment.user_id == user.id)) && <img src="/YouBadge.svg" alt="isItMeCheck"></img>}
								</div>
								<div className={S["handler-btn-container"]}>
									
								</div>
							</div>
							<p>{comment.text_content}</p>
					</div>
					))
				}
			
			</div>
		</div>
	)
}
export default ReviewDetailPopup