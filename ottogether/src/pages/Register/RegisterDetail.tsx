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
  const [ userEmail, setUserEmail ] = useState<string>('');
  const [ ottList, setOttList ] = useState<string[]>([]);
  const [ genres, setGenres ] = useState<string[]>([]);
  const [ error, setError ] = useState<string | null>(null);
  const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
  
  /* user_id, email_address 가져오기 */
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
        alert('로그인 정보가 만료되었습니다. 다시 로그인해주세요.');
        navigate('/login');
      }
    }

    const fetchUserEmail = async () => {
      // location.state 전달 값
      if (location.state?.userEmail) {
        setUserEmail(location.state.userEmail);
        return;
      }
      // Supabase 세션에서 추출
      const email = await getUserInfo('email');
      if (email) {
        setUserEmail(email);
      } else {
        console.error('user Email을 찾을 수 없습니다.');
        alert('로그인 정보가 만료되었습니다. 다시 로그인해주세요.');
        navigate('/login');
      }
    }

    fetchUserId();
    fetchUserEmail();
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

  /* Supabase Upsert 통신 */
  const submitProfileInfo = async ({
    userId,
    userEmail,
    ottList = [],
    genres = []
  }: {
    userId: string;
    userEmail: string;
    ottList?: string[];
    genres?: string[];
  }) => {
    return await upsertTable({
      method: 'upsert',
      tableName: 'profile',
      uploadData: {
        user_id: userId,
        email_address: userEmail,
        preferred_ott: ottList,
        favorite_genre: genres,
        updated_at: new Date().toISOString(),
      },
      matchKey: "user_id"
    });
  };

  /* Skip 버튼 클릭 시 - user_id와 이메일만 저장 */
  const handleSkipDetail = async () => {
    // 비동기 처리 중 중복 제출 방지
    if(isSubmitting) return;

    // 유저 정보가 없을 경우 다시 로그인하도록 알림
    if(!userId) {
      alert('로그인 정보가 만료되었습니다. 다시 로그인하신 후 시도해주세요.');
      navigate('/login');
    }

    setIsSubmitting(true);
    const result = await submitProfileInfo( { userId, userEmail });
    setIsSubmitting(false);

    if (result.error) {
      console.error('skip 데이터 저장 실패:', result.error.message);
      setError('데이터 저장에 실패했습니다. 잠시 후 다시 시도해주세요.');
      return;
    }
    navigate('/register/profile', { state: { userId } });
  }

  /* Submit 버튼 클릭 시 - OTT 리스트와 장르 정보 저장 */
  const handleSubmitRegisterDetail = async (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 비동기 처리 중 중복 제출 방지
    if(isSubmitting) return;

    // 유저 정보가 없을 경우 다시 로그인하도록 알림
    if(!userId) {
      alert('로그인 정보가 만료되었습니다. 다시 로그인하신 후 시도해주세요.');
      navigate('/login');
    }

    setIsSubmitting(true);
    const result = await submitProfileInfo({
      userId,
      userEmail,
      ottList,
      genres
    });
    setIsSubmitting(false);

    if(result.error) {
      console.error('Submit 데이터 업데이트 실패:', result.error.message);
      setError('데이터 업데이트에 실패했습니다.');
    } else {
      // console.log('업데이트 성공:', result.result);
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
          disabled={isSkippable || isSubmitting}
          aria-label="OTT 플랫폼과 관심 장르 정보를 제출합니다"
        >{
            isSubmitting ? (
              <>
                저장 중... {' '}
                <span 
                  role='status'
                  aria-live='polite'
                  aria-label='저장 중입니다'
                  className={S.spinner}>
                </span>
              </>
            ) 
            : "입력하기"
            }</button>

        <button 
          type="button" 
          onClick={handleSkipDetail} 
          className={S["skip-button"]}
          aria-label="정보 입력을 건너뛰고 다음 단계로 이동합니다"
          disabled={!isSkippable || isSubmitting}
        >다음에 입력하기</button>
      </form>
    </div>
  )
}
export default RegisterDetail