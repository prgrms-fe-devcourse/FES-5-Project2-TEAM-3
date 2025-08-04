import MemberCard from '../../components/member/MemberCard'
import S from './Members.module.css'
import { useEffect, useState } from "react";
import type { Tables } from '../../supabase/supabase.type';
import { getData } from "../../components/reviewCard/SupaData"

type Profile = Tables<'profile'>;
type Review = Tables<'review'>;
type Quotes = Tables<'quotes'>;

function Members() {
	const [profileData, setProfileData] = useState<Profile[]>();
	const [reviewData, setReviewData] = useState<Review[] | null>();
	const [quotesData, setQuotesData] = useState<Quotes[] | null>();

	const [currentPageNum, setCurrentPage] = useState(1);
	const [profileCountPerPage] = useState(4);

	useEffect(()=>{
		async function generateData(){
			setProfileData(await getData('profile') as Profile[] | undefined);
			setReviewData(await getData('review') as Review[] | null);
			setQuotesData(await getData('quotes') as Quotes[] | null);
		}
		generateData()
	}, [])

	if (!profileData || profileData.length === 0){
		return <p>멤버 데이터를 찾을 수 없습니다 💀</p>
	}

	const indexOfLastProfile = currentPageNum * profileCountPerPage;
	const indexOfFirstProfile = indexOfLastProfile - profileCountPerPage;
	const currentProfile = profileData.slice(indexOfFirstProfile, indexOfLastProfile);
	const totalPageCount = Math.ceil(profileData.length / profileCountPerPage);

	const handlePageChange = (pageNum : number) => {
		if (pageNum >= 1 && pageNum <= totalPageCount)
			setCurrentPage(pageNum);
	}

	const movePreviousPage = () => {
		setCurrentPage(currentPageNum - 1);
	}
	const moveNextPage = () => {
		setCurrentPage(currentPageNum + 1);
	}

	const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxButtons = 5;

    const startPageGroup = Math.floor((currentPageNum - 1) / maxButtons) * maxButtons + 1;
    const endPageGroup = Math.min(startPageGroup + maxButtons - 1, totalPageCount);

    if (startPageGroup > 1) {
      pageNumbers.push(
        <button key="prev-group" onClick={() => handlePageChange(startPageGroup - 1)}>
          &lt;&lt;
        </button>
      );
    }

    for (let i = startPageGroup; i <= endPageGroup; i++) {
      pageNumbers.push(
        <button
          key={i}
          className={i === currentPageNum ? S['selected-btn'] : ''}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }

    if (endPageGroup < totalPageCount) {
      pageNumbers.push(
        <button key="next-group" onClick={() => handlePageChange(endPageGroup + 1)}>
          &gt;&gt;
        </button>
      );
    }

    return pageNumbers;
	};


	return (
		<div className={S['container']}>
			<div className={S['section-header']}>
				<button onClick={movePreviousPage} disabled={currentPageNum === 1}>&lt;</button>
				<p>···</p>
				<div className={S["button-group"]}>
					{renderPageNumbers()}
				</div>
				<p>···</p>
				<button onClick={moveNextPage} disabled={currentPageNum === totalPageCount}>&gt;</button>
			</div>
			<div className={S.divider}></div>
			{
				(profileData && reviewData && quotesData) && <MemberCard profileData={currentProfile} reviewData={reviewData} quotesData={quotesData}/>
			}
		</div>
	)
}
export default Members