import S from './SearchQuote.module.css';
import { useEffect, useState } from "react"
import type { Database } from "../../supabase/supabase.type";
import { searchQuotes } from "../../supabase/quotes/searchQuotes";
import SearchNotFound from './SearchNotFound';
import QuoteCard from '../Quotes/QuoteCard';


interface SearchQuoteProps {
  keyword: string
}

type Quote = Database['public']['Tables']['quotes']['Row'];

function SearchQuote( { keyword }:SearchQuoteProps ) {

  const [ quotes, setQuotes ] = useState<Quote[]>([]);
  const [ isLoading, setIsLoading ] = useState(false);

  useEffect(() => {
    if(!keyword.trim()) return;

    const fetchQuotes = async () => {
      setIsLoading(true);
      const data = await searchQuotes(keyword);
      setQuotes(data);
      setIsLoading(false);
    };

    fetchQuotes();
  }, [keyword]);

  const handleRemove = (id: number) => {
    setQuotes((prevQuotes) => prevQuotes.filter((quote) => quote.id !== id));
  };

  return (
    <section className={S["quote-result-container"]}>
      { isLoading && 
        <div className={S.loader}>
          <div className={S["loading-spinner"]}></div>
          <p className={S["loading-message"]}>검색 결과를 불러오고 있어요 🔍</p> 
        </div>
      }
      { !isLoading && quotes.length === 0 &&
        <SearchNotFound />
      }
      {
        !isLoading &&
        <ul className={S["quotes-list"]}>
          {
            quotes.map((quote) => (
              <QuoteCard
                key={quote.id}
                quote={quote}
                onRemove={handleRemove}
                className={S["search-quotes"]}
               />
            ))
          }
        </ul>
      } 
    </section>
  )
}
export default SearchQuote