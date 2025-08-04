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
  shouldFetch: boolean;
}

type Profile = Database['public']['Tables']['profile']['Row'];
type ReviewData = Database['public']['Tables']['review']['Row'];
type QuotesData = Database['public']['Tables']['quotes']['Row'];

function SearchUser( { keyword, previewCount, onResult, shouldFetch }:SearchUserProps ) {

  const [ profileList, setProfileList ] = useState<Profile[]>([]);
  const [ reviewList, setReviewList ] = useState<ReviewData[]>([]);
  const [ quotesList, setQuotesList ] = useState<QuotesData[]>([]);
  const [ isLoading, setIsLoading ] = useState<boolean>(false);

  useEffect(() => {
    if (!keyword.trim()) return;
    if (!shouldFetch) return;

    const fetchData = async () => {
      setIsLoading(true);
      const { profiles, reviewData, quotesData } = await searchUserProfile(keyword);

      if (!previewCount) {
        setProfileList(profiles);
      } else {
        setProfileList(profiles.slice(0, previewCount));  
      }
      setQuotesList(quotesData);
      setReviewList(reviewData);

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