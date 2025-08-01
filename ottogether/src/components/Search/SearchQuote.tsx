import S from './SearchQuote.module.css';
import { useEffect, useState } from "react"
import type { Database } from "../../supabase/supabase.type";
import { searchQuotes } from "../../supabase/quotes/searchQuotes";
import SearchNotFound from './SearchNotFound';
import QuoteCard from '../Quotes/QuoteCard';
import SearchLoading from './SearchLoading';


interface SearchQuoteProps {
  keyword: string
}

type Quote = Database['public']['Tables']['quotes']['Row'];

function SearchQuote( { keyword }:SearchQuoteProps ) {

  const [ quotes, setQuotes ] = useState<Quote[]>([]);
  const [ isLoading, setIsLoading ] = useState(false);

  /* 검색한 키워드에 강조 표시 */
  const highlightKeyword = (content: string, keyword:string, snippetLength:number = 50) => {

    const shortenFromBegin = content.length > snippetLength * 2
        ? content.slice(0, snippetLength * 2) + '...'
        : content;

    if (!keyword.trim()) {
      return (<span>{shortenFromBegin}</span>)
    }
    
    const keywordStart = content.toLowerCase().indexOf(keyword.toLowerCase());
    const keywordEnd = keywordStart + keyword.length

    if (keywordStart === -1) {
      return (<span>{shortenFromBegin}</span>)
    } 

    const trimStart = Math.max(0, keywordStart - snippetLength);
    const trimEnd = Math.min(content.length, keywordEnd + snippetLength);
    const highlightBefore = content.slice(trimStart, keywordStart);
    const highlight = content.slice(keywordStart, keywordEnd);
    const highlightAfter = content.slice(keywordEnd, trimEnd);

    const prefix = trimStart > 0 ? '... ' : '';
    const suffix = trimEnd < content.length ? ' ...' : '';

    return (
        <span>{prefix}{highlightBefore}
          <strong key="keyword">{highlight}</strong>
        {highlightAfter}{suffix}</span>
    )
  }
  
  /* quotes fetch */
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
        <SearchLoading />
      }
      { !isLoading && quotes.length === 0 &&
        <SearchNotFound />
      }
      {
        !isLoading &&
        <div className={S["quotes-list"]}>
          {
            quotes.map((quote) => (
              <QuoteCard
                key={quote.id}
                quote={quote}
                onRemove={handleRemove}
                isSearch={true}
                highlight={highlightKeyword(quote.content, keyword, 12)}
               />
            ))
          }
        </div>
      } 
    </section>
  )
}
export default SearchQuote