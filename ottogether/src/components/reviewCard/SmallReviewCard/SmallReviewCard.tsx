
import type { Tables } from '../../../supabase/supabase.type';
import S from "./SmallReviewCard.module.css";
import StarRating from "../StarRating";
import { formatDateNoYear } from "../../../util/formatDate";
import { useAuth } from '../../../contexts/AuthProvider';
import toggleReviewThumbs from '../toggleReviewThumbs';
import { useEffect, useState } from 'react';
import { supabase } from '../../../supabase/supabase';
import { createNotification } from '../../../util/createNotifications';
import { useNavigate } from 'react-router-dom';

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

function SmallReviewCard({reviewData, profileData, activePopUp} : Prop) {

	const navigate = useNavigate();
	
	const {isAuth, user} = useAuth();
	const [isLiked, setIsLiked] = useState(false);
	const [likeCount, setLikeCount] = useState(0);
	if (!(reviewData && profileData))
	{
		console.error('Error : 올바르지 않은 프로필 혹은 리뷰입니다.', reviewData, '||', profileData);
		return ;
	}

	const handleThumb = async (input : 'like' | 'dislike') => {
  if (!isAuth) {
    alert('로그인이 필요한 서비스입니다.');
		navigate('/login');
    return;
  }
  
  const { liked, error } = await toggleReviewThumbs(reviewData.id, user!.id, input);
  
  if (error) {
    console.error('좋아요/싫어요 처리 중 오류:', error);
    return;
  }
  
  if (input === 'like') {
    setIsLiked(liked!);
    // if (liked && isDisLiked) setIsDisliked(false);
    
    setLikeCount(prev => liked ? prev + 1 : prev - 1);
    // if (isDisLiked) setDislikeCount(prev => prev - 1);



    if (liked && profileData.user_id && user && profileData.user_id !== user.id) {
        await createNotification({
          userId: profileData.user_id,
          senderId: user.id,
          type: "like_review",
          targetId: reviewData.id,
        });
      }

    
  } else {
    // setIsDisliked(liked!);
    if (liked && isLiked) setIsLiked(false);
    
    // setDislikeCount(prev => liked ? prev + 1 : prev - 1);
    if (isLiked) setLikeCount(prev => prev - 1);
  }
};

	useEffect(() => {
		const checkThumb = async () => {
			if (!user)
				return ;
			const { data } = await supabase
							.from('review_like')
							.select('*')
							.eq('user_id', user.id)
							.eq('review_id', reviewData.id)
							.maybeSingle();
			
		if (data?.reaction_type === 'like')
			setIsLiked(true);
		}

		if (reviewData && profileData)
		{
			setLikeCount(reviewData.like_count!);
			// setDislikeCount(reviewData.dislike_count!);
			checkThumb();
			// calculateCommentCount(reviewData.id, commentData);
		}
	}, [reviewData])
	
	return (
	<>
		<div className={S["card-container"]}>
		<header className={S.header}>
			<img className={S['user-avatar']} src={profileData.avatar_url ?? "./beomTeacher.svg"} alt="profile_image" />
			<p className={S['name-text']}>{profileData.nickname ?? 'Guest'}</p>
			{((isAuth && user) && profileData.user_id == user.id) && <img src="/YouBadge.svg" alt="isItMeCheck"></img>} 
			<div className={S['star-container']}>{StarRating(reviewData.rating)}</div>
		</header>
			<p className={S['date-text']}>{formatDateNoYear(reviewData.updated_at!)}</p>
		<main className={S['main-container']}>
			<p>{reviewData.text_content}</p>
		</main>
		<footer className={S.footer}>
			<div className={S['reaction-item']} onClick={() => handleThumb('like')}>
				<img src={isLiked ? "/thumbsUp.svg" : "/emptyThumbsUp.svg"} alt="ThumbsUpIcon" />
				<p>{likeCount}</p>
			</div>
			<div className={S['reaction-item']}>
				<img src="/comment.svg" alt="commentIcon" />
				{/* <p>{commentCount}</p> */}
			</div>
			<p className={S['read-more']} onClick={() => activePopUp(reviewData.id)}>Read More</p>
		</footer>
		</div>
	</>
	)
}
export default SmallReviewCard