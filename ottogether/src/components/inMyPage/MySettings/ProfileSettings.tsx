import React, { useEffect, useRef, useState } from "react";
import S from "./ProfileSettings.module.css";
import cameraIcon from "../../../assets/icons/camera.svg";
import defaultAvatar from "../../../assets/default-profile/default-avatar3.png";
import defaultHeader from "../../../assets/default_header.svg";
import { uploadImage } from "../../../supabase/storage/uploadImage";
import { upsertTable } from "../../../supabase/upsertTable";
import { ErrorCode, ErrorMessages } from "../../../lib/errorCodes";
import { checkNicknameExists } from "../../../supabase/auth/checkNickname";
import { supabase } from "../../../supabase/supabase";

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

function ProfileSettings({ user, profile }: Props) {
  const [nickname, setNickname] = useState("");
  const [bio, setBio] = useState("");
  const [url, setUrl] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>(defaultAvatar);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [headerFile, setHeaderFile] = useState<File | null>(null);
  const [headerPreview, setHeaderPreview] = useState<string>(defaultHeader);
  const headerInputRef = useRef<HTMLInputElement>(null);

  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: ErrorCode | undefined }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    if (profile) {
      setNickname(profile.nickname || "");
      setBio(profile.bio || "");
      setUrl(profile.url || "");
      setAvatarPreview(profile.avatar_url ?? defaultAvatar);
      setHeaderPreview(profile.header_url ?? defaultHeader);
    }
  }, [profile]);

  const MAX_FILE_SIZE = 2 * 1024 * 1024;

  const validateNickname = (value: string): ErrorCode | undefined => {
    if (value.length > 20) return ErrorCode.NicknameTooLong;
    return undefined;
  };

  const validateBio = (value: string): ErrorCode | undefined => {
    if (value.length > 300) return ErrorCode.BioTooLong;
    return undefined;
  };

  const validateUrl = (url: string): ErrorCode | undefined => {
    if (!url) return undefined;
    try {
      const parsed = new URL(url);
      if (["http:", "https:"].includes(parsed.protocol)) return undefined;
    } catch {}
    return ErrorCode.InvalidUrl;
  };

  const handleAvatarClick = () => avatarInputRef.current?.click();
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setFieldErrors((prev) => ({ ...prev, avatar: ErrorCode.InvalidFileType }));
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setFieldErrors((prev) => ({ ...prev, avatar: ErrorCode.FileTooLarge }));
      return;
    }
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleHeaderClick = () => headerInputRef.current?.click();
  const handleHeaderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setFieldErrors((prev) => ({ ...prev, header: ErrorCode.InvalidFileType }));
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setFieldErrors((prev) => ({ ...prev, header: ErrorCode.FileTooLarge }));
      return;
    }
    setHeaderFile(file);
    setHeaderPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const nickErr = validateNickname(nickname);
      const bioErr = validateBio(bio);
      const urlErr = validateUrl(url);
      setFieldErrors({ nickname: nickErr, bio: bioErr, url: urlErr });
      if (nickErr || bioErr || urlErr) {
        setIsSubmitting(false);
        return;
      }

      if (nickname && nickname !== profile?.nickname) {
        const exists = await checkNicknameExists(nickname);
        if (exists) {
          setFieldErrors((prev) => ({ ...prev, nickname: ErrorCode.NicknameExists }));
          setIsSubmitting(false);
          return;
        }
      }

      let avatarUrl: string | null = profile?.avatar_url ?? null;
      if (avatarFile) {
        if (profile?.avatar_url) {
          const path = profile.avatar_url.split("/").pop();
          if (path) await supabase.storage.from("avatars").remove([path]);
        }
        const extension = avatarFile.name.split(".").pop()?.toLowerCase() || "png";
        const filePath = `user-avatar-${user.id}-${Date.now()}.${extension}`;
        const result = await uploadImage({ bucketName: "avatars", file: avatarFile, path: filePath });
        if (result.success) avatarUrl = result.url ?? null;
      }

      let headerUrl: string | null = profile?.header_url ?? null;
      if (headerFile) {
        if (profile?.header_url) {
          const path = profile.header_url.split("/").pop();
          if (path) await supabase.storage.from("headers").remove([path]);
        }
        const extension = headerFile.name.split(".").pop()?.toLowerCase() || "png";
        const filePath = `user-header-${user.id}-${Date.now()}.${extension}`;
        const result = await uploadImage({ bucketName: "headers", file: headerFile, path: filePath });
        if (result.success) headerUrl = result.url ?? null;
      }

      const { error } = await upsertTable({
        method: "upsert",
        tableName: "profile",
        uploadData: {
          user_id: user.id,
          nickname,
          bio,
          url,
          avatar_url: avatarUrl,
          header_url: headerUrl,
          updated_at: new Date().toISOString(),
        },
        matchKey: "user_id",
      });

      if (!error) {
        alert("프로필이 성공적으로 업데이트되었습니다.");
        window.location.reload();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={S["profile-settings"]}>
      <div className={S["img-settings"]}>
        <div className={S.banner}>
          <img src={headerPreview} alt="banner" className={S["banner-img"]} />
          <button type="button" className={S["camera-icon"]} onClick={handleHeaderClick}>
            <img src={cameraIcon} alt="마이페이지 배너 수정하기 버튼" />
          </button>
          <input type="file" accept="image/*" ref={headerInputRef} onChange={handleHeaderChange} className="a11y-hidden" />
        </div>

        <div className={S["avatar-wrapper"]}>
          <img src={avatarPreview} alt="avatar" className={S["avatar-img"]} />
          <button type="button" className={S["camera-icon"]} onClick={handleAvatarClick}>
            <img src={cameraIcon} alt="프로필 수정하기 버튼" />
          </button>
          <input type="file" accept="image/*" ref={avatarInputRef} onChange={handleAvatarChange} className="a11y-hidden" />
        </div>
      </div>

      <form className={S.form} onSubmit={handleSubmit}>
        <label>
          닉네임
          <input type="text" value={nickname} onChange={(e) => setNickname(e.target.value)} />
          { fieldErrors.nickname &&
          <p className={S.error} aria-live='polite'>{ErrorMessages[fieldErrors.nickname]}</p>
          }
        </label>
        <label>
          소개
          <input type="text" value={bio} onChange={(e) => setBio(e.target.value)} />
          { fieldErrors.bio &&
          <p className={S.error} aria-live='polite'>{ErrorMessages[fieldErrors.bio]}</p>
          }
        </label>
        <label>
          URL
          <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} />
          { fieldErrors.url &&
          <p className={S.error} aria-live='polite'>{ErrorMessages[fieldErrors.url]}</p>
          }
        </label>
        { fieldErrors.header &&
          <p className={S.error} aria-live='polite'>헤더 사진: {ErrorMessages[fieldErrors.header]}</p>
        }
        { fieldErrors.avatar &&
          <p className={S.error} aria-live='polite'>프로필 사진: {ErrorMessages[fieldErrors.avatar]}</p>
        }
        <button type="submit" className={S["submit-btn"]} disabled={isSubmitting}>
          {isSubmitting ? "저장 중..." : "저장"}
        </button>
      </form>
    </div>
  );
}

export default ProfileSettings;
