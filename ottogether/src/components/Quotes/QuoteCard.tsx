import { useEffect, useState } from 'react';
import S from './QuoteCard.module.css';
import { supabase } from '../../supabase/supabase';
import likeIcon from '@/assets/icons/like-icon.svg';
import quoteLeft from '@/assets/icons/quotes-left.svg';
import quoteRight from '@/assets/icons/quotes-right.svg';
import { toggleQuoteLike } from '../../util/toggleQuoteLike';



type QuoteCardProps = {
  id: number;
  content: string;
  person: string | null;
  likes: number;
  user_id: string;
  onRemove: (id: number) => void;
};

export default function QuoteCard({
  id,
  content,
  person,
  likes,
  onRemove,
}: QuoteCardProps) {
 
  const [likeCount, setLikeCount] = useState(likes);
  const [isLiked, setIsLiked] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(content);
  const [editPerson, setEditPerson] = useState(person ?? '');

  // const user = supabase.auth.getUser;

  useEffect(() => {
    const checkLike = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) return;

      const { data } = await supabase
        .from('quotes_like')
        .select('*')
        .eq('user_id', user.id)
        .eq('quote_id', id)
        .single();

      if (data) {
        setIsLiked(true);
      }
    };

    checkLike();
  }, [id]);

  const handleLike = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      alert('로그인이 필요합니다.');
      return;
    }

    const { liked, error } = await toggleQuoteLike(id, user.id);

    if (!error && typeof liked === 'boolean') {
      setIsLiked(liked);
      setLikeCount((prev) => liked ? prev + 1 : prev - 1);
    }
  };

  const handleEdit = () => {
  setIsEditing(true);
 };

 const handleUpdate = async () => {
  const { error } = await supabase
    .from('quotes')
    .update({
      content: editContent,
      person: editPerson,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (!error) {
    setIsEditing(false);
    setEditContent(editContent);
    setEditPerson(editPerson);
  } else {
    console.error('내용을 확인해주세요:', error.message);
  }
};

 const handleCancelEdit = () => {
  setEditContent(content);
  setEditPerson(person ?? '');
  setIsEditing(false);
};



  const handleRemove = async () => {

  const isConfirmed = window.confirm('정말 삭제하시겠습니까?');
  if (!isConfirmed) return;  

  const { error } = await supabase.from('quotes').delete().eq('id', id);
  if (!error) {
    alert('삭제되었습니다.');
    onRemove(id);
  }
};

  return (
    <div className={`${S.card} ${isEditing ? S.editing : ''}`}>
      <div className={S.body}>
        <div className={S.top}>
          <img src={quoteLeft} alt="left quote" className={S.quoteIconLeft} />
          {isEditing ? (
            <textarea className={S.editInput}
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              placeholder="명대사를 입력하세요"
            />
          ) : (
            <p className={S.content}>{editContent}</p>
          )}
          <img src={quoteRight} alt="right quote" className={S.quoteIconRight} />
        </div>
        <div className={S.bottom}>
          <div className={S.left}>
            <button className={`${S.likeBtn} ${isLiked ? S.liked : ''}`} onClick={handleLike}>
              <img src={likeIcon} alt="like" />
              <span>{likeCount}</span>
            </button>
          </div>
          {isEditing ? (
            <input className={S.editPerson}
              value={editPerson}
              onChange={(e) => setEditPerson(e.target.value)}
              placeholder="누가 말했을까"
            />
          ) : (
            <span className={S.person}> - {editPerson}</span>
          )}
          <div className={S.right}>
            {isEditing ? (
              <>
                <button className={S.editBtn} onClick={handleUpdate}>Save</button>
                <div>/</div>
                <button className={S.removeBtn} onClick={handleCancelEdit}>Cancel</button>
              </>
            ) : (
              <>
                <button className={S.editBtn} onClick={handleEdit}>Edit</button>
                <div>/</div>
                <button className={S.removeBtn} onClick={handleRemove}>Remove</button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
