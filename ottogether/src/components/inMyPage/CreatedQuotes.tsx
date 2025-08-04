import { useEffect, useState } from "react";
import { supabase } from "../../supabase/supabase";
import QuoteCard from "../Quotes/QuoteCard";
import type { Database } from "../../supabase/supabase.type";
import S from "./MyPageQuotes.module.css";

interface UserType {
  id: string;
  email?: string;
}

interface ProfileType {
  nickname: string | null;
  bio: string | null;
  url: string | null;
  avatar_url: string | null;
  header_url: string | null;
}

interface Props {
  user: UserType | null;
  profile: ProfileType | null;
}

type Quote = Database["public"]["Tables"]["quotes"]["Row"];

function formatDate(dateString: string | null): string {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

function CreatedQuotes({ user, profile }: Props) {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchCreatedQuotes = async () => {
      try {
        const { data, error } = await supabase
          .from("quotes")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setQuotes(data || []);
      } catch (error) {
        console.error("내가 작성한 명대사 불러오기 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCreatedQuotes();
  }, [user]);

  const handleRemove = (id: number) => {
    setQuotes((prev) => prev.filter((quote) => quote.id !== id));
  };

  if (!user) return <p className={S["my-notice"]}>로그인이 필요합니다.</p>;
  if (loading) return <p className={S["my-notice"]}>불러오는 중...</p>;
  if (quotes.length === 0)
    return (
      <div className={S["my-container"]}>
      <h1 className={S["my-title"]}>
        {profile?.nickname ?? "Guest"} 님이 작성한 명대사
        <hr />
      </h1>
      <p className={S["my-notice"]}>작성한 명대사가 없습니다.</p>
      </div>
  );

  const quotesWithFlags = quotes.map((quote, idx) => {
    const currentDate = formatDate(quote.created_at);
    const prevDate =
      idx > 0 ? formatDate(quotes[idx - 1].created_at) : null;
    return {
      ...quote,
      showDate: currentDate !== prevDate,
      currentDate,
    };
  });

  return (
    <div className={S["my-container"]}>
      <h1 className={S["my-title"]}>
        {profile?.nickname ?? "Guest"} 님이 작성한 명대사
        <hr />
      </h1>
      {quotesWithFlags.map((quote) => (
        <div
          key={quote.id}
          className={`${S["my-quote-wrapper"]} ${
            quote.showDate ? S["my-new-date-group"] : ""
          }`}
        >
          {quote.showDate && <p className={S["my-date"]}>{quote.currentDate}</p>}
          <QuoteCard quote={quote} onRemove={handleRemove} />
        </div>
      ))}
    </div>
  );
}

export default CreatedQuotes;
