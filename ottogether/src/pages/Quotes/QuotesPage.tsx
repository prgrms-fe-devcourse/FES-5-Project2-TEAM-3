import { useEffect, useState } from "react"
import type { Database } from "../../supabase/supabase.type";
import { getQuotes } from "../../util/getQuote";
import QuoteCard from "../../components/Quotes/QuoteCard";

type Quote = Database["public"]["Tables"]["quotes"]["Row"];

function QuotesPage() {

    const [quotes, setQuotes] = useState<Quote[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const data = await getQuotes();
            if(data){
                setQuotes(data);
            }
        };
        fetchData();
    },[]);

  return (
    <div>
        {quotes.map((quote) => (
        <QuoteCard
          key={quote.id}
          id={quote.id}
          content={quote.content}
          person={quote.person}
          likes={quote.likes ?? 0}
        />
      ))}
    </div>
  )
}

export default QuotesPage