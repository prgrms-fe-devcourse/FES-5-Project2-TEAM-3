import S from "./MemberCard.module.css"


import type { Tables } from '../reviewCard/supabase.type';
import { formatDate } from "../../util/formatDate";

type Profile = Tables<'profile'>;
type ReviewLike = Tables<'review_like'>;
type QuotesLike = Tables<'quotes_like'>;

interface Props{
	profileData : Profile[],
	reviewData : ReviewLike[],
	quotesData : QuotesLike[],
	isSearch?: boolean;
}

function MemberCard({profileData, reviewData, quotesData, isSearch = false} : Props) {

	function onClickCell(data : Profile){
		console.log(data.user_id, ' cell clicked!');
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
			quotesData.forEach(element => {
				if (element.user_id === user_id)
					count++;
			});
		}

		return count;
	}

	return (
		<div className={`${S.container} ${isSearch ? S["search-user"] : ''}`} >
		{ 
		profileData && profileData.map(data => (
			<div key={data.user_id} className={S.cell} onClick={() => onClickCell(data)}>
				<img className={S['profile-image']} src={data.avatar_url as string ?? "./beomTeacher.svg"} alt="profileImage" />
				<div>
					<h2>{data.nickname ?? 'Nickname'}</h2>
					<p className={S["joined"]}><strong>Joined :</strong> {formatDate(data.created_at)}</p>
					<p className={S["favorite-genre"]}><strong>Favorite Genre :</strong> {data.favorite_genre?.join(', ')}</p>
					<p className={S["total-reviews"]}><strong>Total Reviews :</strong> {getUserLikeCount(data.user_id, "review")}{ isSearch ? <br /> : "|" }<strong>Total Quotes :</strong> {getUserLikeCount(data.user_id, "quotes")} </p>
				</div>
					<img className={S.arrow} src='/Chevron_right.svg' alt="rightArrow" />
			</div>
		))}
		</div>
	)
}
export default MemberCard