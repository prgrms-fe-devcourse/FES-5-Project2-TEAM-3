import { useState } from "react"
import S from './ReviewCreate.module.css'

function ReviewCreate() {
	const [inputClicked, setInputClicked] = useState(true);

	const handleRating = () => {
		return <>
			<img src="./star/emptyStar.svg" alt="starRating" />
			<img src="./star/emptyStar.svg" alt="starRating" />
			<img src="./star/emptyStar.svg" alt="starRating" />
			<img src="./star/emptyStar.svg" alt="starRating" />
			<img src="./star/emptyStar.svg" alt="starRating" />
		</>
	}

	return (
		<div className={S["input-container"]}>
			<p>Rate this Backer and tell others what you think</p>	
			<div className={S["button-list"]}>
				{handleRating()}
				{!inputClicked && <p onClick={() => setInputClicked(true)} className={S["write-btn"]}>Write A Review →</p>}
			</div>
		{inputClicked &&
			<>
				<input className={S['review-input']} type="text" />
				<button className={S.add}>Add</button>
				<button onClick={() => setInputClicked(false)} className={S.cancel}>Cancel</button>
			</>
		}
		</div>
	)
}
export default ReviewCreate