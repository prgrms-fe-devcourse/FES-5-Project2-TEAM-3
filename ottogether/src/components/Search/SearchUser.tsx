import S from './SearchUser.module.css';
import { useEffect, useState } from "react"
import { searchUserProfile } from "../../supabase/profile/searchUserProfile";
import type { Database } from "../../supabase/supabase.type";
import SearchLoading from './SearchLoading';
import SearchNotFound from './SearchNotFound';
import MemberCard from '../member/MemberCard';


interface SearchUserProps {
  keyword: string
}

type Profile = Database['public']['Tables']['profile']['Row'];
type ReviewLike = Database['public']['Tables']['review_like']['Row'];
type QuotesLike = Database['public']['Tables']['quotes_like']['Row'];

function SearchUser( {keyword}:SearchUserProps ) {

  const [ profileList, setProfileList ] = useState<Profile[]>([]);
  const [ reviewList, setReviewList ] = useState<ReviewLike[]>([]);
  const [ quotesList, setQuotesList ] = useState<QuotesLike[]>([]);
  const [ isLoading, setIsLoading ] = useState<boolean>(false);

  useEffect(() => {
    if (!keyword.trim()) return;

    const fetchData = async () => {
      setIsLoading(true);
      const { profiles, reviewLikes, quotesLikes } = await searchUserProfile(keyword);
      setProfileList(profiles);
      setReviewList(reviewLikes);
      setQuotesList(quotesLikes);
      setIsLoading(false);
    }

    fetchData();
  }, [keyword]);
  return (
    <section className={S["user-result-container"]}>
      { isLoading && 
        <SearchLoading />
      }
      { !isLoading && profileList.length === 0 &&
        <SearchNotFound />
      }
      {
        !isLoading &&
        <div className={S["user-list"]}>
          {
            <MemberCard
              profileData={profileList}
              reviewData={reviewList}
              quotesData={quotesList}
              isSearch={true}
             />
          }
        </div>
      } 
    </section>
  )
}
export default SearchUser