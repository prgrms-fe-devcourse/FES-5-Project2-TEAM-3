import S from "./MemberCard.module.css"
import { getData } from "../review_/SupaData"
import type { Tables } from '../review_/supabase.type';
import { useEffect, useState } from "react";
import { formatDate } from "../../util/formatDate";

type Profile = Tables<'profile'>;
type ReviewLike = Tables<'review_like'>;
type QuotesLike = Tables<'quotes_like'>;

function MemberCard() {

	const [profileData, setProfileData] = useState<Profile[] | null>();
	const [reviewData, setReviewData] = useState<ReviewLike[] | null>();
	const [quotesData, setQuotesData] = useState<QuotesLike[] | null>();

	useEffect(()=>{
		async function generateData(){
			setProfileData(await getData('profile'));
			setReviewData(await getData('review_like'));
			setQuotesData(await getData('quotes_like'));
		}
		generateData()
	}, [])

	function onClickCell(data : Profile){
		console.log(data.nickname, ' cell clicked!');
	}

	function getUserLikeCount(user_id : string, type : "review" | 'quotes') : number{
		let count = 0;

		if (type === 'review'){
			reviewData?.forEach(element => {
				if (element.user_id === user_id)
					count++;
		});
		}
		else{
			quotesData?.forEach(element => {
				if (element.user_id === user_id)
					count++;
			});
		}

		return count;
	}

	return (
		<div className={S.container}>
		{ 
		profileData && profileData.map(data => (
			<div key={data.user_id} className={S.cell} onClick={() => onClickCell(data)}>
				<img className={S['profile-image']} src={data.avatar_url as string ?? "./beomTeacher.svg"} alt="profileImage" />
				<div>
					<h2>{data.nickname ?? 'Nickname'}</h2>
					<p><strong>Joined :</strong> {formatDate(data.created_at)}</p>
					<p><strong>Favorite Genre :</strong> {data.favorite_genre?.join(', ')}</p>
					<p><strong>Total Reviews :</strong> {getUserLikeCount(data.user_id, "review")} | <strong>Total Quotes :</strong> {getUserLikeCount(data.user_id, "quotes")} </p>
				</div>
					<img className={S.arrow} src='/Chevron_right.svg' alt="rightArrow" />
			</div>
		))}
		</div>
	)
}
export default MemberCard