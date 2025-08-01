import React, { useEffect, useRef, useState } from "react";
import S from "./Settings.module.css";
import cameraIcon from "../../assets/icons/camera.svg";
import defaultAvatar from "../../assets/default-profile/default-avatar3.png";
import defaultHeader from "../../assets/default_header.svg";
import { uploadImage } from "../../supabase/storage/uploadImage";
import { upsertTable } from "../../supabase/upsertTable";
import { ErrorCode, ErrorMessages } from "../../lib/errorCodes";
import { checkNicknameExists } from "../../supabase/auth/checkNickname";
import { supabase } from "../../supabase/supabase"; // Storage 삭제용

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

interface SettingsProps {
  user: UserType | null;
  profile: ProfileType | null;
}

function Settings({ user, profile }: SettingsProps) {
  const [nickname, setNickname] = useState("");
  const [bio, setBio] = useState("");
  const [url, setUrl] = useState("");

  // 아바타
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>(defaultAvatar);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  // 배너
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
    setFieldErrors((prev) => ({ ...prev, avatar: undefined }));
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
    setFieldErrors((prev) => ({ ...prev, header: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (isSubmitting) return;

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
          try {
            const path = profile.avatar_url.split("/").pop();
            if (path) {
              await supabase.storage.from("avatars").remove([path]);
            }
          } catch (err) {
            console.warn("기존 아바타 삭제 실패:", err);
          }
        }
        const extension = avatarFile.name.split(".").pop()?.toLowerCase() || "png";
        const filePath = `user-avatar-${user.id}-${Date.now()}.${extension}`;
        const result = await uploadImage({
          bucketName: "avatars",
          file: avatarFile,
          path: filePath,
        });
        if (result.success) avatarUrl = result.url;
        else {
          console.error("Avatar upload error:", result.error);
          setFieldErrors((prev) => ({ ...prev, avatar: ErrorCode.AvatarUploadFail }));
          setIsSubmitting(false);
          return;
        }
      }

      let headerUrl = profile?.header_url || null;
      if (headerFile) {
        if (profile?.header_url) {
          try {
            const path = profile.header_url.split("/").pop();
            if (path) {
              await supabase.storage.from("headers").remove([path]);
            }
          } catch (err) {
            console.warn("기존 헤더 삭제 실패:", err);
          }
        }
        const extension = headerFile.name.split(".").pop()?.toLowerCase() || "png";
        const filePath = `user-header-${user.id}-${Date.now()}.${extension}`;
        const result = await uploadImage({
          bucketName: "headers",
          file: headerFile,
          path: filePath,
        });
        if (result.success) headerUrl = result.url;
        else {
          console.error("Header upload error:", result.error);
          setFieldErrors((prev) => ({ ...prev, header: ErrorCode.HeaderUploadFail }));
          setIsSubmitting(false);
          return;
        }
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

      if (error) {
        setFieldErrors((prev) => ({ ...prev, submit: ErrorCode.SubmitFail }));
        setIsSubmitting(false);
        return;
      }

      alert("프로필이 성공적으로 업데이트되었습니다.");
      window.location.reload();
    } catch (err) {
      console.error(err);
      setFieldErrors((prev) => ({ ...prev, submit: ErrorCode.Unexpected }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={S["settings-page"]}>
      <h1>Settings</h1>
      <hr />
      <div className={S["img-settings"]}>
        {/* 배너 */}
        <div className={S.banner}>
          <img
            src={headerPreview}
            alt="banner"
            className={S["banner-img"]}
          />
          <button type="button" className={S["camera-icon"]} onClick={handleHeaderClick}>
            <img src={cameraIcon} alt="마이페이지 배너 수정하기 버튼" />
          </button>
          <input
            type="file"
            accept="image/*"
            ref={headerInputRef}
            onChange={handleHeaderChange}
            className="a11y-hidden"
          />
          {fieldErrors.header && (
            <p className={S.error}>{ErrorMessages[fieldErrors.header]}</p>
          )}
        </div>

        {/* 아바타 */}
        <div className={S["avatar-wrapper"]}>
          <img
            src={avatarPreview}
            alt="avatar"
            className={S["avatar-img"]}
          />
          <button type="button" className={S["camera-icon"]} onClick={handleAvatarClick}>
            <img src={cameraIcon} alt="프로필 수정하기 버튼" />
          </button>
          <input
            type="file"
            accept="image/*"
            ref={avatarInputRef}
            onChange={handleAvatarChange}
            className="a11y-hidden"
          />
          {fieldErrors.avatar && (
            <p className={S.error}>{ErrorMessages[fieldErrors.avatar]}</p>
          )}
        </div>
      </div>

      <form className={S.form} onSubmit={handleSubmit}>
        <label>
          닉네임
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="닉네임을 입력하세요"
          />
          {fieldErrors.nickname && (
            <p className={S.error}>{ErrorMessages[fieldErrors.nickname]}</p>
          )}
        </label>

        <label>
          소개
          <input
            type="text"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="소개를 입력하세요"
          />
          {fieldErrors.bio && (
            <p className={S.error}>{ErrorMessages[fieldErrors.bio]}</p>
          )}
        </label>

        <label>
          URL
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="공유할 URL을 입력하세요"
          />
          {fieldErrors.url && (
            <p className={S.error}>{ErrorMessages[fieldErrors.url]}</p>
          )}
        </label>

        <button type="submit" className={S["submit-btn"]} disabled={isSubmitting}>
          {isSubmitting ? "저장 중..." : "저장"}
        </button>
        {fieldErrors.submit && (
          <p className={S.error}>{ErrorMessages[fieldErrors.submit]}</p>
        )}
      </form>
    </div>
  );
}

export default Settings;
