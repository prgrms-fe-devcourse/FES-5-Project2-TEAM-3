import S from './SearchUser.module.css';
import { useEffect, useState } from "react"
import { searchUserProfile } from "../../supabase/profile/searchUserProfile";
import type { Database } from "../../supabase/supabase.type";
import SearchLoading from './SearchLoading';
import SearchNotFound from './SearchNotFound';
import MemberCard from '../member/MemberCard';


interface SearchUserProps {
  keyword: string;
  previewCount?: number;
  onResult?: (hasData:boolean) => void;
}

type Profile = Database['public']['Tables']['profile']['Row'];
type ReviewLike = Database['public']['Tables']['review_like']['Row'];
type QuotesLike = Database['public']['Tables']['quotes_like']['Row'];

function SearchUser( { keyword, previewCount, onResult }:SearchUserProps ) {

  const [ profileList, setProfileList ] = useState<Profile[]>([]);
  const [ reviewList, setReviewList ] = useState<ReviewLike[]>([]);
  const [ quotesList, setQuotesList ] = useState<QuotesLike[]>([]);
  const [ isLoading, setIsLoading ] = useState<boolean>(false);

  useEffect(() => {
    if (!keyword.trim()) return;

    const fetchData = async () => {
      setIsLoading(true);
      const { profiles, reviewLikes, quotesLikes } = await searchUserProfile(keyword);

      if (!previewCount) {
        setProfileList(profiles);
      } else {
        setProfileList(profiles.slice(0, previewCount));  
      }
      setQuotesList(quotesLikes);
      setReviewList(reviewLikes);

      if (onResult) {
        onResult(profiles.length > 0);
      }

      setIsLoading(false);
    }

    fetchData();
  }, [keyword, previewCount]);

  return (
    <section className={S["user-result-container"]}>
      { isLoading &&
        <SearchLoading />
      }
      { !isLoading && profileList.length === 0 && !previewCount &&
        <SearchNotFound keyword={keyword} tab='회원' />
      }
      {
        !isLoading && profileList.length > 0 && 
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