import { useEffect, useState } from "react"
import type { Database } from "../../supabase/supabase.type";
import { getQuotes } from "../../util/getQuote";
import QuoteCard from "../../components/Quotes/QuoteCard";
import QuoteCreate from "../../components/Quotes/QuoteCreate";
import SortBtn from "../../components/Quotes/SortBtn";
import S from "./QuotesPage.module.css";

type Quote = Database["public"]["Tables"]["quotes"]["Row"];

function QuotesPage() {

    const [quotes, setQuotes] = useState<Quote[]>([]);

    const fetchData = async () => {
    const data = await getQuotes();
    if (data) setQuotes(data);
  };

    useEffect(() => {
    fetchData();
  }, []);

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
        />
      ))}

      </div>
        
    </div>
  )
}

export default QuotesPage