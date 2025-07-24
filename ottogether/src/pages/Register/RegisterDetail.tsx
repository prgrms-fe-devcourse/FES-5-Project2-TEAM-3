import { useId, useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import S from './RegisterDetail.module.css';
import userIcon from '@/assets/icons/user-square.svg';
import phoneIcon from '@/assets/icons/phone.svg';


function RegisterDetail() {
  
  const navigate = useNavigate();

  /* user 정보 가져오기 */
  const { state } = useLocation();
  const storedInfo = JSON.parse(sessionStorage.getItem('registerInfo') || '{}');
  const nickname = state.nickname || storedInfo.nickname || '회원님';
  // const email = state.email || storedInfo.email;

  /* input별 id 정의 */
  const nameId = useId();
  const phoneId = useId();

  /* input state 정의 */
  const [ name, setName ] = useState<string>('');
  const [ phoneNumber, setPhoneNumber ] = useState<string>('');
  const [ ottList, setOttList ] = useState<string[]>([]);
  const [ genres, setGenres ] = useState<string[]>([]);
  const [ agreement, SetAgreement ] = useState<boolean | null>(null);

  const ottListTotal = ['Netflix', 'Tving', 'DisneyPlus', 'Wavve', 'CoupangPlay', 'AppleTV', 'AmazonPrimeVideo'];
  const genreListtotal = ['액션', '모험', 'SF & 판타지', '코미디', '범죄', '로맨스', '드라마', '가족', '애니메이션', '아동', '음악', '공포', '미스터리', '스릴러', '다큐멘터리', '전쟁', '서부', '리얼리티', '연속극', '토크쇼', '역사', '뉴스', '정치'];

  // 다음에 입력하기 활성화 조건 설정
  const isSkippable = !name.trim() && !phoneNumber.trim() && ottList.length === 0 && genres.length === 0 && agreement === null
          
  const handleInput = (e:React.ChangeEvent<HTMLInputElement>) => {
    if(e.target.id === nameId) {
      setName(e.target.value);
    } else if(e.target.id === phoneId) {
      setPhoneNumber(e.target.value);
    }
  }

  const handleOttClick = (platform:string) => {
    setOttList(prev => 
      prev.includes(platform) 
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    )
    // console.log(ottList);
  }

  const handleGenreChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    const selectedGenre = e.target.value;
    setGenres(prev => 
      prev.includes(selectedGenre) 
      ? prev.filter(g => g !== selectedGenre)
      : [...prev, selectedGenre]
    )
    // console.log(genres);
  }

  const handleSubmitRegisterDetail = () => {

  }

  return (
    <div className={S.container}>
      <h2>Welcome, {nickname}!</h2>
      <h3>더 좋은 콘텐츠를 추천해드리기 위한 추가 정보를 입력해주세요 🥰</h3>

      <form className={S['register-detail-form']} onSubmit={handleSubmitRegisterDetail}>
        <section>
          <h4>이름과 전화번호를 입력해 주세요.</h4>
          <div className={S["input-wrapper"]}>
            <img className={S["input-icon"]} src={userIcon} alt="유저 아이콘" />
            <input 
              type="text" 
              name="이름" 
              id={nameId} 
              placeholder='Name' 
              onChange={handleInput}
              />
          </div>
          <div className={S["input-wrapper"]}>
            <img className={S["input-icon"]} src={phoneIcon} alt="전화 아이콘" />
            <input 
              type="text" 
              name="전화번호" 
              id={phoneId} 
              placeholder='Phone Number' 
              onChange={handleInput}
              />
          </div>
        </section>

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
              genreListtotal.map((genre, index) => (
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

        <section>
          <h4>개인정보 수집 및 이용 동의</h4>
          <p>개인정보 수집 및 이용에 동의해주세요. 입력하신 정보는 회원 정보 확인을 위한 목적으로만 사용됩니다. </p>
          <p>본 동의는 거부하실 수 있으며, 거부하실 경우 정상적으로 가입하신 이메일 / 비밀번호 찾기 기능을 이용하실 수 없습니다.</p>
          <ol>
            <li key="purpose">수집 목적 : 회원 정보 확인</li>
            <li key="information">수집 항목 : 이름, 전화번호</li>
            <li key="retention-period">보유 및 이용 기간 : 회원 탈퇴 시까지</li>
          </ol>
          
          <fieldset aria-label='정보 제공 동의 선택창'>
            <legend>개인정보 제공에 동의하십니까?</legend>

            <input 
              type="radio" 
              name="agreement"
              id="agree"
              value="true"
              checked={agreement === true} 
              onChange={()=>SetAgreement(true)}
            /> 
            <label htmlFor="agree">네, 동의합니다.</label>
            <input 
              type="radio" 
              name="agreement"
              id="disagree"
              value="false"
              checked={agreement === false} 
              onChange={()=>SetAgreement(false)}
            /> 
            <label htmlFor="disagree">동의하지 않습니다.</label>
          </fieldset>  
        </section>
        
        <button 
          type="submit" 
          disabled={agreement === null || ( agreement === true && (!name.trim() || !phoneNumber.trim()))}
          aria-label="입력한 정보를 제출합니다"
        >입력하기</button>

        <button 
          type="button" 
          onClick={() => navigate('/register/profile')} 
          className={S["skip-button"]}
          aria-label="다음 페이지로 이동합니다"
          disabled={!isSkippable}
        >다음에 입력하기</button>
      </form>
    </div>
  )
}
export default RegisterDetail