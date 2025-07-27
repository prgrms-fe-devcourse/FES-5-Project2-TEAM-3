import S from './RegisterProfile.module.css';
import { useId, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import userIcon from '@/assets/icons/user-square.svg';
import editIcon from '@/assets/icons/edit.svg';
import linkIcon from '@/assets/icons/link.svg';
import uploadIcon from '@/assets/icons/add.svg';
import defaultHeader from '@/assets/default_header.svg';
import defaultAvatar from '@/assets/default_avatar.svg';


function RegisterProfile() {

  const navigate = useNavigate();

  const nicknameId = useId();
  const headerId = useId();
  const avatarId = useId();
  const bioId = useId();
  const urlId = useId();

  const [ userNickname, setUserNickname ] = useState<string>('');
  const [ userHeader, setUserHeader ] = useState<File | null>(null);
  const [ headerPreview, setHeaderPreview ] = useState<string | null>(null);
  const [ userAvatar, setUserAvatar ] = useState<File | null>(null);
  const [ avatarPreview, setAvatarPreview ] = useState<string | null>(null);
  const [ userBio, setUserBio ] = useState<string>('');
  const [ userUrl, setUserUrl ] = useState<string>('');
  const [ error, setError ] = useState<string | null>(null);
  
  // 다음에 입력하기 활성화 조건 설정
  const isSkippable = 
    userNickname.trim().length === 0 && 
    userHeader === null && 
    userAvatar === null && 
    userBio.trim().length === 0 && 
    userUrl.trim().length === 0;

  const handleInput = (e:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if(e.target.id === nicknameId) {
      setUserNickname(e.target.value);
    } else if(e.target.id === bioId) {
      setUserBio(e.target.value);
    } else if(e.target.id === urlId) {
      setUserUrl(e.target.value);
    }
  }

  const handleFileUpload = (e:React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setError('파일 업로드에 실패했습니다.');
      return;
    }
    if(e.target.id === headerId) {
      setUserHeader(file);
      setHeaderPreview(URL.createObjectURL(file));
    } else if(e.target.id === avatarId) {
      setUserAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  }

  const handleSubmitProfile = (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  }

  return (
    <div className={S.container}>
      <h2>Welcome!</h2>
      <h3>다른 유저에게 보여질 프로필을 꾸며보세요! 🌸</h3>
      
      <form className={S['register-detail-form']} onSubmit={handleSubmitProfile}>
        <div className={S["form-section"]}>
          <section>
            <h4>다른 유저에게 표시될 닉네임을 설정해주세요.</h4>
            <div className={S["input-wrapper"]}>
              <img className={S["input-icon"]} src={userIcon} alt="유저 아이콘" />
              <input 
                type="text" 
                name="닉네임" 
                id={nicknameId} 
                placeholder='Nickname' 
                onChange={handleInput}
                />
            </div>
          </section>
          <section>
            <h4>프로필 상단에 표시될 헤더 이미지를 업로드 해주세요.</h4>
            <div className={S["input-wrapper"]}>
              <img className={S["input-icon"]} src={userIcon} alt="유저 아이콘" />
              <label htmlFor={headerId}>
                Upload Header Image
                <img src={uploadIcon} alt="헤더 업로드" />
              </label>
              <input 
                className='a11y-hidden'
                type="file" 
                name="헤더 이미지" 
                id={headerId} 
                aria-describedby='header-file-upload' 
                onChange={handleFileUpload}
                />
            </div>
            { userHeader && (
              <p id="header-file-upload" className={S["file-name"]} aria-live='polite'>
                업로드된 파일 : {userHeader.name}
              </p>
            )}
          </section>
          <section>
            <h4>프로필 이미지를 업로드 해주세요.</h4>
            <div className={S["input-wrapper"]}>
              <img className={S["input-icon"]} src={userIcon} alt="유저 아이콘" />
              <label htmlFor={avatarId}>
                Upload Profile Image
                <img src={uploadIcon} alt="프로필 업로드" />
              </label>
              <input 
                className='a11y-hidden'
                type="file" 
                name="프로필 이미지" 
                id={avatarId} 
                aria-describedby='avatar-file-upload' 
                onChange={handleFileUpload}
                />
            </div>
            { userAvatar && (
              <p id="avatar-file-upload" className={S["file-name"]} aria-live='polite'>
                업로드된 파일 : {userAvatar.name}
              </p>
            )}
          </section>
          <section>
            <h4>자기소개를 입력해주세요.</h4>
            <div className={S["input-wrapper"]}>
              <img className={S["input-icon"]} src={editIcon} alt="작성 아이콘" />
              <textarea  
                id={bioId} 
                placeholder='Introduce Yourself' 
                onChange={handleInput}
                />
            </div>
          </section>
          <section>
            <h4>공유하고 싶은 URL을 입력해주세요.</h4>
            <div className={S["input-wrapper"]}>
              <img className={S["input-icon"]} src={linkIcon} alt="링크 아이콘" />
              <input 
                type="text" 
                name="링크" 
                id={urlId} 
                placeholder='URL' 
                onChange={handleInput}
                />
            </div>
          </section>
          { error && <p>{error}</p> }
        </div>
        <div className={S["preview-section"]}>
          <div className={S.preview}>
            <h4>프로필 미리보기</h4>
            <div className={S["image-container"]}>
              <img 
                className={S["header-image"]}
                src={ headerPreview ?? defaultHeader } 
                alt={ headerPreview ? "업로드한 헤더 이미지" : "기본 헤더 이미지" } 
              />
              <img 
                className={S["avatar-image"]}
                src={ avatarPreview ?? defaultAvatar }
                alt={ avatarPreview ? "업로드한 프로필 이미지" : "기본 프로필 이미지" } 
              />
            </div>
            <div className={S["text-container"]}>
              <h5>닉네임</h5>
              <span>{ userNickname.trim() || '닉네임을 입력해 주세요.' }</span>
              <h5>소개</h5>
              <span>{ userBio.trim() || '소개를 입력해 주세요.' }</span>
              <h5>URL</h5>
              <span>{ userUrl.trim() || '공유하고 싶은 URL을 입력해 주세요.' }</span>
            </div>
          </div>
        </div>
        <div className={S["button-group"]}>
          <button 
            type="submit" 
            className={S["register-button"]}
            disabled={isSkippable}
            aria-label="프로필 정보를 제출합니다"
          >입력하기</button>
          <button 
            type="button" 
            onClick={() => navigate('/my-page')} 
            className={S["skip-button"]}
            aria-label="정보 입력을 건너뛰고 마이 페이지로 이동합니다"
            disabled={!isSkippable}
          >다음에 입력하기</button>
        </div>
      </form>
    </div>
  )
}
export default RegisterProfile