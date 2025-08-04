import ReviewCard, { findReviewById, findUserById } from "../../components/reviewCard/ReviewCard"
import S from './Review.module.css'
import type { Tables } from '../../supabase/supabase.type';
import { useEffect, useState } from "react"
import ReviewCreate from "../../components/reviewCard/ReviewCreate";
import ReviewDetailPopup from "../../components/ReviewDetailPopup/reviewDetailPopup";
import { supabase } from "../../supabase/supabase";

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
		const {data : reviewData, error:reviewError} = await supabase
				.from('review')
				.select('*')
				.order('created_at', {ascending: false});
		if (reviewError) {
			console.error('Erorr! 리뷰 데이터를 불러오는 중 오류 : ', reviewError);
			return;
		}
		setReviewData(reviewData);
		const {data : profileData, error:profileError} = await supabase
				.from('profile')
				.select('*')
				.order('created_at', {ascending: false});
		if (profileError) {
			console.error('Erorr! 프로필 데이터를 불러오는 중 오류 : ', profileError);
			return;
		}
		setProfileData(profileData);
		const {data : commentData, error:commentError} = await supabase
				.from('comment')
				.select('*')
				.order('created_at', {ascending: false});
		if (commentError) {
			console.error('Erorr! 댓글 데이터를 불러오는 중 오류 : ', commentError);
			return;
		}
		setCommentData(commentData);
	}

	const closePopup = () => {
		setIsPopupOpen(false);
	}

	useEffect(() => {
		setIsPopupOpen(false);
	}, [])

	const activatePopup = (id : number) => {
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
			{(reviewData && profileData) && reviewData.map(element => (
        <div key={element.id}>
          <ReviewCard
            reviewData={element}
            profileData={findUserById(element.user_id, profileData ?? undefined)}
            activePopUp={activatePopup}
          />
        </div>
      ))}
			<div className={S["footer"]}></div>
			{isPopupOpen
			 && (profileData && reviewData && commentData && currentPopupReview)
			  && <ReviewDetailPopup profileData={profileData} reviewSingleData={currentPopupReview} commentData={commentData} closePopup={closePopup} reviewUpdate={generateData}/>}
		</>
	)
}
export default Review