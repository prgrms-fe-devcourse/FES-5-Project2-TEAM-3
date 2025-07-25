import S from "./MemberCard.module.css"
import { getData } from "../review_/SupaData"
import type { Tables, TablesInsert, TablesUpdate } from '../review_/supabase.type';
import { useEffect, useState } from "react";
import { formatIsoToDdMonthYyyy } from "../../util/formatIsoToDdMonthYyyy";

type Profile = Tables<'profile'>;

function MemberCard() {

	const [profileData, setProfileData] = useState<Profile[] | null>();

	useEffect(()=>{
		async function generateData(){
			const data = await getData('profile');

			setProfileData(data);
			console.log('profileData : ', data);
		}
		generateData()
	}, [])

	function onClickCell(data : Profile){
		console.log(data.nickname, ' cell clicked!');
	}

	return (
		<div className={S.container}>
		{ 
		profileData && profileData.map(data => (
			<div key={data.user_id} className={S.cell} onClick={() => onClickCell(data)}>
				<img src={data.profile_image_url as string} alt="profileImage" />
				<div>
					<h2>{data.nickname}</h2>
					<p><strong>Joined :</strong> {formatIsoToDdMonthYyyy(data.joined_time)}</p>
					<p><strong>Favorite Genre :</strong> {data.favorite_genre?.join(', ')}</p>
					<p><strong>Total Reviews :</strong> 0 | <strong>Total Quotes :</strong> 0 </p>
				</div>
					<img className={S.arrow} src='/Chevron_right.svg' alt="rightArrow" />
			</div>
		))}
		</div>
	)
}
export default MemberCard