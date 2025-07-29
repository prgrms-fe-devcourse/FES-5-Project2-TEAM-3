import { useEffect, useState } from "react"
import type { Tables } from '../review_/supabase.type';
import { getData } from "./SupaData";
import S from "./ReviewCard.module.css";
import StarRating from "./StarRating";
import { formatDateNoYear } from "../../util/formatDate";

type Review = Tables<'review'>;
type Comment = Tables<'comment'>;

function ReviewCard() {
	const [reviewData, setReviewData] = useState<Review[] | null>();
	const [commentData, setCommentData] = useState<Comment[] | null>();

	useEffect(() => {
		async function generateData(){
			const data = await getData('review');
			setReviewData(data);
			console.log('review : ', data);
		}
		generateData();
	}, []) //TODO : 리뷰가 생성되면 useEffect가 업데이트 되어야 할듯
	
	return (
		/* TODO : (element.user_id == 1004)에서 1004 대신 현재 접속중인 유저 ID로 치환하기 */
		<>
		{
			reviewData && reviewData.map(element => (
				<div className={S["card-container"]}>
				<header>
					<img src="" alt="profile_image" />
					<p>{element.user_id} · {formatDateNoYear(element.updated_at!)}</p>
					{(element.user_id == '1004') && <img src="/YouBadge.svg" alt="isItMeCheck"></img>} 
					{StarRating(element.rating)}
				</header>
				<main>
					<p>{element.text_content}</p>
				</main>
				<footer>
					<img src="/thumbsUp.svg" alt="ThumbsUpIcon" />
					<p>{element.like_count}</p>
					<img src="/thumbsDown.svg" alt="ThumbsUpIcon" />
					<p>{element.dislike_count}</p>
					<img src="/comment.svg" alt="commentIcon" />
					<p>{element.comment_count}</p>
				</footer>
				</div>
			))
		}
		</>
	)
}
export default ReviewCard