import ReviewCard, { findReviewById } from "../../components/reviewCard/ReviewCard"
import S from './Review.module.css'
import type { Tables } from '../../components/reviewCard/supabase.type';
import { getData } from "../../components/reviewCard/SupaData";
import { useEffect, useState } from "react"
import ReviewCreate from "../../components/reviewCard/ReviewCreate";
import reviewDetailPopup from "../../components/ReviewDetailPopup/ReviewDetailPopup";
import ReviewDetailPopup from "../../components/ReviewDetailPopup/ReviewDetailPopup";

type Review = Tables<'review'>;
type Comment = Tables<'comment'>;
type Profile = Tables<'profile'>;

function Review() {
	const [reviewData, setReviewData] = useState<Review[] | null>();
	const [profileData, setProfileData] = useState<Profile[] | null>();
	const [commentData, setCommentData] = useState<Comment[] | null>();
	const [isPopupOpen, setIsPopupOpen] = useState(true);
	const [currentPopupReview, setCurrentPopupReview] = useState<Review>();

	async function generateData(){
		const data = await getData('review');
		const profile = await getData('profile');
		const comment = await getData('comment');
		setReviewData(data);
		setProfileData(profile);
		setCommentData(comment)
	}

	const closePopup = () => {
		setIsPopupOpen(false);
	}

	const activatePopup = (id : number) => {
		console.log('active Popup 실행');
		console.log('profileData : ', profileData);
		console.log('reviewData : ', reviewData);
		console.log('commentData : ', commentData);
		console.log('commentData : ', findReviewById(id, reviewData!));
		setIsPopupOpen(true);
		setCurrentPopupReview(findReviewById(id, reviewData!));
	}

	useEffect(() => {
    if (isPopupOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isPopupOpen]);

	useEffect(() => {
		generateData();
	}, [])

	return (
		<>
			<div className={S["heading-container"]}>
				<p className={S.heading}>Reviews and Rating</p>
			</div>
			<ReviewCreate reviewAdded={generateData}/>
			{(reviewData && profileData) && <ReviewCard reviewData={reviewData} profileData={profileData} activePopUp={activatePopup}/>}
			<div className={S["footer"]}></div>
			{isPopupOpen
			 && (profileData && reviewData && commentData && currentPopupReview)
			  && <ReviewDetailPopup profileData={profileData} reviewSingleData={currentPopupReview} commentData={commentData} closePopup={closePopup} reviewUpdate={generateData}/>}
		</>
	)
}
export default Review