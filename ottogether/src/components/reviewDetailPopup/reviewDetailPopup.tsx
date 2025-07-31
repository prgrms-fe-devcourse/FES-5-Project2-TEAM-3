import S from './ReviewDetailPopup.module.css'
import type { Tables } from '../../components/reviewCard/supabase.type';
import { useAuth } from '../../contexts/AuthProvider';
import { formatDateNoYear } from '../../util/formatDate';
import { findUserById } from '../reviewCard/ReviewCard';
import StarRating from '../reviewCard/StarRating';
import { useState } from 'react';
import { supabase } from '../../supabase/supabase';


type Review = Tables<'review'>;
type Comment = Tables<'comment'>;
type Profile = Tables<'profile'>;

interface Props{
	profileData : Profile[], 
	reviewSingleData : Review, 
	commentData : Comment[],
	closePopup : () => void,
	reviewUpdate : () => void,
}

/* 
	type Comment = {
			created_at: string;
			id: number;
			review_id: number;
			text_content: string;
			updated_at: string;
			user_id: string;
	}
*/

function ReviewDetailPopup({profileData, reviewSingleData, commentData, closePopup, reviewUpdate} : Props) {
	const {isAuth, user} = useAuth();
	const [commentInputOpen, setCommentInputOpen] = useState(false);
	const [content, setContent] = useState('');

	const handleEdit = () => {

	}
	const handleDelete = () => {

	}
	const increaseCommentCount = async (reviewId : number) => {
		if (!user)
			return ;
		console.log('current comment count : ', reviewSingleData.comment_count);
		console.log('targeted review id : ', reviewSingleData.id);
		console.log('매개변수 review id : ', reviewId);
		const {data, error} = await supabase.from('review').update({comment_count : (reviewSingleData.comment_count ?? 0) + 1}).eq('id', reviewId);
		if (error){
			console.error('Error :', error.message);
		}
		else{
			console.log('comment count increased! : ', data);
		}
	}
	const handleSubmit = async (reviewId : number) => {
		if (!content.trim()) return ;
		if (!isAuth)
		{
			alert('로그인 후 이용하실 수 있는 서비스입니다.');
			handleCancel();
			return ;
		}
		if (!user)
		{
			alert('유저를 찾을 수 없습니다.');
			handleCancel();
			return ;
		}
		const newComment = {
			text_content : content,
			user_id : user.id,
			review_id: reviewId, 
		}
		const { error } = await supabase.from('comment').insert(newComment);
		if (error){
			console.error('Error :', error.message);
		}
		else{
			handleCancel();
			reviewUpdate();
			increaseCommentCount(reviewId);
		}
	}
	const handleCancel = () => {
		setContent('');
		setCommentInputOpen(false);
	}

	return (
		<div className={S["popup-overlay"]}>
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
				{ !commentInputOpen && <div className={S["comment-fake-container"]} onClick={() => setCommentInputOpen(true)}>
					<div className={S['comment-input']}>Add Comments...</div>
						<button className={S.add}>Add</button>
					</div>}
				{commentInputOpen &&
				<div className={S["input-container"]}>
					<textarea
						className={S['review-input']}
						onChange={(e) => setContent(e.target.value)}
						placeholder="Click to add text."
						value={content}
						rows={5}
					></textarea>
					<div className={S["button-container"]}>
						<button className={S.add} onClick={() => handleSubmit(reviewSingleData.id)}>Add</button>
						<button onClick={handleCancel} className={S.cancel}>Cancel</button>
					</div>
				</div>
				}
				{
					commentData.filter(elem => elem.review_id === reviewSingleData.id).map(comment => (
						<div key={comment.id} className={S['comment-cell']}>
							<div className={S["comment-header"]}>
								<div className={S.topbar}>
									<img className={S['user-avatar']} src={(findUserById(comment.user_id, profileData)?.avatar_url ?? "./beomTeacher.svg")} alt="profile_image" />
									<p>{findUserById(comment.user_id, profileData)?.nickname ?? 'User'} · {formatDateNoYear(comment.updated_at!)}</p>
									{((isAuth && user) && (comment.user_id == user.id)) && <img src="/YouBadge.svg" alt="isItMeCheck"></img>}
								</div>
								{ comment.user_id === user?.id &&
									<div className={S["handler-btn-container"]}>
									<img src="./edit.svg" alt="editCommentButton" onClick={handleEdit}/>
									<img src="./trashcan.svg" alt="deleteCommentButton" onClick={handleDelete}/>
								</div>
								}
							</div>
							<p>{comment.text_content}</p>
					</div>
					))
				}
			
			</div>
		</div>
		</div>
	)
}
export default ReviewDetailPopup