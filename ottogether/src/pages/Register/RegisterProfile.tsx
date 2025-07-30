import React, { useRef } from 'react';
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
import { upsertTable } from '../../supabase/upsertTable';
import { getRandomAvatar, getRandomHeader } from '../../util/getRandomProfile';
import { ErrorCode, ErrorMessages } from '../../lib/errorCodes';
import { checkNicknameExists } from '../../supabase/auth/checkNickname';


type FieldErrorState = {
  nickname?: ErrorCode;
  bio?: ErrorCode;
  url?: ErrorCode;
  avatar?: ErrorCode;
  header?: ErrorCode;
  submit?: ErrorCode;
}

function RegisterProfile() {

  const navigate = useNavigate();
  const location = useLocation();

  const headerId = useId();
  const avatarId = useId();

  /* input state & ref 정의 */
  const [ userId, setUserId ] = useState<string>('');
  const [ userNickname, setUserNickname ] = useState<string>('');
  const [ userHeader, setUserHeader ] = useState<File | null>(null);
  const [ headerPreview, setHeaderPreview ] = useState<string | null>(null);
  const [ userAvatar, setUserAvatar ] = useState<File | null>(null);
  const [ avatarPreview, setAvatarPreview ] = useState<string | null>(null);
  const [ userBio, setUserBio ] = useState<string>('');
  const [ userUrl, setUserUrl ] = useState<string>('');
  
  const [ fieldErrors, setFieldErrors ] = useState<FieldErrorState>({});
  const [ uploadFailCount, setUploadFailCount ] = useState(0);

  const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
  
  const nicknameRef = useRef<HTMLInputElement>(null);
  const urlRef = useRef<HTMLInputElement>(null);

  // 파일 최대 용량 2MB로 제한
  const MAX_FILE_SIZE = 2 * 1024 * 1024;

  /* user_id 가져오기 */
  useEffect(() => {
    let isMounted = true;

    const fetchUserId = async () => {
      try {
        // location.state 전달 값
        if (location.state?.userId) {
          setUserId(location.state.userId);
          return;
        }
        // Supabase 세션에서 추출
        const id = await getUserInfo('id');

        if (!id) throw new Error('userId를 찾을 수 없습니다.');
        setUserId(id);
      } catch {
        if (isMounted) {
          alert('로그인 정보가 만료되었습니다. 다시 로그인해주세요.');
          navigate('/login');
        }
      }
    };
    fetchUserId();
    return () => {
      isMounted = false;
    }
  }, [location.state?.userId, navigate]);

  // 다음에 입력하기 활성화 조건 설정
  const isSkippable = 
    userNickname.length === 0 && 
    userHeader === null && 
    userAvatar === null && 
    userBio.length === 0 && 
    userUrl.length === 0;


  /* 입력값 유효성 검증 */
  // 닉네임: 최대 20자 제한
  const validateNickname = (value:string):ErrorCode | undefined => {
    if (value.length > 20) return ErrorCode.NicknameTooLong;
    return undefined;
  }
  // Bio: 최대 300자 제한
  const validateBio = (value:string):ErrorCode | undefined => {
    if (value.length > 300) return ErrorCode.BioTooLong;
    return undefined;
  }
  // url: 유효한 url
  const validateUrl = (url:string):ErrorCode | undefined => {
    if(!url) return undefined;
    try {
      const parsed = new URL(url);
      if(["http:", "https:"].includes(parsed.protocol)) return undefined;
    } catch {}
    return ErrorCode.InvalidUrl;
  }

  /* 입력값 핸들러 */
  const handleNicknameInput = (e:React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    setUserNickname(value);
    setFieldErrors(prev => ({...prev, nickname: validateNickname(value)}));
  }
  const handleBioInput = (e:React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value.trim();
    setUserBio(value);
    setFieldErrors(prev => ({...prev, bio: validateBio(value)}));
  }
  const handleUrlInput = (e:React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    setUserUrl(value);
    setFieldErrors(prev => ({...prev, url: validateUrl(value)}));
  } 

  /* 미리보기용 파일 업로드 */
  const handleFileUpload = (e:React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const id = e.target.id;
    const fieldKey = id === avatarId ? 'avatar' : id === headerId ? 'header' : null;
    if(!fieldKey) return;

    // 에러 메시지 핸들링
    if (!file) {
      setFieldErrors(prev => ({...prev, [fieldKey]: ErrorCode.FileUploadFail}));
      console.error(ErrorCode.FileUploadFail);
      return;
    }
    if (!file.type.startsWith("image/")) {
      setFieldErrors(prev => ({...prev, [fieldKey]: ErrorCode.InvalidFileType}));
      console.error(ErrorCode.InvalidFileType);
      return;
    } 
    if (file.size > MAX_FILE_SIZE) {
      setFieldErrors(prev => ({...prev, [fieldKey]: ErrorCode.FileTooLarge}));
      console.error(ErrorCode.FileTooLarge);
      return;
    } 
    setFieldErrors(prev => ({...prev, [fieldKey]: undefined}));

    // 미리보기 이미지 설정
    if(id === headerId) {
      setUserHeader(file);
      setHeaderPreview(URL.createObjectURL(file));
    } else if(id === avatarId) {
      setUserAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  }

  /* 업로드한 파일이 있을 경우 Storage에 저장, 없으면 랜덤프로필 - Header */
  const handleHeaderImage = async () => {
    if(!userHeader) return getRandomHeader();
    
    const extension = userHeader.name.split('.').pop()?.toLowerCase() || 'png';
    const filtPath = `userHeader-${userId}.${extension}`;
    try {
      const result = await uploadImage( 
      { 
        bucketName: "headers",
        file: userHeader,
        path: filtPath
      });
      if(result.success) {
        setFieldErrors(prev => ({...prev, header: undefined}));
        return result.url;
      } else {
        console.error('Header 업로드 실패:', result.error);
        setFieldErrors(prev => ({...prev, header: ErrorCode.HeaderUploadFail}));
        return null;
      }
    } catch (err) {
      console.error('Header 업로드 실패:', err);
      setFieldErrors(prev => ({...prev, header: ErrorCode.Unexpected}));
      return null;
    }
    
  }

  /* 업로드한 파일이 있을 경우 Storage에 저장, 없으면 랜덤프로필 - Avatar */
  const handleAvatarImage = async () => {
    if(!userAvatar) return getRandomAvatar();

    const extension = userAvatar.name.split('.').pop()?.toLowerCase() || 'png';
    const filtPath = `userAvatar-${userId}.${extension}`;
    try {
      const result = await uploadImage( 
      { 
        bucketName: "avatars",
        file: userAvatar,
        path: filtPath
      });
      if(result.success) {
        setFieldErrors(prev => ({...prev, avatar: undefined}));
        return result.url;
      } else {
        console.error('Avatar 업로드 실패:', result.error);
        setFieldErrors(prev => ({...prev, avatar: ErrorCode.AvatarUploadFail}));
        return null;
      }
    } catch (err) {
      console.error('Avatar 업로드 실패:', err);
      setFieldErrors(prev => ({...prev, avatar: ErrorCode.Unexpected}));
      return null;
    }
  } 

  /* Form Submit Handler */
  const handleSubmitProfile = async (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 비동기 처리 중 중복 제출 방지
    if(isSubmitting) return;

    setIsSubmitting(true);
    try {
      // 헤더 및 프로필 사진 주소 가져오기
      const avatarUrl = await handleAvatarImage();
      const headerUrl = await handleHeaderImage();
      if (!avatarUrl || !headerUrl) {
        setFieldErrors(prev => ({...prev, submit: ErrorCode.SubmitFail}));
        setUploadFailCount(prev => prev + 1);
        setIsSubmitting(false);
        return;
      } else {
        setFieldErrors(prev => ({...prev, submit: undefined}));
      }

      // 닉네임 유효성 확인
      if (fieldErrors.nickname) {
        setIsSubmitting(false);
        nicknameRef.current?.focus();
        return;
      }

      // 중복 닉네임 검증
      if ( userNickname ) {
        try {
          const nicknameExists = await checkNicknameExists(userNickname);

          if(nicknameExists) {
            setFieldErrors(prev => ({...prev, nickname: ErrorCode.NicknameExists}));
            setIsSubmitting(false);
            nicknameRef.current?.focus();
            return;
          } else {
            setFieldErrors(prev => ({...prev, nickname: undefined}));
          }
        } catch (err) {
          console.error('중복 닉네임 검사 에러:', err);
          setFieldErrors(prev => ({...prev, nickname: ErrorCode.Unexpected}));
          return;
        }
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
        setFieldErrors(prev => ({...prev, submit: ErrorCode.SubmitFail}));
        setUploadFailCount(prev => prev + 1);
        setIsSubmitting(false);

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
      setFieldErrors(prev => ({...prev, submit: ErrorCode.Unexpected}));

      if(uploadFailCount > 3) {
        alert('프로필 등록이 반복적으로 실패하여 마이페이지로 이동합니다.')
        navigate('/my-page')
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  const skipSubmitProfile = async () => {
    // 비동기 처리 중 중복 제출 방지
    if(isSubmitting) return;

    setIsSubmitting(true);
    try {
      // 헤더 및 프로필 사진 주소 가져오기
      const avatarUrl = await handleAvatarImage();
      const headerUrl = await handleHeaderImage();
      if (!avatarUrl || !headerUrl) {
        setFieldErrors(prev => ({...prev, submit: ErrorCode.SubmitFail}));
        setUploadFailCount(prev => prev + 1);
        setIsSubmitting(false);
        return;
      } else {
        setFieldErrors(prev => ({...prev, submit: undefined}));
      }

      // profile 테이블에 upsert
      const { error } = await upsertTable({
        method: 'upsert',
        tableName: 'profile',
        uploadData: {
          user_id: userId,
          avatar_url: avatarUrl,
          header_url: headerUrl,
          updated_at: new Date().toISOString(),
        },
        matchKey: 'user_id',
      });

      // 통신 에러 핸들링
      if (error) {
        setFieldErrors(prev => ({...prev, submit: ErrorCode.SubmitFail}));
        setUploadFailCount(prev => prev + 1);
        setIsSubmitting(false);

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
      setFieldErrors(prev => ({...prev, submit: ErrorCode.Unexpected}));

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
                placeholder='Nickname' 
                ref={nicknameRef}
                onChange={handleNicknameInput}
                />
            </div>
            { fieldErrors.nickname && <p className={S.error} aria-live='polite'>{ErrorMessages[fieldErrors.nickname]}</p> }
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
            { fieldErrors.header && <p className={S.error} aria-live='polite'>{ErrorMessages[fieldErrors.header]}</p> }
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
            { fieldErrors.avatar && <p className={S.error} aria-live='polite'>{ErrorMessages[fieldErrors.avatar]}</p> }
          </section>
          <section>
            <h4>자기소개를 입력해주세요.</h4>
            <div className={S["input-wrapper"]}>
              <img className={S["input-icon"]} src={editIcon} alt="작성 아이콘" />
              <textarea  
                placeholder='Introduce Yourself' 
                maxLength={300}
                onChange={handleBioInput}
                />
            </div>
            { fieldErrors.bio && <p className={S.error} aria-live='polite'>{ErrorMessages[fieldErrors.bio]}</p> }
          </section>
          <section>
            <h4>공유하고 싶은 URL을 입력해주세요.</h4>
            <div className={S["input-wrapper"]}>
              <img className={S["input-icon"]} src={linkIcon} alt="링크 아이콘" />
              <input 
                type="text" 
                name="링크" 
                placeholder='URL' 
                ref={urlRef}
                onChange={handleUrlInput}
                />
            </div>
             { fieldErrors.url && <p className={S.error} aria-live='polite'>{ErrorMessages[fieldErrors.url]}</p> }
          </section>
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
              <span>{ userNickname || '닉네임을 입력해 주세요.' }</span>
              <h5>소개</h5>
              <span className={S["user-bio"]}>{ userBio 
                ? userBio.split('\n').map((line, idx) => (
                  <React.Fragment key={idx}>
                    {line}
                    <br />
                  </React.Fragment>
                )) 
                : '소개를 입력해 주세요.' }</span>
              <h5>URL</h5>
              <span>{ userUrl || '공유하고 싶은 URL을 입력해 주세요.' }</span>
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
          { fieldErrors.submit && <p className={S.error} aria-live='polite'>{ErrorMessages[fieldErrors.submit]}</p> }
          <button 
            type="button" 
            onClick={skipSubmitProfile} 
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