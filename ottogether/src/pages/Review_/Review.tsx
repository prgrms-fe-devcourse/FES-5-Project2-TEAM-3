import ReviewCard, { findReviewById, findUserById } from "../../components/reviewCard/ReviewCard";
import S from './Review.module.css';
import type { Tables } from '../../supabase/supabase.type';
// import { getData } from "../../components/reviewCard/SupaData";
import { useEffect, useState } from "react";
import ReviewCreate from "../../components/reviewCard/ReviewCreate";
import ReviewDetailPopup from "../../components/reviewDetailPopup/reviewDetailPopup";
import { useLocation } from "react-router-dom";
import { supabase } from "../../supabase/supabase";


type Review = Tables<'review'>;
type Comment = Tables<'comment'>;
type Profile = Tables<'profile'>;

function Review() {
  const [reviewData, setReviewData] = useState<Review[] | null>(null);
  const [profileData, setProfileData] = useState<Profile[] | null>(null);
  const [commentData, setCommentData] = useState<Comment[] | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [currentPopupReview, setCurrentPopupReview] = useState<Review>();

  const location = useLocation();
  const highlightId = (location.state as { highlightId?: number })?.highlightId;

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
  };

  const activatePopup = (id: number) => {
    if (!reviewData) return;
    const targetReview = findReviewById(id, reviewData);
    if (targetReview) {
      setIsPopupOpen(true);
      setCurrentPopupReview(targetReview);
    }
  };

  useEffect(() => {
    generateData();
  }, []);

  useEffect(() => {
    if (reviewData && highlightId) {
      activatePopup(highlightId);
    }
  }, [reviewData, highlightId]);

  useEffect(() => {
    document.body.style.overflow = isPopupOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isPopupOpen]);

  return (
    <>
      <div className={S["heading-container"]}>
        <p className={S.heading}>Reviews and Rating</p>
      </div>
      <ReviewCreate reviewAdded={generateData} />
      {reviewData &&
        reviewData.map((element) => (
          <div key={element.id}>
            <ReviewCard
              reviewData={element}
              profileData={findUserById(element.user_id, profileData ?? [])}
              activePopUp={activatePopup}
            />
          </div>
        ))}
      <div className={S["footer"]}></div>
      {isPopupOpen && profileData && commentData && currentPopupReview && (
        <ReviewDetailPopup
          profileData={profileData}
          reviewSingleData={currentPopupReview}
          commentData={commentData}
          closePopup={closePopup}
          reviewUpdate={generateData}
        />
      )}
    </>
  );
}

export default Review;
