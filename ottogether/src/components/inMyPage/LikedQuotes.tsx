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

function LikedQuotes({ user, profile }: Props) {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchLikedQuotes = async () => {
      try {
        const { data: likes, error: likesError } = await supabase
          .from("quotes_like")
          .select("quote_id")
          .eq("user_id", user.id);

        if (likesError) throw likesError;
        if (!likes || likes.length === 0) {
          setQuotes([]);
          setLoading(false);
          return;
        }

        const quoteIds = likes.map((like) => like.quote_id);

        const { data: likedQuotes, error: quotesError } = await supabase
          .from("quotes")
          .select("*")
          .in("id", quoteIds)
          .order("created_at", { ascending: false });

        if (quotesError) throw quotesError;

        setQuotes(likedQuotes || []);
      } catch (error) {
        console.error("좋아요한 명대사 불러오기 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLikedQuotes();
  }, [user]);

  const handleRemove = (id: number) => {
    setQuotes((prev) => prev.filter((quote) => quote.id !== id));
  };

  if (!user) return <p className={S["my-notice"]}>로그인이 필요합니다.</p>;
  if (loading) return <p className={S["my-notice"]}>불러오는 중...</p>;
  if (quotes.length === 0)
    return <p className={S["my-notice"]}>좋아요한 명대사가 없습니다.</p>;

  return (
    <div className={S["my-container"]}>
      <h1 className={S["my-title"]}>
        {profile?.nickname ?? "Guest"} 님이 좋아요한 명대사
      </h1>
      <hr />
      {quotes.map((quote) => (
        <QuoteCard key={quote.id} quote={quote} onRemove={handleRemove} />
      ))}
    </div>
  );
}

export default LikedQuotes;
