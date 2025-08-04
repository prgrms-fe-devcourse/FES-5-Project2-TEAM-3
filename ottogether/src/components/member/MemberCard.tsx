import S from "./MemberCard.module.css"


import type { Tables } from '../../supabase/supabase.type';
import { formatDate } from "../../util/formatDate";

type Profile = Tables<'profile'>;
type Review = Tables<'review'>;
type Quotes = Tables<'quotes'>;

interface Props{
	profileData : Profile[],
	reviewData : Review[],
	quotesData : Quotes[],
	isSearch?: boolean;
}

function MemberCard({profileData, reviewData, quotesData, isSearch = false} : Props) {

	function onClickCell(data : Profile){
		console.log(data.user_id, ' cell clicked!');
	}

	const getUserReviewCount = (reviewData : Review[], userId : string) => {
		let count = 0;
		for (const element of reviewData) {
			if (element.user_id === userId)
				count++;
		}
		return count;
	}
	const getUserQuotesCount = (quotesData : Quotes[], userId : string) => {
		let count = 0;
		for (const element of quotesData) {
			if (element.user_id === userId)
				count++;
		}
		return count;
	}

	return (
		<div className={`${S.container} ${S.cell} ${isSearch ? S["search-container"] : ''}`}>
		{ 
		profileData && profileData.map(data => (
			<div key={data.user_id} className={`${S.cell} ${isSearch ? S["search-user"] : ''}`} onClick={() => onClickCell(data)}>
				<img className={S['profile-image']} src={data.avatar_url as string ?? "./beomTeacher.svg"} alt="profileImage" />
				<div>
					<h2>{data.nickname ?? 'Nickname'}</h2>
					<p className={S["joined"]}><strong>Joined :</strong> {formatDate(data.created_at)}</p>
					<p className={S["favorite-genre"]}><strong>Favorite Genre :</strong> {data.favorite_genre?.join(', ')}</p>
					<p className={S["total-reviews"]}><strong>Total Reviews :</strong> {getUserReviewCount(reviewData, data.user_id)}{ isSearch ? <br /> : " | " }<strong>Total Quotes :</strong> {getUserQuotesCount(quotesData, data.user_id)} </p>
				</div>
					<img className={S.arrow} src='/Chevron_right.svg' alt="rightArrow" />
			</div>
		))}
		</div>
	)
}
export default MemberCard