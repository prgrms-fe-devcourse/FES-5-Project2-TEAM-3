import S from './RegisterProfile.module.css';
import { useEffect, useId, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import userIcon from '@/assets/icons/user-square.svg';
import editIcon from '@/assets/icons/edit.svg';
import linkIcon from '@/assets/icons/link.svg';
import uploadIcon from '@/assets/icons/add.svg';
import defaultHeader from '@/assets/default_header.svg';
import defaultAvatar from '@/assets/default_avatar.svg';
import { uploadImage } from '../../supabase/storage/uploadImage';
import { getUserInfo } from '../../supabase/auth/getUserInfo';
import { getRandomAvatar, getRandomHeader } from '../../util/getRandomProfile';
import { upsertTable } from '../../supabase/upsertTable';
import React from 'react';

function RegisterProfile() {

  const navigate = useNavigate();
  const location = useLocation();

  const nicknameId = useId();
  const headerId = useId();
  const avatarId = useId();
  const bioId = useId();
  const urlId = useId();

  /* input state & ref 정의 */
  const [ userId, setUserId ] = useState<string>('');
  const [ userNickname, setUserNickname ] = useState<string>('');
  const [ userHeader, setUserHeader ] = useState<File | null>(null);
  const [ headerPreview, setHeaderPreview ] = useState<string | null>(null);
  const [ userAvatar, setUserAvatar ] = useState<File | null>(null);
  const [ avatarPreview, setAvatarPreview ] = useState<string | null>(null);
  const [ userBio, setUserBio ] = useState<string>('');
  const [ userUrl, setUserUrl ] = useState<string>('');
  const [ error, setError ] = useState<string | null>(null);
  const [ uploadFailCount, setUploadFailCount ] = useState(0);
  const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
  

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
        alert('로그인 정보가 만료되었습니다. 다시 로그인해주세요.');
        navigate('/login');
      }
    }
    fetchUserId();
  }, []);

  // 다음에 입력하기 활성화 조건 설정
  const isSkippable = 
    userNickname.trim().length === 0 && 
    userHeader === null && 
    userAvatar === null && 
    userBio.trim().length === 0 && 
    userUrl.trim().length === 0;

  /* 입력값 핸들러 */
  const handleInput = (e:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if(e.target.id === nicknameId) {
      setUserNickname(e.target.value.trim());
    } else if(e.target.id === bioId) {
      setUserBio(e.target.value.trim());
    } else if(e.target.id === urlId) {
      setUserUrl(e.target.value.trim());
    }
  }

  /* 미리보기용 파일 업로드 */
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

  /* 업로드한 파일이 있을 경우 Storage에 저장, 없으면 랜덤프로필 - Header */
  const handleHeaderImage = async () => {
    if(userHeader) {
      const result = await uploadImage( 
        { 
          bucketName: "headers",
          file: userHeader,
          path: `userHeader-${userId}`
        });
      if(result.success) {
        return result.url;
      } else {
        console.error('Header 업로드 실패:', result.error);
        return null;
      }
    } 
    return getRandomHeader();
  }

  /* 업로드한 파일이 있을 경우 Storage에 저장, 없으면 랜덤프로필 - Avatar */
  const handleAvatarImage = async () => {
    if(userAvatar) {
      const result = await uploadImage( 
        { 
          bucketName: "avatars",
          file: userAvatar,
          path: `userAvatar-${userId}`
        });
      if(result.success) {
        return result.url;
      } else {
        console.error('Avatar 업로드 실패:', result.error);
        return null;
      }
    } 
    return getRandomAvatar();
  }

  /* Form Submit Handler */
  const handleSubmitProfile = async (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 비동기 처리 중 중복 제출 방지
    if(isSubmitting) return;

    try {
      setIsSubmitting(true);

      const avatarUrl = await handleAvatarImage();
      const headerUrl = await handleHeaderImage();

      if(!avatarUrl || !headerUrl) {
        setError('프로필 이미지를 업로드하는 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.');
        setUploadFailCount(prev => prev + 1);
        setIsSubmitting(false);
        return;
      }

      // profile 테이블에 upsert
      const { error } = await upsertTable({
        method: 'upsert',
        tableName: 'profile',
        uploadData: {
          user_id: userId,
          nickname: userNickname || '',
          bio: userBio || '',
          url: userUrl || '',
          avatar_url: avatarUrl,
          header_url: headerUrl,
          updated_at: new Date().toISOString(),
        },
        matchKey: 'user_id',
      });

      // 통신 에러 핸들링
      if (error) {
        setError('프로필 등록에 실패했습니다. 잠시 후 다시 시도해주세요.');
        setUploadFailCount(prev => prev + 1);

        if(uploadFailCount > 3) {
          alert('프로필 등록이 반복적으로 실패하여 마이페이지로 이동합니다.')
          navigate('/my-page')
        }
        return;
      }

      // submit 후 마이페이지로 이동
      navigate('/my-page');

    } catch (err) {
      console.error(err);
      setUploadFailCount(prev => prev + 1);
      setError('예기치 못한 에러가 발생했습니다. 잠시 후 다시 시도해주세요.');

      if(uploadFailCount > 3) {
        alert('프로필 등록이 반복적으로 실패하여 마이페이지로 이동합니다.')
        navigate('/my-page')
      }
    } finally {
      setIsSubmitting(false);
    }
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
                accept='image/*'
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
                accept='image/*'
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
          { error && <p className={S.error} aria-live='polite'>{error}</p> }
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
              <span className={S["user-bio"]}>{ userBio.trim() 
                ? userBio.split('\n').map((line, idx) => (
                  <React.Fragment key={idx}>
                    {line}
                    <br />
                  </React.Fragment>
                )) 
                : '소개를 입력해 주세요.' }</span>
              <h5>URL</h5>
              <span>{ userUrl.trim() || '공유하고 싶은 URL을 입력해 주세요.' }</span>
            </div>
          </div>
        </div>
        <div className={S["button-group"]}>
          <button 
            type="submit" 
            className={S["register-button"]}
            disabled={isSkippable || isSubmitting}
            aria-label="프로필 정보를 제출합니다"
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
            onClick={() => navigate('/my-page')} 
            className={S["skip-button"]}
            aria-label="정보 입력을 건너뛰고 마이 페이지로 이동합니다"
            disabled={!isSkippable || isSubmitting}
          >다음에 입력하기</button>
        </div>
      </form>
    </div>
  )
}
export default RegisterProfile