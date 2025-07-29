function StarRating(amount : number){
	let ret = [];
	if (amount < 1)
		return ;
	for (let index = 1; index <= 5; index++) {
		if (index <= amount)
			ret.push(<img src="/star/fullStar.svg" alt="starRateImage"></img>)
		else
			ret.push(<img src="/star/emptyStar.svg" alt="starRateImage"></img>)
	}

	return (
		<>
			{ret}
		</>
	)
}
export default StarRating