import ReviewCard from "../../components/review_/ReviewCard"
import S from './Review.module.css'

function Review() {
	return (
		<>
		<p className={S.heading}>Reviews and Rating</p>
		<ReviewCard />
		</>
	)
}
export default Review