import S from './ReviewDetailPopup.module.css'
import type { Tables } from '../../supabase/supabase.type';
import { useAuth } from '../../contexts/AuthProvider';
import { formatDateNoYear } from '../../util/formatDate';
import { findUserById } from '../ReviewCard/ReviewCard';
import StarRating from '../ReviewCard/StarRating';
import { useEffect, useState } from 'react';
import { supabase } from '../../supabase/supabase';
import { createNotification } from '../../util/createNotifications';


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
	const [commentTextContent, setCommentTextContent] = useState('');
	const [reviewTextContent, setReviewTextContent] = useState('');
	const [commentCount, setCommentCount] = useState(0);
	const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
	const [reviewEditOpen, setReviewEditOpen] = useState(false);
	const [rating, setRating] = useState(5);

	const handleEditComment = async (commentId : number) => {
		if (!user)
			return ;
		if (!commentTextContent.trim())
		{
			alert('내용을 입력해주세요!')
			return ;
		}
		const {error} = await supabase.from('comment').update({text_content : commentTextContent}).eq('id', commentId);
		if (error){
			console.error('Error :', error.message);
		}
		else{
			handleCancel();
			reviewUpdate();
		}
	}

	const handleEditReview = async (reviewId : number) => {
		if (!user)
			return ;
		if (!reviewTextContent.trim())
		{
			alert('내용을 입력해주세요!')
			return ;
		}
		const {error} = await supabase.from('review').update({text_content : reviewTextContent, rating}).eq('id', reviewId);
		if (error){
			console.error('Error :', error.message);
		}
		else{
			handleCancel();
			closePopup();
			reviewUpdate();
		}
	}

	const handleDeleteComment = async (reviewId : number, commentId : number) => {
		if (!user)
		{
			alert('로그인 후 사용할 수 있는 서비스입니다!');
			return ;
		}
		if (!confirm('정말 삭제하시겠습니까?'))
			return ;
		const {error} = await supabase.from('comment').delete().eq('id', commentId);
		if (error)
		{
			console.error('Error ! : ', error);
			return ;
		}
		else{
			await increaseOrDecraseCommentCount(reviewId, false);
			reviewUpdate();
		}
	}

	const handleDeleteReview = async (reviewId : number) => {
		if (!user)
		{
			alert('로그인 후 사용할 수 있는 서비스입니다!');
			return ;
		}
		if (!confirm('정말 삭제하시겠습니까?'))
			return ;
		const {error} = await supabase.from('review').delete().eq('id', reviewId);
		if (error)
		{
			console.error('Error ! : ', error);
			return ;
		}
		else{
			closePopup();
			reviewUpdate();
		}
	}

	const increaseOrDecraseCommentCount = async (reviewId : number, isIncrease : boolean) => {
		if (!user)
			return ;
		let temp = 0;
		if (isIncrease)
			temp = commentCount + 1;
		else
			temp = commentCount - 1;	
		const {error} = await supabase.from('review').update({comment_count : temp}).eq('id', reviewId);
		if (error){
			console.error('Error :', error.message);
		}
		else{
			setCommentCount(temp);
		}
	}
	const handleSubmit = async (reviewId : number) => {
		if (!commentTextContent.trim()) return ;
		if (!isAuth)
		{
			alert('로그인 후 사용할 수 있는 서비스입니다!');
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
			text_content : commentTextContent,
			user_id : user.id,
			review_id: reviewId, 
		}
		const { error } = await supabase.from('comment').insert(newComment);
		if (error){
			console.error('Error :', error.message);
		}
		else{
			await increaseOrDecraseCommentCount(reviewId, true);



      if (reviewSingleData.user_id && reviewSingleData.user_id !== user.id) {
        const { data: senderProfile } = await supabase
          .from("profile")
          .select("nickname")
          .eq("user_id", user.id)
          .single();

        const senderName = senderProfile?.nickname ?? "Guest";

        await createNotification({
          userId: reviewSingleData.user_id,
          senderId: user.id,
          type: "comment",
          targetId: reviewId,
          message: `${senderName}님이 회원님의 리뷰에 댓글을 남겼습니다.`,
        });
      }



			handleCancel();
			reviewUpdate();
		}
	}
	const handleCancel = () => {
		setCommentTextContent('');
		setCommentInputOpen(false);
		setEditingCommentId(null);
		setReviewEditOpen(false);
	}

	const openNewCommentInput = () => {
		if (editingCommentId)
		{
			setCommentTextContent('');
			setEditingCommentId(null);
		}
		setCommentInputOpen(true);
	}
	const openEditComment = (commentId : number, prev_text : string) => {
		if (commentInputOpen)
		{
			setCommentTextContent('');
			setCommentInputOpen(false);
		}
		setEditingCommentId(commentId);
		setCommentTextContent(prev_text);
	}

	const openEditReview = (prevText : string) => {
		setReviewEditOpen(true)
		setReviewTextContent(prevText);
	}

	const handleRating = (score : number) => {
		setRating(score);
	}

	const renderRating = () => {
		return<div className={S["star-container-edit"]}>
			{
				[1,2,3,4,5].map(num => (
					<img key={num} src={num <= rating ? "./star/fullStar.svg" : "./star/emptyStar.svg"} alt="starRating" onClick={() => handleRating(num)}/>
				))
			}
		</div>
	}


	useEffect(()=> {
		if (reviewSingleData)
		{
			setCommentCount(reviewSingleData.comment_count!);
			setRating(reviewSingleData.rating);
		}

	}, [])

	return (
		<div className={S["popup-overlay"]}>
		<div className={S["popup-container"]}>
			<header className={S.header}>
				<img className={S.close} src="./close.svg" onClick={closePopup} alt="closeButton"/>
				<div className={S.topbar}>
					<img className={S['user-avatar']} src={(findUserById(reviewSingleData.user_id, profileData)?.avatar_url ?? "./beomTeacher.svg")} alt="profile_image" />
					<p>{findUserById(reviewSingleData.user_id, profileData)?.nickname ?? 'User'} · {formatDateNoYear(reviewSingleData.updated_at!)}</p>
					{((isAuth && user) && (reviewSingleData.user_id == user.id)) && 
						<>
							<img className={S.you} src="/YouBadge.svg" alt="isItMeCheck"></img>
							{!reviewEditOpen &&
							<>
								<div className={S["handler-btn-container"]}>
								<img src="./edit.svg" alt="editReviewButton" onClick={() => openEditReview(reviewSingleData.text_content!)}/>
								<img src="./trashcan.svg" alt="deleteReviewButton" onClick={() => handleDeleteReview(reviewSingleData.id)}/>
							</div>
							<div className={S['star-container']}>{StarRating(reviewSingleData.rating)}</div>
							</>
							}
						</>
					} 
				</div>
			</header>
			<div className={S['text-comment-text-container']}>
				{!reviewEditOpen && <div className={S["text-content-container"]}><p>{reviewSingleData.text_content}</p></div>}
				{reviewEditOpen &&
				<div className={S["edit-container"]}>
					{renderRating()}
					<textarea
					className={S['review-input']}
					onChange={(e) => setReviewTextContent(e.target.value)}
					rows={4}
					>{reviewTextContent}</textarea>
					<div className={S["button-container-edit-review"]}>
						<button className={S.add} onClick={() => handleEditReview(reviewSingleData.id)}>Edit</button>
						<button onClick={handleCancel} className={S.cancel}>Cancel</button>
					</div>
				</div>
				}
				{!reviewEditOpen && <div className={S["reaction-container"]}>
					<div className={S['reaction-item']}>
						<img src="/thumbsUp.svg" alt="ThumbsUpIcon" />
						<p>{reviewSingleData.like_count}</p>
					</div>
					{/* <div className={S['reaction-item']}>
						<img src="/thumbsDown.svg" alt="ThumbsUpIcon" />
						<p>{reviewSingleData.dislike_count}</p>
					</div> */}
					<div className={S['reaction-item']}>
						<img src="/comment.svg" alt="commentIcon" />
						<p>{commentCount}</p>
					</div>
				</div>}
			</div>
			<div className={S.divider}></div>
			<div className={S["comment-container"]}>
				<p>Comments</p>
				{ !commentInputOpen && <div className={S["comment-fake-container"]} onClick={() => openNewCommentInput()}>
					<div className={S['comment-input']}>Add Comments...</div>
						<button className={S.add}>Add</button>
					</div>}
				{commentInputOpen &&
				<div className={S["input-container"]}>
					<textarea
						className={S['review-input']}
						onChange={(e) => setCommentTextContent(e.target.value)}
						placeholder="Click to add text."
						value={commentTextContent}
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
								{ comment.user_id === user?.id && editingCommentId !== comment.id &&
									<div className={S["handler-btn-container"]}>
										<img src="./edit.svg" alt="editCommentButton" onClick={() => openEditComment(comment.id, comment.text_content)}/>
										<img src="./trashcan.svg" alt="deleteCommentButton" onClick={() => handleDeleteComment(reviewSingleData.id, comment.id)}/>
									</div>
								}
							</div>
							{ editingCommentId !== comment.id && <p>{comment.text_content}</p>}
							{ editingCommentId === comment.id &&
							<>
								<textarea
									className={S['review-input']}
									onChange={(e) => setCommentTextContent(e.target.value)}
									value={commentTextContent}
									rows={5}
								>{commentTextContent}</textarea>
								<div className={S["button-container-edit"]}>
									<button className={S.add} onClick={() => handleEditComment(comment.id)}>Edit</button>
									<button onClick={handleCancel} className={S.cancel}>Cancel</button>
								</div>
							</>
							}

					</div>
					))
				}
			
			</div>
		</div>
		</div>
	)
}
export default ReviewDetailPopup