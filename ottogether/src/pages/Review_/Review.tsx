import ReviewCard from "../../components/reviewCard/ReviewCard"
import S from './Review.module.css'
import type { Tables } from '../../components/reviewCard/supabase.type';
import { getData } from "../../components/reviewCard/SupaData";
import { useEffect, useState } from "react"
import ReviewCreate from "../../components/reviewCard/ReviewCreate";

type Review = Tables<'review'>;
type Comment = Tables<'comment'>;
type Profile = Tables<'profile'>;

function Review() {
	const [reviewData, setReviewData] = useState<Review[] | null>();
	const [profileData, setProfileData] = useState<Profile[] | null>();
	const [commentData, setCommentData] = useState<Comment[] | null>();
	
	async function generateData(){
		const data = await getData('review');
		const profile = await getData('profile');
		setReviewData(data);
		setProfileData(profile);
		console.log('profile : ', profile);
	}
	useEffect(() => {
		generateData();
	}, []) //TODO : 리뷰가 생성되면 useEffect가 업데이트 되어야 할듯

	return (
		<>
			<div className={S["heading-container"]}>
				<p className={S.heading}>Reviews and Rating</p>
			</div>
			<ReviewCreate reviewAdded={generateData}/>
			{(reviewData && profileData) && <ReviewCard reviewData={reviewData} profileData={profileData}/>}
			<div className={S["footer"]}></div>
		</>
	)
}
export default Review