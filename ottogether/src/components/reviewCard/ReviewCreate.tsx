import { useState } from "react"
import S from './ReviewCreate.module.css'
import { useAuth } from "../../contexts/AuthProvider";
import type { User } from "@supabase/supabase-js";
import { supabase } from "../../supabase/supabase";

interface Props{
	reviewAdded : () => void;
}

function ReviewCreate({reviewAdded} : Props) {
	const [inputClicked, setInputClicked] = useState(false);
	const [content, setContent] = useState('');
	const [rating, setRating] = useState(5);
	const {isAuth, user} = useAuth();

/*
	type Review = {
			comment_count: number | null;
			created_at: string;
			dislike_count: number | null;
			id: number;
			like_count: number | null;
			movie_id: number | null;
			rating: number;
			text_content: string | null;
			updated_at: string | null;
			user_id: string;
	}
*/

	const handleSubmit = async () => {
		if (!content.trim()) return ;
		if (!isAuth)
		{
			alert('로그인 후 이용하실 수 있는 서비스입니다.');
			handleCancel();
			return ;
		}
		if (!user)
		{
			alert('유저를 찾을 수 없습니다.');
			handleCancel();
			return ;
		}
		const newReview = {
			rating,
			text_content : content,
			user_id : user.id,
		}
		const { error } = await supabase.from('review').insert(newReview);
		if (error){
			console.error('Error :', error.message);
		}
		else{
			handleCancel();
			reviewAdded();
		}

	}

	const handleCancel = () => {
		setInputClicked(false);
		setContent('');
		setRating(5);
	}

	const handleRating = (score : number) => {
		setRating(score);
	}

	const renderRating = () => {
		return<div className={S["star-container"]}>
			{
				[1,2,3,4,5].map(num => (
					<img key={num} src={num <= rating ? "./star/fullStar.svg" : "./star/emptyStar.svg"} alt="starRating" onClick={() => handleRating(num)}/>
				))
			}
		</div>
	}

	return (
		<div className={S["input-container"]}>
			<p>Rate this Backer and tell others what you think</p>	
			<div className={`${S['button-list']} ${inputClicked? S['input-mode'] : ''}`}>
				{renderRating()}
				{!inputClicked && <p onClick={() => setInputClicked(true)} className={S["write-btn"]}>Write A Review →</p>}
			</div>
		{inputClicked &&
			<>
				<input className={S['review-input']} type="text" onChange={(e) => setContent(e.target.value)} placeholder="Click to add text."/>
				<div className={S["button-container"]}>
					<button className={S.add} onClick={handleSubmit}>Add</button>
					<button onClick={handleCancel} className={S.cancel}>Cancel</button>
				</div>
			</>
		}
		</div>
	)
}
export default ReviewCreate