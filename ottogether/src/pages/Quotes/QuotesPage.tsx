import { useEffect, useState } from "react"
import type { Database } from "../../supabase/supabase.type";
import { getQuotes } from "../../util/getQuote";
import QuoteCard from "../../components/Quotes/QuoteCard";
import QuoteCreate from "../../components/Quotes/QuoteCreate";
import SortBtn from "../../components/Quotes/SortBtn";

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
      <SortBtn onChange={handleSortChange} />
        <QuoteCreate onAdd={fetchData}/>
        {quotes.map((quote) => (
        <QuoteCard
          key={quote.id}
          id={quote.id}
          content={quote.content}
          person={quote.person}
          likes={quote.likes ?? 0}
          user_id={quote.user_id ?? ""}
          onRemove={handleRemove}
        />
      ))}
    </div>
  )
}

export default QuotesPage