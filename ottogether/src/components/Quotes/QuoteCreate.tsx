import { useState } from "react";
import S from './QuoteCreate.module.css';
import { supabase } from '../../supabase/supabase';
import type { TablesInsert } from '../../supabase/supabase.type';
import { getUserInfo } from '../../supabase/auth/getUserInfo';
import addIcon from '@/assets/icons/add.svg';

type Props = {
    onAdd: () => void;
};

function QuoteCreate({onAdd}:Props) {

    const [isExpanded, setIsExpanded] = useState(false);
    const [content, setContent] = useState('');
    const [person, setPerson] = useState('');

    const handleSubmit = async () => {
  if (!content.trim()) return;

    const userId = await getUserInfo('id');

    if (!userId) {
      console.error('로그인된 사용자를 찾을 수 없습니다.');
      return;
    }

    const newQuote: TablesInsert<'quotes'> = {
      content,
      person: person || '익명',
      likes: 0,
      is_visible: true,
      user_id: userId, 
    };

    const { error } = await supabase.from('quotes').insert(newQuote);

  if (!error) {
    setContent('');
    setPerson('');
    setIsExpanded(false);
    onAdd(); 
  } else {
    console.error('다시 입력해 주세요:', error.message);
  }
};

const handleCancel = () => {
  setContent('');
  setPerson('');
  setIsExpanded(false);
};

if (!isExpanded) {
  return (
    <div className={S.collapsed} onClick={() => setIsExpanded(true)}>
      <span className={S.text}>당신이 생각하는 영화의 명대사를 적어주세요.</span>
      <img className={S.icon} src={addIcon} alt="추가 아이콘" />
    </div>
  );
}



  return (
    <div className={S.container}>
  <div className={S.contentArea}>
    <textarea
    value={content}
    onChange={(e) => setContent(e.target.value)}
    placeholder="대사를 입력해주세요."
    />
  </div>
  <div className={S.bottom}>
    <div className={S.bottomLeft}>
      <input 
      onChange={(e) => setPerson(e.target.value)}
      placeholder="누가 말했을까" />
    </div>
    <div className={S.bottomRight}>
      <button onClick={handleSubmit}>Save</button>
      <button onClick={handleCancel}>Cancel</button>
    </div>
  </div>
</div>
  )
}

export default QuoteCreate











