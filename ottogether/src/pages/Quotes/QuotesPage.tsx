import { useEffect, useState } from "react"
import type { Database } from "../../supabase/supabase.type";
import { getQuotes } from "../../util/getQuote";
import QuoteCard from "../../components/Quotes/QuoteCard";
import QuoteCreate from "../../components/Quotes/QuoteCreate";
import SortBtn from "../../components/Quotes/SortBtn";
import S from "./QuotesPage.module.css";
import { useLocation } from "react-router-dom";

type Quote = Database["public"]["Tables"]["quotes"]["Row"];

function QuotesPage() {

    const [quotes, setQuotes] = useState<Quote[]>([]);
    const [highlightId, setHighlightId] = useState<number | null>(null);
    const location = useLocation();
		const receivedQuotes = location.state?.quotes as Quote[] | undefined;

    const fetchData = async () => {
			if (receivedQuotes)
				setQuotes(receivedQuotes);
			else
			{
    		const data = await getQuotes();
    		if (data) setQuotes(data);
			}
  	};

    useEffect(() => {
    fetchData();
  }, [receivedQuotes]);


  useEffect(() => {
    if (location.state?.highlightId) {
      setHighlightId(Number(location.state.highlightId));
    }
  }, [location.state]);


  const handleRemove = (id: number) => {
  setQuotes((prevQuotes) => prevQuotes.filter((quote) => quote.id !== id));
};

const handleSortChange = async (option: { sortBy: "created_at" | "likes"; order: "asc" | "desc" }) => {
  const data = await getQuotes(option);
  if (data) setQuotes(data);
};


  return (
    <div>
      <div className={S.headerWrapper}>
        <div className={S.header}>
          <h2 className={S.title}>Favorite Quotes</h2>
          <div className={S.sortBtnWrapper}>
            <SortBtn onChange={handleSortChange} />
          </div>
        </div>
        <div className={S.divider} />
      </div>
      <div>
        <QuoteCreate onAdd={fetchData}/>
        {quotes.map((quote) => (
          <QuoteCard
            key={quote.id}
            quote={quote}
            onRemove={handleRemove}
            className={highlightId === quote.id ? S.highlight : ""} 
          />
      ))}

      </div>
        
    </div>
  )
}

export default QuotesPage