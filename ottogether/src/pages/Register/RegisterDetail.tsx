import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import S from './RegisterDetail.module.css';
import { ottListTotal, genreListTotal } from '../../lib/data';
import { getUserInfo } from '../../supabase/auth/getUserInfo';
import { upsertTable } from '../../supabase/upsertTable';

function RegisterDetail() {
  
  const navigate = useNavigate();
  const location = useLocation();

  /* input state & ref 정의 */
  const [ userId, setUserId ] = useState<string>('');
  const [ ottList, setOttList ] = useState<string[]>([]);
  const [ genres, setGenres ] = useState<string[]>([]);
  const [ error, setError ] = useState<string | null>(null);
  
  /* user_id 가져오기 */
  useEffect(() => {
    const fetchUserId = async () => {
      // location.state 전달 값
      if (location.state?.userId) {
        setUserId(location.state.userId);
        return;
      }
      // Supabase 세션에서 추출
      const id = await getUserInfo('id');
      if (id) {
        setUserId(id);
      } else {
        console.error('userId를 찾을 수 없습니다.');
        setError('사용자 정보를 불러올 수 없습니다. 로그인 후 다시 시도해주세요.');
      }
    }
    fetchUserId();
    console.log(userId);
  }, []);

  // 다음에 입력하기 활성화 조건 설정
  const isSkippable = ottList.length === 0 && genres.length === 0

  const handleOttClick = (platform:string) => {
    setOttList(prev => 
      prev.includes(platform) 
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    )
  }

  const handleGenreChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    const selectedGenre = e.target.value;
    setGenres(prev => 
      prev.includes(selectedGenre) 
      ? prev.filter(g => g !== selectedGenre)
      : [...prev, selectedGenre]
    )
  }

  const handleSubmitRegisterDetail = async (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if(!userId) {
      setError('사용자 정보를 불러올 수 없습니다.');
      return;
    }

    const result = await upsertTable({
      method: 'upsert',
      tableName: 'profile',
      uploadData: {
        user_id: userId,
        preferred_ott: ottList,
        favorite_genre: genres,
        updated_at: new Date().toISOString(),
      },
      matchKey: "user_id"
    });

    if(result.error) {
      console.error('데이터 업데이트 실패:', result.error.message);
      setError('데이터 업데이트에 실패했습니다.');
    } else {
      console.log('업데이트 성공:', result.result);
      navigate('/register/profile', { state: { userId } });
    }
  }

  return (
    <div className={S.container}>
      <h2>Welcome!</h2>
      <h3>더 좋은 콘텐츠를 추천해드리기 위한 추가 정보를 입력해주세요 🥰</h3>

      <form className={S['register-detail-form']} onSubmit={handleSubmitRegisterDetail}>
        <section>
          <h4>사용 중이시거나 관심 있는 OTT 플랫폼을 선택해주세요.</h4>
          <ul className={S["ott-selection"]}>
            { ottListTotal.map(ott => (
              <li key={ott}>
                <figure className={S["ott-item"]}>
                  <button 
                    type='button'
                    className={ottList.includes(ott) ? S.selected : ''}
                    onClick={() => handleOttClick(ott)}
                  >
                    <img src={`/ott/${ott}.png`} alt={`${ott} 로고`} />
                  </button>
                  <figcaption>{ott}</figcaption>
                </figure>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h4>관심 있는 장르를 선택해주세요.</h4>
          <div className={S["genre-list"]}>
            {
              genreListTotal.map((genre, index) => (
                <div key={genre} className={S["genre-item"]}>
                  <input 
                  type="checkbox"
                  id={`genre-${index}`}
                  value={genre}
                  checked={genres.includes(genre)}
                  onChange={(e) => handleGenreChange(e)}
                  className={S.checkbox}
                  />
                  <label htmlFor={`genre-${index}`} className={S["genre-label"]}>{genre}</label>
                </div>
              ))
            }
          </div>
        </section>
        { error && <p className={S.error} aria-live='polite'>{error}</p>}
        <button 
          type="submit" 
          className={S["register-button"]}
          disabled={isSkippable}
          aria-label="OTT 플랫폼과 관심 장르 정보를 제출합니다"
        >입력하기</button>

        <button 
          type="button" 
          onClick={() => navigate('/register/profile')} 
          className={S["skip-button"]}
          aria-label="정보 입력을 건너뛰고 다음 단계로 이동합니다"
          disabled={!isSkippable}
        >다음에 입력하기</button>
      </form>
    </div>
  )
}
export default RegisterDetail