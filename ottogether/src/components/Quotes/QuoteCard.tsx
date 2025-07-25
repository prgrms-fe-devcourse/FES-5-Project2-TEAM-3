import { useState } from 'react';
import S from './QuoteCard.module.css';
import { supabase } from '../../supabase/supabase';
import likeIcon from '@/assets/icons/like-icon.svg';
import quoteLeft from '@/assets/icons/quotes-left.svg';
import quoteRight from '@/assets/icons/quotes-right.svg';


type QuoteCardProps = {
  id: number;
  content: string;
  person: string | null;
  likes: number;
};

export default function QuoteCard({
  id,
  content,
  person,
  likes,
}: QuoteCardProps) {
 
  const [likeCount, setLikeCount] = useState(likes);

  const handleLike = async () => {
    const { error } = await supabase
      .from('quotes')
      .update({ likes: likeCount + 1 })
      .eq('id', id);

    if (!error) {
      setLikeCount((prev) => prev + 1);
    } else {
      console.error('error', error.message);
    }
  };

  const handleEdit = ()=> {console.log('미구현');
  };

  const handleRemove = () => {console.log('미구현')};

  return (
    <div className={S.card}>
      <div className={S.body}>
      <div className={S.top}>
      <img src={quoteLeft} alt="left quote" className={S.quoteIconLeft} />
      <p className={S.content}>{content}</p>
      <img
        src={quoteRight}
        alt="right quote"
        className={S.quoteIconRight}
      />
      </div>
      <div className={S.bottom}>
        <div className={S.left}>
          <button className={S.likeBtn} onClick={handleLike}>
            <img src={likeIcon} alt="like" />
            <span>{likeCount}</span>
          </button>
        </div>
         <span className={S.person}> - {person}</span>
        <div className={S.right}>
          <button className={S.editBtn} onClick={handleEdit}>Edit</button>
          <div>/</div>
          <button className={S.removeBtn} onClick={handleRemove}>Remove</button>
        </div>
      </div>
      </div>
    </div>
  );
}